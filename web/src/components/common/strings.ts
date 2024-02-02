/**
 * Capitalize all words in string
 * @param value - ex: "howdy hey"
 * @return - ex: "Howdy Hey"
 */
export const PascalCase = (value: string): string => {
    return value
        .split(" ")
        .map((val) => val.charAt(0).toLocaleUpperCase() + val.slice(1)) // captialize first letter, return whole word
        .join(" ");
};
