import { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    framework: "@storybook/vue3-vite",
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
    addons: ["@storybook/addon-docs", "@storybook/addon-controls"],

    async viteFinal(config, options) {
        return config;
    },
};

export default config;
