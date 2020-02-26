import React from "react"

const ButtonOfLevel = ({ handleClick, nameLevel, amountOfSquares, amountOfLives, time, counterTime }) => {
    return (
        <button
            className="game__level-button game__button"
            onClick={() => handleClick(amountOfSquares, time, amountOfLives, counterTime)}
        >
            {nameLevel}
        </button>
    )
}

export default ButtonOfLevel;