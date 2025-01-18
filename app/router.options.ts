import { RouterOptions } from 'vue-router';

const routerOptions: RouterOptions = {
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            const targetElement = document.querySelector(to.hash);

            if(!targetElement) {
                return false;
            }

            const scrollBehaviorMarginTop = 30; // Set the desired offset value

            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - scrollBehaviorMarginTop;

            return window.scrollTo({ top, behavior: 'smooth' });
        }

        return savedPosition || { left: 0, top: 0 };
    },
};

export default routerOptions;
