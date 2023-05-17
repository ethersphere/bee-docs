import { useState } from 'react';
import React from 'react';

export default function BatchCostCalc() {
  const [result, setResult] = useState("");
  const [depth, setDepth] = useState("");
  const [amount, setAmount] = useState("");

  const handleDepthChange = (e) => {
    setResult("")
    setDepth(e.target.value)
  }
  const handleAmountChange = (e) => {
    setResult("")
    setAmount(e.target.value)
  }

  const handleClick = () => {
    let userInputDepth = Number(depth)
    let userInputAmount = Number(amount)

    if ((!Number.isInteger(userInputDepth) || userInputDepth < 1 ) || (!Number.isInteger(userInputAmount) || userInputAmount < 1)){
      setResult("Please input positive integers for depth and amount.")
    } else {
      let formattedNum = Intl.NumberFormat().format(((2**userInputDepth) * userInputAmount)/1e16)
      setResult(`${formattedNum} xBZZ`)
    }
  }
  
  return (
      <div>
        <div>
          <input placeholder="Input batch depth"  onChange={handleDepthChange}/> 
          <input placeholder="Input batch amount"  onChange={handleAmountChange}/> 
          <button  onClick={handleClick}>Calculate</button>
        </div>
        <div>
          Batch cost: {result}
        </div>
      </div>
  );
}


  

