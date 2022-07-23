import CustomToggleButton from "./CustomToggleButton.vue";

export default {
    component: CustomToggleButton,
    argTypes: {
        icon: {},
        value: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CustomToggleButton },
    template: '<CustomToggleButton v-bind="$props" />',
});

export const Setting = Template.bind({});
Setting.args = {
    icon: "ant-design:setting-filled",
    value: "",
};
