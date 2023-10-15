/** @type {import('tailwindcss').Config} */
export default {
    // スコープとして設定
    important: "#chord-dictionary-app",

    corePlugins: {
        preflight: false,
    },

    content: ["./src/**/*.{vue}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    // @https://github.com/crxjs/chrome-extension-tools/issues/671#issuecomment-1712695919
    safelist: process.env.NODE_ENV === "development" ? [{ pattern: /./ }] : [],

    daisyui: {
        prefix: "daisy-",
    },
};
