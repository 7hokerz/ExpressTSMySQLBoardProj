import { 
    DAOFactory, 
    HttpError, 
    AuthMiddleware, 
    jwtToken,
    withConnection,
    UserDTO,
    TransactionError,
} from '../utils/shared-modules';
/*
    입력값에 대한 기본 검증은 연결을 하지 않고도 할 수 있도록 변경 필요
*/
class PasswordManager {
    private static readonly SALT_ROUNDS = 10;

    static async hashing(password: string): Promise<string> {
        const bcrypt = await import('bcrypt'); // 해싱
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async comparePwd(input_Pw: string, DB_Pw: string): Promise<boolean> {
        const bcrypt = await import('bcrypt'); // 해싱
        return bcrypt.compare(input_Pw, DB_Pw);
    }
}

class userService {
    #daofactory: DAOFactory;
    private readonly jwttoken: jwtToken;
    private readonly auth: AuthMiddleware;

    constructor() { // 생성자
        this.jwttoken = new jwtToken();
        this.auth = new AuthMiddleware();
        this.#daofactory = DAOFactory.getInstance();
    }

    @withConnection<void>(false, HttpError)
    async signup(username: string, password: string): Promise<void> {
        const connection = arguments[arguments.length - 1];

        if(!this.auth.regCheck(username, password)){
            throw new HttpError(400, `올바르지 않은 입력입니다.`);
        }
        const userDAO = this.#daofactory.createUserDAO(connection);
        const user = await userDAO.getUser(username);
        if(user){
            throw new HttpError(400, `duplicate username: ${username}`);
        }
        const hashedPwd = await PasswordManager.hashing(password);

        await userDAO.createUser({username, password: hashedPwd});
    }

    @withConnection<void>(true, HttpError, TransactionError)
    async withdraw(user_id: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const userDAO = this.#daofactory.createUserDAO(connection);
        const refreshTokenDAO = this.#daofactory.createRefreshTokenDAO(connection);

        await refreshTokenDAO.deleteAllByUser(user_id);
        await userDAO.removeUser(user_id);
    }

    @withConnection<string>(false, HttpError)
    async login(username: string, password: string): Promise<number> {
        const connection = arguments[arguments.length - 1];
        const userDAO = this.#daofactory.createUserDAO(connection);
        const refreshTokenDAO = this.#daofactory.createRefreshTokenDAO(connection);
        
        const user = await userDAO.getUser(username);
        if(!this.auth.regCheck(username, password)){
            throw new HttpError(400, `올바르지 않은 입력입니다.`);
        }

        if (user === null || user === undefined) {
            throw new HttpError(400, `존재하지 않는 이름: ${username}`);
        }
        const pwdState = await PasswordManager.comparePwd(password, user.getPwd() as string);

        if (!pwdState) {
            throw new HttpError(400, `패스워드 불 일 치`);
        }
        await refreshTokenDAO.deleteAllByUser(user.user_id);

        return user.user_id;
    }

    @withConnection(false, HttpError)
    async logout(user_id: number): Promise<void> {
        const connection = arguments[arguments.length - 1];
        const refreshTokenDAO = this.#daofactory.createRefreshTokenDAO(connection);
        await refreshTokenDAO.deleteAllByUser(user_id);
    }

    @withConnection<string>(false, HttpError)
    async renderUserPage(username: string): Promise<UserDTO> {
        const connection = arguments[arguments.length - 1];
        const userDAO = this.#daofactory.createUserDAO(connection);
        const user = await userDAO.getUser(username);

        if (user === null || user === undefined) {
            throw new HttpError(400, `존재하지 않는 유저: ${username}`);
        }
        return user;
    }

    @withConnection<string>(false, HttpError)
    async edit(curUsername : string, newUser: any): Promise<any> {
        const connection = arguments[arguments.length - 1];
        const userDAO = this.#daofactory.createUserDAO(connection);
        
        const user = await userDAO.getUser(newUser.username);
        
        if(newUser.username !== curUsername && user){ // 작성자 검증
            throw new HttpError(400, `duplicate username: ${newUser.username}`);
        }
        const curUser = await userDAO.getUser(curUsername);

        if(!(curUser?.user_id)){// 회원 유무 검증
            throw new HttpError(400, `올바르지 않은 유저: ${curUsername}`);
        }
        const pwdState = await PasswordManager.comparePwd(newUser.curPw, curUser.getPwd() as string);

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

export default new userService();