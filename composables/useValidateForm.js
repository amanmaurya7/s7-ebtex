export default function useValidateForm() {
    const { $showToast } = useNuxtApp();
    const { t } = useNuxtApp().$i18n;

    async function validateForm({ payload, schema }) {
        let isValid = false;

        try {
            await schema.validate(payload, { abortEarly: false });
            isValid = true;
        } catch (error) {
            if (error.errors?.length) {
                error.errors.forEach(message => {
                    $showToast('error', message);
                });
            } else {
                $showToast('error', t('error.please_fill_in_required_fields'));
            }
        }

        return isValid;
    }

    return {
        validateForm,
    };
}
