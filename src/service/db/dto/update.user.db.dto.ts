export interface UpdateUserDbDto {
  user_id: string;
  code?: string;
  password?: string;
  name_first?: string;
  name_last?: string;
  description?: string;
  mail?: string;
  role?: string;
  active?: boolean;
}
