import PrimeVue from 'primevue/config';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Checkbox from 'primevue/checkbox';
import Chart from 'primevue/chart';
import Chip from 'primevue/chip';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Galleria from 'primevue/galleria';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Password from 'primevue/password';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';
import Slider from 'primevue/slider';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Panel from 'primevue/panel';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import Image from 'primevue/image';
import '@/assets/styles.scss';
import OverlayPanel from 'primevue/overlaypanel';

export default defineNuxtPlugin(nuxtApp => {
    const app = nuxtApp.vueApp;
    app.use(PrimeVue, {
        ripple: true,
        pt: {
            button: {
                root: { class: 'cursor-pointer' },
            },
            inputnumber: {
                input: { inputmode: 'numeric' },
            },
        },
    });

    app.directive('ripple', Ripple);
    app.use(ToastService);

    app.component('Image', Image);
    app.component('Accordion', Accordion);
    app.component('AccordionTab', AccordionTab);
    app.component('Button', Button);
    app.component('Badge', Badge);
    app.component('Checkbox', Checkbox);
    app.component('Chart', Chart);
    app.component('Chip', Chip);
    app.component('Column', Column);
    app.component('DataTable', DataTable);
    app.component('Dialog', Dialog);
    app.component('Divider', Divider);
    app.component('Dropdown', Dropdown);
    app.component('Galleria', Galleria);
    app.component('InputNumber', InputNumber);
    app.component('InputText', InputText);
    app.component('InputSwitch', InputSwitch);
    app.component('Password', Password);
    app.component('SelectButton', SelectButton);
    app.component('Sidebar', Sidebar);
    app.component('Slider', Slider);
    app.component('Toast', Toast);
    app.component('Textarea', Textarea);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('Card', Card);
    app.component('Carousel', Carousel);
    app.component('Panel', Panel);
    app.component('TabView', TabView);
    app.component('TabPanel', TabPanel);
    app.component('RadioButton', RadioButton);
    app.component('OverlayPanel', OverlayPanel);
    app.component('ProgressBar', ProgressBar);
});
