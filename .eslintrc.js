module.exports = {
    env: {
        browser: true,
        es6: true,
        webextensions: true,
        node: true,
    },
    root: true,
    extends: [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "plugin:tailwindcss/recommended",
        "prettier",
    ],
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                "vue/no-v-html": 0,
            },
        },
        {
            files: ["*.vue"],
            rules: {
                "vue/no-multiple-template-root": 0,
            },
        },
        {
            files: ["*.vue"],
            rules: {
                "vue/multi-word-component-names": 0,
            },
        },
    ],
    plugins: ["vue", "@typescript-eslint", "tailwindcss"],
    rules: {},
};
