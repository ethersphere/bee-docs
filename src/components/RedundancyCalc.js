import React, { useState } from 'react';

export default function UploadCostCalc() {
  const [percentCost, setPercentCost] = useState("");
  const [chunks, setChunks] = useState("");
  const [redundancy, setRedundancy] = useState("");

  // Handling changes in the input fields
  const handleChunksChange = (e) => {
    setChunks(e.target.value);
  };

  const handleRedundancyChange = (e) => {
    setRedundancy(e.target.value);
  };

  // Empty function for the Calculate button click
  const calculateCost = () => {
    // No operation (no-op) - The function does nothing now
  };

  return (
    <div>
      <div>
        <input 
          placeholder="Number of chunks"
          type="number"
          onChange={handleChunksChange}
        />
        <select onChange={handleRedundancyChange} defaultValue="">
          <option value="" disabled>Select Redundancy Level</option>
          <option value="Medium">Medium</option>
          <option value="Strong">Strong</option>
          <option value="Insane">Insane</option>
          <option value="Paranoid">Paranoid</option>
        </select>
        <button onClick={calculateCost}>Calculate</button>
      </div>
      <div>
        Percent cost: {percentCost}
      </div>
    </div>
  );
}
