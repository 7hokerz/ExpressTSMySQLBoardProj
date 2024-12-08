import bcrypt from 'bcrypt';
import { 
    HttpError, 
    jwtToken,
    withConnection,
    Validation
} from '../utils/shared-modules';
import { UserDTO } from '../domain/entities';
import { DAOFactory, UserDAO, RefreshTokenDAO } from '../daos';

class PasswordManager {
    private static readonly SALT_ROUNDS = 10;

    static async hashing(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async comparePwd(input_Pw: string, DB_Pw: string): Promise<boolean> {
        return bcrypt.compare(input_Pw, DB_Pw);
    }
}

interface UserInput {
    username: string;
    password: string;
}

export default class UserService {
    private readonly jwttoken: jwtToken = new jwtToken();
    private daofactory!: DAOFactory;

    private async validateUserInput(input: UserInput): Promise<void> {
        Validation.validUserInput([
            { value: input.username },
            { value: input.password }
        ]);
    } 

    @withConnection(false)
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

    @withConnection(true)
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

    @withConnection(false)
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
        const pwdState = await PasswordManager.comparePwd(password, user.password);

        if (!pwdState) {
            throw new HttpError(400, `패스워드 불 일 치`);
        }
        await refreshTokenDAO.deleteAllByUser(user.id);

        return new UserDTO(
            user.id,
        );
    }

    @withConnection(false)
    async logout(user_id: number): Promise<void> {
        const refreshTokenDAO = this.daofactory.getDAO(RefreshTokenDAO);
        await refreshTokenDAO.deleteAllByUser(user_id);
    }

    @withConnection(false)
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

    @withConnection(false)
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

        if(!(curUser?.user_id)){// 회원 유무 검증
            throw new HttpError(400, `올바르지 않은 유저: ${curUsername}`);
        }
        const pwdState = await PasswordManager.comparePwd(newUser.curPw, curUser.password);

        if (!pwdState) {// 패스워드 일치 검증
            throw new HttpError(400, '패스워드 불일치');
        }
        const hashedPwd = await PasswordManager.hashing(newUser.password);

        await userDAO.editUser(curUser.user_id, {
            ...newUser, 
            password : hashedPwd,
        });
        const accessToken = this.jwttoken.generateAccessToken(newUser.username, curUser.user_id);
        const refreshToken = this.jwttoken.generateRefreshToken(newUser.username, curUser.user_id);

        return { accessToken, refreshToken };
    }
}