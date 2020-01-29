import {LocaleObject, setLocale} from 'yup';

const ptBR: LocaleObject = {
    mixed: {
        required: "${path} é obrigatório",
        notType: "${path} é inválido",
    },
    string: {
        max: "${path} deve ter no máximo ${max} caracteres"
    },
    number: {
        min: "${path} deve ter no mínimo ${min}"
    },
}

setLocale(ptBR);

export * from 'yup';