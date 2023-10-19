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
    safelist: [{ pattern: /./ }],

    daisyui: {
        prefix: "daisy-",
        themes: [
            {
                mytheme: {
                    primary: "#666666",
                    "primary-content": "#ffffff",
                    secondary: "#f6d860",
                    accent: "#37cdbe",
                    neutral: "#acacac",
                    "neutral-content": "#ffffff",
                    "base-100": "#ffffff",

                    "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--animation-btn": "0.25s", // duration of animation when you click on button
                    "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
                    "--btn-text-case": "uppercase", // set default text transform for buttons
                    "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
                    "--border-btn": "1px", // border width of buttons
                    "--tab-border": "1px", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs
                },
            },
        ],
    },
};
