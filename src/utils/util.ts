class Util {
    static isMac() {
        return window.navigator.platform.includes("Mac");
    }
    static getUserLanguageCode = () => {
        const languageMappings = [
            { pattern: /^zh-(hk|mo)/i, code: "hk" },
            { pattern: /^zh-(tw|hant)/i, code: "tw" },
            { pattern: /^zh/i, code: "cn" },
            { pattern: /^ja/i, code: "ja" },
            { pattern: /^ko/i, code: "ko" },
            { pattern: /^en-(gb|ie|au|nz)/i, code: "gb" },
            { pattern: /^en/i, code: "en" },
        ];

        const userLanguages = [window.navigator.language, ...window.navigator.languages];

        for (let i = 0; i < userLanguages.length; i++) {
            const language = userLanguages[i];
            if (!language) continue;

            for (const mapping of languageMappings) {
                if (mapping.pattern.test(language)) {
                    return mapping.code;
                }
            }
        }

        return "en";
    };
}

export { Util };
