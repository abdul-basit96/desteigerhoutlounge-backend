export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface IProduct {
  name: string,
  price: number,
  description: string,
  size: string,
  width: string,
  length: string,
  height: string,
  quantity: number
}

export interface IProductReturn {
  id: number,
  name: string,
  price: number,
  description: string,
  size: string,
  width: string,
  length: string,
  height: string,
  quantity: number
}