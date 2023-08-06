import { type RegistrationFormFields, type AuthorizationFormFields, type AvatarFormFields, type MessageFormFields, type PasswordFormFields, type UserFormFields } from "./fields";

type FieldType = keyof UserFormFields |
keyof AuthorizationFormFields |
keyof AvatarFormFields |
keyof MessageFormFields |
keyof PasswordFormFields |
keyof RegistrationFormFields;

export type {
    FieldType,
    AuthorizationFormFields,
    AvatarFormFields,
    MessageFormFields,
    PasswordFormFields,
    RegistrationFormFields
};
