import { type RegistrationFormFields } from "../RegistrationForm";
import { type MessageFormProps } from "../MessageForm";
import { type PasswordFormFields } from "../PasswordForm";
import { type AvatarFormProps } from "../AvatarForm";

type FieldType = keyof RegistrationFormFields | keyof MessageFormProps | keyof PasswordFormFields | keyof AvatarFormProps;

type validationValueType = (value: string, type: FieldType) => string | null;

const emailReg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const passReg = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/;

const phoneReg = /^([+][0-9\s-\\(\\)]{10,15})*$/i;

export const validationValue: validationValueType = (value, type) => {
    switch (type) {
        case "firstName":
        case "secondName": {
            const firstLatter = value[0];

            if (firstLatter === firstLatter.toLocaleUpperCase()) return value;

            console.error("напишите свою фамилию и имя с большой буквы");

            return null;
        }
        case "login": {
            const valueLength = value.length;

            if (valueLength >= 3 && valueLength <= 20) return value;

            console.error("Придумайте логин от 3 до 20 символов включительно");

            return null;
        }
        case "email": {
            if (emailReg.test(value)) return value;

            console.error("Введите корректный e-mail");

            return null;
        }
        case "newPassword":
        case "password": {
            const valueLength = value.length;

            const isLengthEnough = valueLength >= 8 && valueLength <= 40;

            const correctPassord = passReg.test(value);

            if (correctPassord && isLengthEnough) return value;

            console.error("Пароль от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра");

            return null;
        }
        case "phone": {
            const correctPassord = phoneReg.test(value);

            if (correctPassord) return value;

            console.error("Телефон от 10 до 15 символов, состоит из цифр, может начинается с плюса");

            return null;
        }
        case "message": {
            if (!value) {
                console.error("напишите сообщение");

                return null;
            }
            return value;
        }
        case "avatar": {
            if (!value) {
                console.error("укажите ссылку на аватар");

                return null;
            }
            return value;
        }
        default: {
            return value;
        }
    }
};
