export const toFirstLetterUpperCase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

export const fromColumnToBgColor = (column: string) => {
    return column === "To-do" ? "bg-orange-500" : column === "In Progress" ? "bg-yellow-500" : "bg-green-500";
}