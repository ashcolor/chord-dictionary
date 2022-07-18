import CustomToggle from "./CustomToggle.vue";

export default {
    component: CustomToggle,
    argTypes: {
        label: {},
        value: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CustomToggle },
    template: '<CustomToggle v-bind="$props" />',
});

export const Roma = Template.bind({});
Roma.args = {
    label: "ローマ数字表記",
    value: "",
};
