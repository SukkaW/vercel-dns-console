export interface VercelUser {
  id: string;
  avatar: string;
  createdAt: number;
  email: string;
  username: string;
  name?: string;
  limited?: boolean;
}

export interface VercelUserResponse {
  user: VercelUser;
}
