

interface UserType {
    username: string;
    password: string;
}

export interface IUserRepository {
    getUser(username: string): Promise<any>;
    createUser(newUser: UserType): Promise<void>;
    removeUser(userId: number): Promise<void>;
    editUser(curUserId: number, editUser: UserType): Promise<void>;
}