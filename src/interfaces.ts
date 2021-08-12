export interface IDog {
  id: string;
  name: string;
  isAGoodDog: boolean;
}

export interface IUser {
  _id: string;
  isAnonymous: boolean;
  refreshCount: number;
  email?: string;
  password?: string;
  salt?: string;
}
