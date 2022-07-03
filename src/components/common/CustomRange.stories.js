import CustomRange from "./CustomRange.vue";

export default {
    component: CustomRange,
    argTypes: {
        value: {},
        min: {},
        max: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CustomRange },
    template: '<CustomRange v-bind="$props" />',
});

export const Volume = Template.bind({});
Volume.args = {
    value: "",
    min: 0,
    max: 100,
};
