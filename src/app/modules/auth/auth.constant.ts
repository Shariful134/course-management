export const USER_ROLE = {
  admin: "admin",
  student: "student",
  instructor: "instructor",
} as const;

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export const userSearchableFields = [
  "name",
  "email",
  "firstName",
  "lastName",
  "address",
  "country",
  "role",
];
