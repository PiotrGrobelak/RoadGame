
const setDuration = ({ amountOfSquares, time }, myTime) => {
    return (amountOfSquares * time) + myTime;
}

const getDirection = () => {
    return Math.round(Math.random() * 3);
}

const deleteLastArrayElement = (array) => {
    return array.slice(0, array.length);
}

const setSquareDuration = (road, col, time) => {
    const durationArray = road.map((square, index) => (square === col ? (index + 1) * time : null));
    const durationElement = durationArray.filter(square => typeof square === "number")[0];
    return durationElement;
}

const isBusySquare = (firstSquare, roadArray, row, col) => {
    for (let i = 0; i < roadArray.length; i++) {
        if (roadArray[i] === `${row}${col}` || firstSquare === `${row}${col}`) {
            return true;
        }
    }
}

const getRandom = (board) => {
    return board[Math.round(Math.random() * 9)][
        Math.round(Math.random() * 9)
    ];
}

export { setDuration, getDirection, deleteLastArrayElement, setSquareDuration, isBusySquare, getRandom };