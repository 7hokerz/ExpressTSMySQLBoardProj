import bcrypt from 'bcrypt';
import { TokenUtil, Validation } from '../utils/';
import { withDB, Transaction } from "../decorators";
import { HttpError } from '../errors';
import { UserDTO } from '../domain/entities';
import { DAOFactory, UserDAO, RefreshTokenDAO } from '../daos';
import { inject, injectable } from 'tsyringe';

class PasswordManager {
    private static readonly SALT_ROUNDS = 10;

    static async hashing(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async comparePwd(input_Pw: string, DB_Pw: string): Promise<void> {
        const pwdState = bcrypt.compare(input_Pw, DB_Pw);
        if (!pwdState) {// 패스워드 일치 검증
            throw new HttpError(400, '패스워드 불일치');
        }
    }
}

interface UserInput {
    username: string;
    password: string;
}

@injectable()
@withDB
export default class UserService {
    private daofactory!: DAOFactory;

    constructor(
        @inject(TokenUtil) private readonly jwttoken: TokenUtil = new TokenUtil()
    ) {}

    private async validateUserInput(input: UserInput): Promise<void> {
        Validation.validUserInput([
            { value: input.username },
            { value: input.password }
        ]);
    } 

    async signup(username: string, password: string): Promise<void> {
        await this.validateUserInput({ username, password });

        const userDAO = this.daofactory.getDAO(UserDAO);
        const user = await userDAO.getUser(username);
        if(user){
            throw new HttpError(400, `duplicate username: ${username}`);
        }
        const hashedPwd = await PasswordManager.hashing(password);

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

    async login(username: string, password: string): Promise<UserDTO> {
        await this.validateUserInput({ username, password });
        const [userDAO, refreshTokenDAO] = await Promise.all([
            this.daofactory.getDAO(UserDAO),
            this.daofactory.getDAO(RefreshTokenDAO),
        ]);
        
        const user = await userDAO.getUser(username);
        
        if (!user) {
            throw new HttpError(400, `존재하지 않는 이름: ${username}`);
        }
        await PasswordManager.comparePwd(password, user.password);

        await refreshTokenDAO.deleteAllByUser(user.id);

        return new UserDTO(
            user.id,
        );
    }

    async logout(user_id: number): Promise<void> {
        const refreshTokenDAO = this.daofactory.getDAO(RefreshTokenDAO);
        await refreshTokenDAO.deleteAllByUser(user_id);
    }

    async renderUserPage(username: string): Promise<UserDTO> {
        const userDAO = this.daofactory.getDAO(UserDAO);
        const user = await userDAO.getUser(username);

        if (!user) {
            throw new HttpError(400, `존재하지 않는 유저: ${username}`);
        }
        return new UserDTO(
            user.user_id,
            user.username,
            user.pwd,
        );
    }

    async edit(curUsername : string, newUser: any): Promise<any> {
        await Promise.all([
            Validation.validUserInput([{ value: newUser.username }]),
            Validation.validUserInput([{ value: newUser.password }])
        ]);
        const userDAO = this.daofactory.getDAO(UserDAO);
        
        const user = await userDAO.getUser(newUser.username);
        
        if(newUser.username !== curUsername && user){ // 작성자 검증
            throw new HttpError(400, `duplicate username: ${newUser.username}`);
        }
        const curUser = await userDAO.getUser(curUsername);
        
        if(!(curUser.id)){// 회원 유무 검증
            throw new HttpError(400, `올바르지 않은 유저: ${curUsername}`);
        }
        await PasswordManager.comparePwd(newUser.curPw, curUser.password);

        const hashedPwd = await PasswordManager.hashing(newUser.password);

        await userDAO.editUser(curUser.id, {
            ...newUser, 
            password : hashedPwd,
        });
        
        const [accessToken, refreshToken] = await Promise.all([
            this.jwttoken.generateAccessToken(newUser.username, curUser.id),
            this.jwttoken.generateRefreshToken(newUser.username, curUser.id),
        ]);
        return { accessToken, refreshToken };
    }
}