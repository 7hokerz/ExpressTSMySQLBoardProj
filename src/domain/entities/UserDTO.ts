import { IsString, IsNumber, IsOptional, MinLength, Matches } from "class-validator";

export class UserRequestDto {
    @IsString() @MinLength(2)
    @Matches(
        /^[a-zA-Z0-9\s*!]+$/,
        {
            message: '알파벳 및 공백, *, !만 허용'
        }
    )
    readonly username: string;

    @IsString() @MinLength(2)
    @Matches(
        /^[a-zA-Z0-9\s*!]+$/,
        {
            message: '알파벳 및 공백, *, !만 허용'
        }
    )
    private readonly password: string;

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }

    getPwd(): string { 
        return this.password;
    }
}

export class UserResponseDto {
    readonly user_id: number;

    @IsOptional()
    readonly username?: string;

    @IsOptional()
    private readonly pwd? : string;

    constructor(user_id: number, username?: string, pwd? : string){
        this.user_id = user_id;
        this.username = username;
        this.pwd = pwd;
    }

    getPwd(): string | undefined { 
        return this.pwd;
    }
}

/*export class UserDTO {
    @IsNumber()
    readonly user_id: number;

    @IsOptional()
    @IsString()
    readonly username?: string;

    @IsOptional()
    @IsString()
    private readonly pwd? : string;

    constructor(user_id: number, username?: string, pwd? : string){
        this.user_id = user_id;
        this.username = username;
        this.pwd = pwd;
    }

    getPwd(): string | undefined { 
        return this.pwd;
    }
}*/