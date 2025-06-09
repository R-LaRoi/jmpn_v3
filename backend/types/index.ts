export type Profile = {
email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  created_at: Date;
  password?: string;
};

export type Routine = {
  duration: string;
  type: string;
  level: string;
  date: string;
  weekday: string;
  exercises: string[];
};