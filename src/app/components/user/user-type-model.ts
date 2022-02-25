export enum UserType {
    USER = 0,
    ADMIN = 1
}

export class UserAccount{
   fullName:string;
   password:string;
   userName:string;
   email:string;
   admin:boolean;
}
