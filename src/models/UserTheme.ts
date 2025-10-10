export interface UserTheme {
  $id: string;
  userId: string;
  themeName: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface CreateUserThemeData {
  userId: string;
  themeName: string;
}

export interface UpdateUserThemeData {
  themeName: string;
}
