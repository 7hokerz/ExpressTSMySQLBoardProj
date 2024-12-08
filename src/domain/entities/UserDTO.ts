
export class UserDTO {
    constructor(
        readonly user_id: number, 
        readonly username?: string, 
        private readonly pwd? : string,
    ){}

    getPwd(): string | undefined { 
        return this.pwd;
    }
}