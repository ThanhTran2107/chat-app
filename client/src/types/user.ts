export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string; // non ? for required fields that are still expected to be present in the user object
  bio?: string; // ? for optional fields
  avatarUrl?: string;
  avatarId?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}
