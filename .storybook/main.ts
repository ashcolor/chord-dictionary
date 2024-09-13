import { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-docs", "@storybook/addon-controls"],
    framework: "@storybook/vue3-vite",
};

export default config;
