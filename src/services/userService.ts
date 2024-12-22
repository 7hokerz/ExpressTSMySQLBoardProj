import bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { TokenUtil } from '../utils';
import { withDB, Transaction } from "../decorators";
import { BadRequestError } from '../errors';
import { UserRequestDto, UserResponseDto } from '../domain/entities';
import { DAOFactory, UserDAO, RefreshTokenDAO } from '../daos';

class PasswordManager {
    private static readonly SALT_ROUNDS = 10; // 10개의 해시를 생성, 약 100ms

    static async hashing(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async comparePwd(input_Pw: string, DB_Pw: string): Promise<void> {
        const pwdState = await bcrypt.compare(input_Pw, DB_Pw);
        
        if (!pwdState) {// 패스워드 일치 검증
            throw new BadRequestError('패스워드 불일치');
        }
    }
}

@injectable()
@withDB
export default class UserService {
    private daofactory!: DAOFactory;

    constructor(
        @inject(TokenUtil) private readonly jwttoken: TokenUtil
    ) {}

    async signup(userReq: UserRequestDto): Promise<void> {
        const userDAO = this.daofactory.getDAO(UserDAO);
        const { username } = userReq;

        const user = await userDAO.getUser(username);
        if(user){
            throw new BadRequestError(`duplicate username: ${username}`);
        }
        const hashedPwd = await PasswordManager.hashing(userReq.getPwd());

        await userDAO.createUser({username, password: hashedPwd});
    }

    @Transaction
    async withdraw(userId: number): Promise<void> {
        const [userDAO, refreshTokenDAO] = await Promise.all([
            this.daofactory.getDAO(UserDAO),
            this.daofactory.getDAO(RefreshTokenDAO),
        ]);
        await Promise.all([
            refreshTokenDAO.deleteAllByUser(userId),
            userDAO.removeUser(userId)
        ]);
    }

    async login(userReq: UserRequestDto): Promise<UserResponseDto> {
        const [userDAO, refreshTokenDAO] = await Promise.all([
            this.daofactory.getDAO(UserDAO),
            this.daofactory.getDAO(RefreshTokenDAO),
        ]);
        const { username } = userReq;
        
        const user = await userDAO.getUser(username);
        
        if (!user) {
            throw new BadRequestError(`존재하지 않는 이름: ${username}`);
        }
        await PasswordManager.comparePwd(userReq.getPwd(), user.password);

        await refreshTokenDAO.deleteAllByUser(user.id);

        return new UserResponseDto(
            user.id,
        );
    }

    async logout(user_id: number): Promise<void> {
        const refreshTokenDAO = this.daofactory.getDAO(RefreshTokenDAO);
        await refreshTokenDAO.deleteAllByUser(user_id);
    }

    async edit(currentUserReq: UserRequestDto, newUserReq: UserRequestDto): Promise<any> {
        const userDAO = this.daofactory.getDAO(UserDAO);
        
        const user = await userDAO.getUser(newUserReq.username);
        
        if(newUserReq.username !== currentUserReq.username && user){ // 작성자 검증
            throw new BadRequestError(`duplicate username: ${newUserReq.username}`);
        }
        const currentUser = await userDAO.getUser(currentUserReq.username);
        
        if(!(currentUser.id)){// 회원 유무 검증
            throw new BadRequestError(`존재하지 않는 유저: ${currentUserReq.username}`);
        }
        await PasswordManager.comparePwd(currentUserReq.getPwd(), currentUser.password);
        
        const hashedPwd = await PasswordManager.hashing(newUserReq.getPwd());

        await userDAO.editUser(currentUser.id, {
            ...newUserReq, 
            password : hashedPwd,
        });
        
        const [accessToken, refreshToken] = await Promise.all([
            this.jwttoken.generateAccessToken(newUserReq.username, currentUser.id),
            this.jwttoken.generateRefreshToken(newUserReq.username, currentUser.id),
        ]);
        return { accessToken, refreshToken };
    }

    async renderUserPage(username: string): Promise<UserResponseDto> {
        const userDAO = this.daofactory.getDAO(UserDAO);
        const user = await userDAO.getUser(username);

        if (!user) {
            throw new BadRequestError(`존재하지 않는 유저: ${username}`);
        }
        return new UserResponseDto(
            user.user_id,
            user.username
        );
    }
}