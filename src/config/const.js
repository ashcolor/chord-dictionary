const INSTS = [
    {
        "key": 'piano',
        "name": 'ピアノ',
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
        "samples": {
            E3: chrome.extension.getURL("sounds/guitar-e2.mp3"),
            C4: chrome.extension.getURL("sounds/guitar-c3.mp3"),
            C5: chrome.extension.getURL("sounds/guitar-c4.mp3")
        }
    }
];
const KEYS = [
    { value: "C", text: "C" },
    { value: "D♭", text: "C♯/D♭" },
    { value: "D", text: "D" },
    { value: "E♭", text: "D♯/E♭" },
    { value: "E", text: "E" },
    { value: "F", text: "F" },
    { value: "G♭", text: "F♯/G♭" },
    { value: "G", text: "G" },
    { value: "A♭", text: "G♯/A♭" },
    { value: "A", text: "A" },
    { value: "B♭", text: "A♯/B♭" },
    { value: "B", text: "B" }
]
export { INSTS, KEYS };
