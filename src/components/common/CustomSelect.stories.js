import CustomSelect from "./CustomSelect.vue";
import langs from "../../config/i18n";

export default {
    component: CustomSelect,
    argTypes: {
        label: {},
        options: {},
        value: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CustomSelect },
    template: '<CustomSelect v-bind="$props" />',
});

export const Language = Template.bind({});
Language.args = {
    label: "言語",
    options: Object.keys(langs).map((v) => ({ value: v, text: langs[v].name })),
    value: "",
};
