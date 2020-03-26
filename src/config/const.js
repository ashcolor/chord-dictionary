const INSTS = [
    {
        "key": 'piano',
        "name": 'ピアノ',
        "isSample": true,
        "samples": {
            C2: chrome.extension.getURL("sounds/piano-c2.mp3"),
            C3: chrome.extension.getURL("sounds/piano-c3.mp3"),
            C4: chrome.extension.getURL("sounds/piano-c4.mp3"),
            C5: chrome.extension.getURL("sounds/piano-c5.mp3")
        }
    },
    {
        "key": 'guitar',
        "name": 'ギター',
        "isSample": true,
        "samples": {
            E3: chrome.extension.getURL("sounds/guitar-e2.mp3"),
            C4: chrome.extension.getURL("sounds/guitar-c3.mp3"),
            C5: chrome.extension.getURL("sounds/guitar-c4.mp3")
        },
    },
    {
        "key": 'synth',
        "name": 'シンセ',
        "isSample": false,
        "samples": {}
    }
];
const KEYS = [
    { value: 0, text: "C" },
    { value: 1, text: "D" },
    { value: 2, text: "E" },
    { value: 3, text: "F" },
    { value: 4, text: "G" },
    { value: 5, text: "A" },
    { value: 6, text: "B" }
];
const OFFSETS = [
    { value: -1, text: "♭" },
    { value: 0, text: "♮" },
    { value: 1, text: "♯" }
];
export { INSTS, KEYS, OFFSETS };
