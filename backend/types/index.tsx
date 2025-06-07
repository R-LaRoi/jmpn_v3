export type Profile = {
  _id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
};

export type Routine = {
  _id: string;
  user_id: string;
  content: string;
  date: string;
  created_at: string;
};