import React, { useState, useEffect } from "react"

const Counter = ({ counterTime }) => {
    console.log(counterTime);

    const [counter, setCounter] = useState(counterTime)
    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
        return () => clearInterval(timer)
    }, [counter])
    return (
        <span className="game__parameter game__parameter--counter" >{counter}s</span>
    )
}

export default Counter;