import Setting from "./Setting.vue";

export default {
    component: Setting,
    argTypes: {
        settings: {},
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Setting },
    template: '<Setting v-bind="$props" />',
});

export const Normal = Template.bind({});
Normal.args = {
    settings: {
        isShow: null,
        language: null,
        key: 0,
        offset: 0,
        isTranspose: false,
        transposeKey: 0,
        transposeOffset: 0,
        vol: 0.84,
        delay: 600,
        duration: 1.5,
        arpeggio: 0.04,
        clef: "treble",
        note: "quarter",
        inst: "piano",
        isDelay: false,
        isArpeggio: false,
        isColorNote: false,
        isColorNoteName: false,
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false,
    },
};
