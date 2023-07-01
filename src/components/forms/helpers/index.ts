import { type RegistrationFormFields } from "../RegistrationForm";
import { type MessageFormProps } from "../MessageForm";
import { type PasswordFormFields } from "../PasswordForm";
import { type AvatarFormProps } from "../AvatarForm";

type FieldType = keyof RegistrationFormFields | keyof MessageFormProps | keyof PasswordFormFields | keyof AvatarFormProps;

type validationValueType = (value: string | null, type: FieldType) => [boolean, string | null];

const emailReg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const passReg = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/;

const phoneReg = /^([+][0-9\s-\\(\\)]{10,15})*$/i;

export const validationValue: validationValueType = (value, type) => {
    switch (type) {
        case "firstName":
        case "secondName": {
            if (!value) return [true, "заполните поле"];

            const firstLatter = value[0];

            if (firstLatter === firstLatter.toLocaleUpperCase()) return [false, value];

            return [true, "напишите свою фамилию и имя с большой буквы"];
        }
        case "login": {
            if (!value) return [true, "заполните поле"];

            const valueLength = value.length;

            if (valueLength >= 3 && valueLength <= 20) return [false, value];

            return [true, "Логин должен быть от 3 до 20 символов включительно"];
        }
        case "email": {
            if (!value) return [true, "заполните поле"];

            if (emailReg.test(value)) return [false, value];

            return [true, "Введите корректный e-mail"];
        }
        case "newPassword":
        case "password": {
            if (!value) return [true, "заполните поле"];

            const valueLength = value.length;

            const isLengthEnough = valueLength >= 8 && valueLength <= 40;

            const correctPassord = passReg.test(value);

            if (correctPassord && isLengthEnough) return [false, value];

            return [true, "Пароль от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра"];
        }
        case "phone": {
            if (!value) return [true, "заполните поле"];

            const correctPassord = phoneReg.test(value);

            if (correctPassord) return [false, value];

            return [true, "Телефон от 10 до 15 символов, состоит из цифр, может начинается с плюса"];
        }
        case "message": {
            if (!value) return [true, "напишите сообщение"];

            return [false, value];
        }
        case "avatar": {
            if (!value) return [true, "укажите ссылку на аватар"];
            return [false, value];
        }
        case "displayName": {
            if (!value) return [true, "укажите имя в чате"];

            return [false, value];
        }
        default: {
            return [false, value];
        }
    }
};
