import { PAYMENT_METHOD_CODE } from '@/pages/constants';
import * as yup from 'yup';

export default function useYupSchema() {
    const { t } = useNuxtApp().$i18n;
    const getRequiredMessage = (field) => {
        return t('error.field_is_required', { field: t(`form.${field}`) });
    };

    const defaultPaymentRules = {
        amount: yup.number().required(getRequiredMessage('amount')),
        method: yup.string().required(),
        bank_branch: yup
            .object(),
        crypto_type: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.CRYPTOCURRENCY,
                then: (schema) => schema.required(t('error.crypto_type_required')),
            }),
        crypto_address: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.CRYPTOCURRENCY,
                then: (schema) => schema.required(t('error.crypto_address_required')),
            }),
    };

    const depositPaymentSchema = yup.object().shape({
        ...defaultPaymentRules,
        bank: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank')),
            }),
        bank_account: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank_branch')),
            }),
        bank_account_name: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank_account_name')),
            }),
        bank_account_type: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.BANK_TRANSFER,
                then: (schema) => schema.required(),
            }),
        credit_card_number: yup //TODO: wait for more detail
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.CREDIT_CARD,
                then: (schema) => schema.required(getRequiredMessage('credit_card_number')),
            }),
        credit_card_name: yup //TODO: wait for more detail
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.CREDIT_CARD,
                then: (schema) => schema.required(getRequiredMessage('credit_card_name')),
            }),
        credit_card_expiration_date: yup //TODO: wait for more detail
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.CREDIT_CARD,
                then: (schema) => schema.required(getRequiredMessage('credit_card_expiration_date')),
            }),
    });

    const withdrawalPaymentSchema = yup.object().shape({
        ...defaultPaymentRules,
        bank: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.ID_BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank')),
            }),
        bank_account: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.ID_BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank_branch')),
            }),
        bank_account_name: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.ID_BANK_TRANSFER,
                then: (schema) => schema.required(getRequiredMessage('bank_account_name')),
            }),
        bank_account_type: yup
            .string()
            .when('method', {
                is: PAYMENT_METHOD_CODE.ID_BANK_TRANSFER,
                then: (schema) => schema.required(),
            }),
    });

    const signInSchema = yup.object().shape({
        email: yup.string().email().required(getRequiredMessage('email')),
        password: yup.string().required(getRequiredMessage('password')),
    });

    const signUpSchema = yup.object().shape({
        country: yup.string().required(getRequiredMessage('country')),
        phone: yup.string().required(getRequiredMessage('phone_number')),
        display_name: yup.string().required(getRequiredMessage('display_name')),
        email: yup.string().email().required(getRequiredMessage('email')),
        password: yup
            .string()
            .required(getRequiredMessage('password'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,32}$/, t('error.password_not_conform_to_requirement')),
        password_confirm: yup
            .string()
            .required(getRequiredMessage('password_confirm'))
            .oneOf([yup.ref('password'), null], t('error.password_do_not_match')),
    });

    const resetPasswordSchema = yup.object().shape({
        password: yup
            .string()
            .required(getRequiredMessage('new_password'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,32}$/, t('error.password_not_conform_to_requirement')),
        password_confirm: yup
            .string()
            .required(getRequiredMessage('new_password_confirm'))
            .oneOf([yup.ref('password'), null], t('error.password_do_not_match')),
    });

    return {
        depositPaymentSchema,
        withdrawalPaymentSchema,
        signInSchema,
        signUpSchema,
        resetPasswordSchema,
    };
}
