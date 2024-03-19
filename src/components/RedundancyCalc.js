import React, { useState } from 'react';
import parities from './parities';

export default function UploadCostCalc() {
  const [result, setResult] = useState("");
  const [kb, setKb] = useState("");
  const [redundancy, setRedundancy] = useState("");
  const maxChunks = [119, 107, 97, 37]; // Maximum chunks for each redundancy level
  const maxParities = [9, 21, 31, 89]; // Maximum parities for each redundancy level

  const handleKbChange = (e) => {
    setKb(e.target.value);
  };

  const handleRedundancyChange = (e) => {
    setRedundancy(e.target.value);
  };

  const calculateCost = () => {
    if (!redundancy) {
      setResult("Please select a redundancy level.");
      return;
    }

    const kbValue = parseFloat(kb);
    if (isNaN(kbValue) || kbValue <= 0) {
      setResult("Please input a valid number for the kb value above 0.");
      return;
    }

    if (!redundancy && (isNaN(kbValue) || kbValue <= 0)) {
      setResult("Please select a redundancy level and input a valid number for the kb value above 0.");
      return;
    }

    // Convert kb to chunks
    const totalChunks = Math.ceil((kbValue * 1024) / (2 ** 12));
    const redundancyLevels = { Medium: 0, Strong: 1, Insane: 2, Paranoid: 3 };
    const redundancyLevel = redundancyLevels[redundancy];
    
    // Calculate quotient and remainder
    const quotient = Math.floor(totalChunks / maxChunks[redundancyLevel]);
    const remainder = totalChunks % maxChunks[redundancyLevel];

    // Check for out of bounds
    const remainderIndex = (remainder - 1 < 0) ? 0 : (remainder - 1);
    const remainderParities = parities[redundancyLevel][remainderIndex] || 0;

    // Calculate the percent cost
    const totalParities = (quotient * maxParities[redundancyLevel]) + remainderParities;
    const cost = (totalParities / totalChunks) * 100;

    console.log(`Redundancy Level: ${redundancy}, Quotient: ${quotient}, Remainder: ${remainder}, Total Chunks: ${totalChunks}, Max Chunks for ${redundancy}: ${maxChunks[redundancyLevel]}, Remainder Parities: ${remainderParities}, Cost: ${cost.toFixed(2)}%`);
    setResult(`An additional ${totalParities} parity chunks will be required, increasing the cost by ${cost.toFixed(2)}%`);

  };

  return (
    <div>
      <div>
        <input 
          placeholder="Data size in kb"
          type="number"
          value={kb}
          onChange={handleKbChange}
        />
        <select value={redundancy} onChange={handleRedundancyChange}>
          <option value="" disabled>Select Redundancy Level</option>
          <option value="Medium">Medium</option>
          <option value="Strong">Strong</option>
          <option value="Insane">Insane</option>
          <option value="Paranoid">Paranoid</option>
        </select>
        <button onClick={calculateCost}>Calculate</button>
      </div>
      <div>
        {result}
      </div>
    </div>
  );
}
