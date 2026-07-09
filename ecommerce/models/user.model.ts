export interface UserRegistrationRequest {

    email : string;
    password : string;
    confirmPassword : string;
    firstName : string;
    lastName : string;
    phone : string;

}

export interface User {
    email : string;
    firstName : string;
    lastName : string;
    phone : string;
    enabled? : boolean;
    role? : string;
    fullName? : string;
}

export interface LoginRequest{
    email : string;
    password : string;
}

export interface UpdatePasswordRequest{
    oldPassword : string;
    password : string;
    confirmPassword : string;
}