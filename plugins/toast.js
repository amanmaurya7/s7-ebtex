import { useToast } from 'primevue/usetoast';

export default defineNuxtPlugin(() => {
    const toast = useToast();

    const showToast = (status, summary, detail, notificationIcon = null, normalIcon = null) => {
        const content = {
            severity: status,
            summary: summary,
            detail,
            life: 3000,
            contentStyleClass: 'slidedown animation-duration-300 animation-ease-out' + (notificationIcon ? `--ICON--${notificationIcon} is-notification` : '') + ' ' + (normalIcon ? `--ICON--${normalIcon}` : ''),
        };
        toast.add(content);
    };

    return {
        provide: { showToast },
    };
});
