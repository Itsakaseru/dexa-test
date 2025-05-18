export interface LoginData {
  email: string,
  password: string,
}

export interface UserData {
  id?: number,
  email: string,
  hash: string,
  createdAt: Date,
  updatedAt: Date,
}