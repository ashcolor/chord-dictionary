import CustomInputGroup from "./CustomInputGroup.vue";

export default {
    component: CustomInputGroup,
    argTypes: {
        label: {},
        slotcontent: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CustomInputGroup },
    template: '<CustomInputGroup v-bind="$props">{{ slotcontent }}</CustomInputGroup>',
});

export const Language = Template.bind({});
Language.args = {
    label: "言語",
    slotcontent: "Slot content here",
};
