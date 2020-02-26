import React from "react";
import Square from "./Square";
import classNames from "classnames";
import { setDuration, getDirection, deleteLastArrayElement, setSquareDuration, isBusySquare, getRandom } from "./lib/helpers"
import Counter from "./Counter/Counter";
import ButtonOfLevel from "./ButtonOfLevel/ButtonOfLevel"

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      // flags
      isChangeLevelButtonDisabled: false,
      isStartLayerVisible: true,
      isCounterVisible: false,
      areSquaresLocked: true,
      isStartButtonDisabled: true,
      isDeletingMiss: false,
      isBusyArray: false,
      isGameOver: false,
      isWinGame: false,

      // variables
      buttonCaption: "Start",
      topBoxInformation: "",
      lastClickedIndex: 0,
      amountOfSquares: 3,
      amountOfLives: 15,
      firstSquare: null,
      dimension: 10,
      time: 500,
      level: 1,
      miss: 0,
      counterTime: 5,

      // arrays
      clickedRoad: [],
      partOfRoad: [],
      missArray: [],
      busyArray: [],
      board: [],
      road: [],

    }
    this.handleStart = this.handleStart.bind(this);
    this.checkRoad = this.checkRoad.bind(this)
  }
  componentDidMount() {
    this.setState({
      board: this.createBoard(),
    });
  }
  createBoard() {
    let list = [];
    for (let row = 0; row < this.state.dimension; row++) {
      list[row] = [];
      for (let col = 0; col < this.state.dimension; col++) {
        list[row][col] = `${row}${col}`;
      }
    }
    return list;
  }
  drawFirstSquare = async () => {
    let randomFiled = getRandom(this.state.board);
    await this.setState({ firstSquare: randomFiled });
    await this.setRoad(this.state.firstSquare);
  }
  setRoad = firstSquare => {
    const roadArray = [];
    this.setState({
      isBusyArray: false
    })
    for (let i = 0; i < this.state.amountOfSquares; i++) {
      if (this.state.isBusyArray) { break }
      else { this.setSingleSquare(roadArray, firstSquare, i); }
    }
    if (!this.state.isBusyArray) {
      this.setState({ road: roadArray });
    }
  }
  setBusyState(direction) {
    if (!this.state.busyArray.includes(direction)) {
      this.setState({
        busyArray: [...this.state.busyArray, direction]
      })
    }
  }
  setSingleSquare(roadArray, firstSquare, i) {
    if (this.state.busyArray.length > 3) {
      this.setState({
        road: [],
        busyArray: [],
        isBusyArray: true
      })
      return this.drawFirstSquare();
    }

    const { board } = this.state;
    const direction = getDirection();

    let row;
    let col;

    if (i < 1) {
      row = +firstSquare.substr(0, 1);
      col = +firstSquare.substr(1, 1);
    } else {
      row = +roadArray[roadArray.length - 1].substr(0, 1);
      col = +roadArray[roadArray.length - 1].substr(1, 1);
    }
    // up
    if (direction === 0) {
      if (row - 1 >= 0 && !isBusySquare(this.state.firstSquare, roadArray, row - 1, col)) {
        firstSquare = board[row - 1][col];
        roadArray.push(firstSquare);
        this.setState({
          busyArray: []
        })
      } else {
        this.setBusyState(direction)
        return this.setSingleSquare(roadArray, firstSquare, i);
      }
    }

    // right
    else if (direction === 1) {
      if (col + 1 <= 9 && !isBusySquare(this.state.firstSquare, roadArray, row, col + 1)) {
        firstSquare = board[row][col + 1];
        roadArray.push(firstSquare);
        this.setState({
          busyArray: []
        })
      } else {
        this.setBusyState(direction)
        return this.setSingleSquare(roadArray, firstSquare, i)
      }
    }

    // down
    else if (direction === 2) {
      if (row + 1 <= 9 && !isBusySquare(this.state.firstSquare, roadArray, row + 1, col)) {
        firstSquare = board[row + 1][col];
        roadArray.push(firstSquare);
        this.setState({
          busyArray: []
        })
      } else {
        this.setBusyState(direction)
        return this.setSingleSquare(roadArray, firstSquare, i)
      }
    }

    // left
    else if (direction === 3) {
      if (col - 1 >= 0 && !isBusySquare(this.state.firstSquare, roadArray, row, col - 1)) {
        firstSquare = board[row][col - 1];
        roadArray.push(firstSquare);
        this.setState({
          busyArray: []
        })
      } else {
        this.setBusyState(direction)
        return this.setSingleSquare(roadArray, firstSquare, i)
      }
    }
  }
  unlockSquares() {
    const { amountOfSquares, time, counterTime } = this.state;
    setTimeout(() => {
      this.setState({
        areSquaresLocked: false
      })
    }, setDuration({ amountOfSquares, time }, counterTime * 1000))
  }
  handleStart = async () => {
    await this.setState({
      isStartButtonDisabled: true,
      isWin: false,
      isChangeLevelButtonDisabled: true
    })
    await this.drawFirstSquare();
    await this.setCounter();
    await this.unlockSquares();
    await this.updateRoad();
    await this.hideRoad();
  }
  updateRoad() {
    const { road, board, time } = this.state;
    const tempArray = [];
    board.map((row) => {
      row.map((col) => {
        if (col === road.filter(roadSquare => roadSquare === col ? col : null)[0]) {
          const duration = setSquareDuration(road, col, time);
          this.setTimeBetweenDraw(tempArray, col, duration);
        }
      })
    })
  }
  setTimeBetweenDraw = (tempArray, col, duration) => {
    setTimeout(() => {
      tempArray.push(col)
      this.setState({
        partOfRoad: tempArray
      })
    }, duration);
  }
  hideRoad() {
    const { amountOfSquares, time, counterTime } = this.state;
    setTimeout(() => {
      this.setState({
        partOfRoad: [],
        isCounterVisible: false
      })
    }, setDuration({ amountOfSquares, time }, counterTime * 1000 + 500))
  }
  gameOver() {
    this.setState({
      areSquaresLocked: true, // block squares
      isChangeLevelButtonDisabled: true, // lock changeLevel button
      isGameOver: true
    })
    setTimeout(() => {
      this.setState({
        isStartLayerVisible: true,
        isChangeLevelButtonDisabled: false, // unlock changeLevel button
        areSquaresLocked: true,
        isGameOver: false,
        buttonCaption: "Start",
        topBoxInformation: "",
        level: 1,
        amountOfLives: 15,
        miss: 0
      })
      this.cleanStateOfGame()
    }, 4000);
  }
  winRound() {
    setTimeout(() => {
      this.setState(prevState => ({
        level: prevState.level + 1,
        amountOfSquares: prevState.amountOfSquares + 2,
        // buttonCaption: "Next level",
        topBoxInformation: "",
      }), () => {
        if (this.state.level == 10) {
          this.winGame();
        }
      })

      if (this.state.level != 10) {
        this.setState({
          areSquaresLocked: true,
          buttonCaption: "Next level"
        })
        this.cleanStateOfGame()
      } else {
        this.setState({
          areSquaresLocked: true,
          buttonCaption: "Start"
        })
      }

    }, 1000);
  }
  winGame() {
    this.setState({
      isWinGame: true,
      isStartButtonDisabled: true,
      isChangeLevelButtonDisabled: true
    })
    setTimeout(() => {
      this.setState({
        areSquaresLocked: true,
        isWinGame: false,
        buttonCaption: "Start",
        topBoxInformation: "",
        level: 1,
        amountOfLives: 15,
        miss: 0,
        isStartLayerVisible: true,
        isChangeLevelButtonDisabled: false
      })
      this.cleanStateOfGame()
    }, 4000);
  }
  cleanStateOfGame() {
    this.setState({
      missArray: [],
      road: [],
      clickedRoad: [],
      partOfRoad: [],
      firstSquare: null,
      areSquaresLocked: true, // lock squares
      isStartButtonDisabled: false, // unlock start button
      lastClickedIndex: 0,
    })
  }
  deleteInformation() {
    setTimeout(() => {
      this.setState({
        topBoxInformation: "",
        areSquaresLocked: false
      })
    }, 500);
  }
  deleteMiss(array) {
    setTimeout(() => {
      this.setState({
        missArray: deleteLastArrayElement(array),
        isDeletingMiss: false
      })
    }, 500);
  }
  checkRoad = (currentSquare, index, e) => {
    e.preventDefault()
    const { clickedRoad, missArray, road, areSquaresLocked, firstSquare, lastClickedIndex, isDeletingMiss } = this.state;
    const currentIndex = index.filter(el => typeof el == "number" ? el + 1 : null)[0];

    // prevent clicking in clickedSquare, missSquare, firstSquare and if isDeletingMiss == true
    if (areSquaresLocked ||
      clickedRoad.includes(currentSquare) ||
      missArray.includes(currentSquare) ||
      currentSquare === firstSquare ||
      isDeletingMiss)
      return;

    // if hit agrees with lastClicked
    if (currentIndex == lastClickedIndex) {
      this.setState(prevState => ({
        lastClickedIndex: prevState.lastClickedIndex + 1,
        clickedRoad: [...prevState.clickedRoad, currentSquare],
        topBoxInformation: "Nice shot!",
        areSquaresLocked: true
      }), () => {
        if (this.state.lastClickedIndex === road.length) {
          this.winRound();
        } else {
          this.deleteInformation()
        }
      })
    }

    // if hit includes in roadArray but doesn't agree with lastClicked
    else if (road.includes(currentSquare) && currentIndex != lastClickedIndex) {
      this.setState(prevState => ({
        miss: prevState.miss + 1,
        missArray: [...missArray, currentSquare],
        topBoxInformation: "Wrong order!",
        isDeletingMiss: true,
        areSquaresLocked: true
      }), () => {
        if (this.state.miss >= this.state.amountOfLives) {
          this.gameOver();
        } else {
          this.deleteMiss(missArray)
          this.deleteInformation()
        }
      })
    }

    else {
      this.setState(prevState => ({
        miss: prevState.miss + 1,
        missArray: [...missArray, currentSquare],
        topBoxInformation: "Miss!",
        areSquaresLocked: true
      }), () => {
        if (this.state.miss >= this.state.amountOfLives) {
          this.gameOver();
        } else {
          this.deleteInformation()
        }
      })
    }
  }
  setCounter() {
    const { amountOfSquares, time } = this.state
    setTimeout(() => {
      this.setState({
        isCounterVisible: true,
        isChangeLevelButtonDisabled: false
      })
    }, setDuration({ amountOfSquares, time }, 0))
  }
  setDifficultyLevel = (amountOfSquares, time, amountOfLives, counterTime) => {
    this.setState({
      amountOfSquares: amountOfSquares,
      amountOfLives: amountOfLives,
      time: time,
      counterTime: counterTime,
      isStartLayerVisible: false,
      isStartButtonDisabled: false,
      isCounterVisible: false,
    })
    this.cleanStateOfGame();
  }
  handleChangeLevel = () => {
    this.setState({
      isStartLayerVisible: true,
      level: 1,
      amountOfLives: 15,
      miss: 0,
      buttonCaption: "Start"
    })
    this.cleanStateOfGame();
  }
  renderBoard() {
    const {
      firstSquare,
      board,
      partOfRoad,
      clickedRoad,
      missArray,
      road
    } = this.state

    return board.map((row, i) => {
      return row.map((col, j) => {
        return (
          <Square
            firstSquare={firstSquare === col ? firstSquare : null}
            partOfRoad={partOfRoad}
            clickedRoad={clickedRoad}
            missArray={missArray}
            key={`${i}${j}`}
            row={i}
            col={j}
            handleClick={this.checkRoad}
            index={road.map((square, index) => (square === col ? index : null))}
          ></Square >
        );
      });
    });
  }
  render() {
    const {
      isStartButtonDisabled,
      buttonCaption,
      miss,
      level,
      isCounterVisible,
      topBoxInformation,
      isGameOver,
      isWinGame,
      amountOfLives,
      isStartLayerVisible,
      isChangeLevelButtonDisabled,
      counterTime
    } = this.state;

    const informationClass = classNames({
      "game__information game__information--correct": this.state.topBoxInformation == "Nice shot!",
      "game__information game__information--wrong": this.state.topBoxInformation == "Wrong order!",
      "game__information game__information--miss": this.state.topBoxInformation == "Miss!",
      "game__information game__information--none": this.state.topBoxInformation == "",
    })

    const Easy = "Easy"
    const Normal = "Normal"
    const Expert = "Expert"

    return (
      <div className="game">
        {isStartLayerVisible ? (
          <div className="game__start-layer">
            <div>
              <h1 className="game__title">Road Game</h1>
              <p className="game__subtitle">Chose your path or die!</p>
            </div>
            <div className="game__button-box">
              <ButtonOfLevel
                handleClick={this.setDifficultyLevel}
                nameLevel={Easy}
                amountOfSquares={3}
                time={1500}
                amountOfLives={15}
                counterTime={6}
              />
              <ButtonOfLevel
                handleClick={this.setDifficultyLevel}
                nameLevel={Normal}
                amountOfSquares={6}
                time={1000}
                amountOfLives={10}
                counterTime={4}
              />
              <ButtonOfLevel
                handleClick={this.setDifficultyLevel}
                nameLevel={Expert}
                amountOfSquares={9}
                time={500}
                amountOfLives={5}
                counterTime={2}
              />
            </div>
          </div>
        ) : (
            <div className="game__board-layer">
              <div className="game__board-wrapper">
                <div className="game__top-box">
                  <span className="game__parameter">Board {level}</span>
                  {isCounterVisible ? <Counter counterTime={counterTime} /> : false}
                  <span className={informationClass}> {topBoxInformation}</span>
                  <span className="game__parameter">&#10084; {amountOfLives - miss} </span>
                </div>
                <div className="game__board">
                  <span className={isGameOver ? "board__gameOver-caption" : "board__gameOver-caption--none"}></span>
                  <span className={isWinGame ? "board__winGame-caption" : "board__winGame-caption--none"}></span>
                  {this.renderBoard()}
                </div>
              </div>
              <div className="game__button-box game__button-box--board">
                <button
                  className={isStartButtonDisabled ? "game__button game__button--disabled" : "game__button"}
                  disabled={isStartButtonDisabled}
                  onClick={this.handleStart}>
                  {buttonCaption}
                </button>
                <button
                  className={isChangeLevelButtonDisabled ? "game__button game__button--disabled" : "game__button"}
                  onClick={this.handleChangeLevel}
                  disabled={isChangeLevelButtonDisabled}
                >
                  Change level
            </button>
              </div>
            </div>
          )}
      </div >
    );
  }
}

export default Game;
