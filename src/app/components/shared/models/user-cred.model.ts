export class UserCred {
  token: string;
  validTo: Date;
  user: User;
  constructor() {
  }

}

export class User {
  username: string;
  email: string;
  roles: Array<string>;
  constructor()
  {}
}
