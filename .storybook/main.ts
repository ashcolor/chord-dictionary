import { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    framework: "@storybook/vue3-vite",
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    async viteFinal(config, options) {
        return config;
    },
};

export default config;
