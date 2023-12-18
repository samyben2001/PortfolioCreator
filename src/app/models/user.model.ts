export interface UserLogin{
     email: string;
     password: string;
}

export interface UserRegister extends UserLogin{
     checkPassword: string;
}

export interface User extends UserRegister{
     id: string;
}
