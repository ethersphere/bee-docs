import { useState } from 'react';
import React from 'react';

export default function DepthCalc({children, color}) {
  const [result, setResult] = useState("");
  const [depth, setDepth] = useState("");
  const handleChange = (e) => {
    setResult("")
    setDepth(e.target.value)
  }

  const handleClick = () => {
    console.log(depth)
    let userInput = Number(depth)
    if (!Number.isInteger(userInput)){
      setResult("Please input an integer number.")
    } else {
      let formattedNum = Intl.NumberFormat().format(2**userInput * 4)
      setResult(`${formattedNum}kb`)
    }
  }
  
  return (
      <div>
        <div>
          <input placeholder="Input batch depth"  onChange={handleChange}/> 
          <button  onClick={handleClick}>Calculate</button>
        </div>
        <div>
          Maximum batch data: {result}
        </div>
      </div>
  );
}


  

