type Value = string | null;

export interface AuthorizationFormFields { login: Value; password: Value };

export interface AvatarFormFields { avatar: Value };

export interface MessageFormFields { message: Value };

export interface PasswordFormFields {
    password: Value;
    newPassword: Value;
    newPassword2?: Value;
};

export interface RegistrationFormFields {
    first_name: Value;
    second_name: Value;
    login: Value;
    email: Value;
    phone: Value;
    password: Value;
    password2?: Value;
};

export interface UserFormFields {
    avatar: Value;
    display_name: Value;
    first_name: Value;
    id: Value;
    login: Value;
    second_name: Value;
    email: Value;
    login: Value;
    // firstName: Value;
    // displayName: Value;
    // secondName: Value;
    phone: Value;
    password: Value;
    password2?: Value;
};
