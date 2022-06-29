const CLEFS = {
  treble: {
    octave: 3,
    note: 5,
  },
  alto: {
    octave: 2,
    note: 6,
  },
  bass: {
    octave: 2,
    note: 1,
  },
};
const NOTES = {
  whole: {
    num: 1,
    duration: "w",
  },
  half: {
    num: 2,
    duration: "h",
  },
  quarter: {
    num: 4,
    duration: "q",
  },
};
const COLORS = [
  "hsl(0, 88%, 46%)",
  "hsl(30, 99%, 33%)",
  "hsl(49, 90%, 46%)",
  "hsl(60, 98%, 33%)",
  "hsl(79, 59%, 46%)",
  "hsl(135, 76%, 33%)",
  "hsl(172, 68%, 46%)",
  "hsl(191, 41%, 33%)",
  "hsl(273, 79%, 46%)",
  "hsl(291, 46%, 33%)",
  "hsl(295, 97%, 46%)",
  "hsl(332, 97%, 33%)",
];
const INSTS = [
  {
    key: "piano",
    samples: {
      C2: chrome.runtime.getURL("sounds/piano-c2.mp3"),
      C3: chrome.runtime.getURL("sounds/piano-c3.mp3"),
      C4: chrome.runtime.getURL("sounds/piano-c4.mp3"),
      C5: chrome.runtime.getURL("sounds/piano-c5.mp3"),
    },
  },
  {
    key: "guitar",
    samples: {
      E3: chrome.runtime.getURL("sounds/guitar-e2.mp3"),
      C4: chrome.runtime.getURL("sounds/guitar-c3.mp3"),
      C5: chrome.runtime.getURL("sounds/guitar-c4.mp3"),
    },
  },
  {
    key: "synth",
  },
];
const KEYS = [
  { value: 0, text: "C" },
  { value: 1, text: "D" },
  { value: 2, text: "E" },
  { value: 3, text: "F" },
  { value: 4, text: "G" },
  { value: 5, text: "A" },
  { value: 6, text: "B" },
];
const OFFSETS = [
  { value: -1, text: "♭" },
  { value: 0, text: "♮" },
  { value: 1, text: "♯" },
];
export { CLEFS, NOTES, COLORS, INSTS, KEYS, OFFSETS };
