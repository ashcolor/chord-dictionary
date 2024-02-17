class Note {
    static toHalf(key: number, offset: number) {
        const half = [0, 2, 4, 5, 7, 9, 11];
        return (((half[key] + offset) % 12) + 12) % 12;
    }
}

export { Note };
