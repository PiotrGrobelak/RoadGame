import React from "react";
import classNames from "classnames";

const Square = ({ firstSquare, row, col, partOfRoad, handleClick, clickedRoad, missArray, index }) => {
  const squareValue = `${row}${col}`; 
  const squareClass = classNames({
    'square': true,
    'startSquare': firstSquare === squareValue || partOfRoad[partOfRoad.length-1] === squareValue,
    'drawRoad': partOfRoad.includes(squareValue) && partOfRoad[partOfRoad.length-1] !== squareValue,
    'hitSquare': clickedRoad.filter(el => el === squareValue)[0],
    'missSquare': missArray.filter(el => el === squareValue)[0]
  })
  return (
    <div className={squareClass} onClick={(e) => handleClick(squareValue, index, e)}></div >
  );
}

export default Square;