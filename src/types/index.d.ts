export interface IUserInfo {
  identity_id: string;
  id: string;
  user_id: string;
  provider: "google" | string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;

  identity_data: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
}
