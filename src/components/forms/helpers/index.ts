import { type FieldType } from "../types";

interface Result<T> { newValue: Partial<T>; newErrors: Partial<T>; success: boolean };

const emailReg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const passReg = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/;

const phoneReg = /^([+][0-9\s-\\(\\)]{10,15})*$/i;

const validateValue = ({ type, value }: { type: FieldType; value: string | null | undefined }): [boolean, string] => {
    switch (type) {
        case "id": {
            return [false, value ?? ""];
        }
        // case "firstName":
        // case "secondName":
        case "display_name": {
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
        case "password2":
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
        // case "displayName": {
        //     if (!value) return [true, "укажите имя в чате"];

        //     return [false, value];
        // }
        default: {
            return [false, "поле без валидации"];
        }
    }
};

export const validationFields = <T extends Partial<Record<FieldType, string | null>>>(keys: FieldType | FieldType[], value: T): Result<T> => {
    const newValue: T = { ...value };
    let newErrors: Partial<T> = {};

    const currentKeys = Array.isArray(keys) ? keys : [keys];

    currentKeys.forEach((key) => {
        if (key === "password2" && newValue.password2) {
            const isError = newValue.password2 === newValue.password;

            newErrors = isError
                ? newErrors
                : {
                    ...newErrors,
                    password: "пароли не совпадают",
                    password2: "пароли не совпадают"
                };
            return;
        }

        const [isError, textError] = validateValue({ type: key, value: newValue[key] });

        if (isError) {
            newErrors = { ...newErrors, [key]: textError };
            return;
        }

        newErrors = { ...newErrors, [key]: null };
    });

    const success = !Object.values(newErrors).filter(Boolean).length;

    return {
        newValue,
        newErrors,
        success
    };
};
