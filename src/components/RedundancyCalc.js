import React, { useState } from 'react';
import parities from './parities';
import paritiesEncrypted from './paritiesEncrypted';

export default function UploadCostCalc() {
  const [result, setResult] = useState("");
  const [dataSize, setDataSize] = useState("");
  const [redundancy, setRedundancy] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [unit, setUnit] = useState("chunks"); 
  const maxChunks = [119, 107, 97, 37];
  const maxParities = [9, 21, 31, 89];
  const maxChunksEncrypted = [59, 53, 48, 18];

  const handleDataSizeChange = (e) => {
    setDataSize(e.target.value);
  };

  const handleRedundancyChange = (e) => {
    setRedundancy(e.target.value);
  };

  const handleEncryptionChange = () => {
    setIsEncrypted(!isEncrypted);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const calculateCost = () => {
    if (!redundancy) {
      setResult("Please select a redundancy level.");
      return;
    }

    let totalChunks;
    if (unit === "kb") {
      const kbValue = parseFloat(dataSize);
      if (isNaN(kbValue) || kbValue <= 0) {
        setResult("Please input a valid kb value above 0.");
        return;
      }
      totalChunks = Math.ceil((kbValue * 1024) / (2 ** 12));
    } else {
      const chunksValue = parseFloat(dataSize);
      if (isNaN(chunksValue) || chunksValue <= 0) {
        setResult("Please input a valid chunk amount above 0.");
        return;
      }
      totalChunks = Math.ceil(chunksValue);
    }

    const redundancyLevels = { Medium: 0, Strong: 1, Insane: 2, Paranoid: 3 };
    const redundancyLevel = redundancyLevels[redundancy];

    const quotient = isEncrypted ? Math.floor(totalChunks / maxChunksEncrypted[redundancyLevel]) : Math.floor(totalChunks / maxChunks[redundancyLevel]);
    const remainder = isEncrypted ? totalChunks % maxChunksEncrypted[redundancyLevel] : totalChunks % maxChunks[redundancyLevel];

    const remainderIndex = (remainder - 1 < 0) ? 0 : (remainder - 1);

    const selectedParities = isEncrypted ? paritiesEncrypted : parities;
    const remainderParities = selectedParities[redundancyLevel][remainderIndex] || 0;

    const totalParities = (quotient * maxParities[redundancyLevel]) + remainderParities;
    const cost = (totalParities / totalChunks) * 100;

    setResult(`An additional ${totalParities} parity chunks will be required, increasing the cost by ${cost.toFixed(2)}%`);
  };


  const styles = {
    container: { padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' },
    title: { margin: '10px 0' },
    input: { padding: '8px', margin: '5px 0', width: '100%' },
    select: { padding: '8px', margin: '5px 0', width: '100%' },
    button: { padding: '10px 15px', margin: '10px 0', cursor: 'pointer' },
    result: { margin: '10px 0', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.title}>Data Size:</div>
        <input 
          placeholder="Enter data size"
          type="number"
          value={dataSize}
          onChange={handleDataSizeChange}
          style={styles.input}
        />
        <div style={styles.title}>Data Unit:</div>
        <select value={unit} onChange={handleUnitChange} style={styles.select}>
          <option value="chunks">Chunks</option>
          <option value="kb">KB</option>
        </select>
        <div style={styles.title}>Redundancy Level:</div>
        <select value={redundancy} onChange={handleRedundancyChange} style={styles.select}>
          <option value="" disabled>Select Redundancy Level</option>
          <option value="Medium">Medium</option>
          <option value="Strong">Strong</option>
          <option value="Insane">Insane</option>
          <option value="Paranoid">Paranoid</option>
        </select>
        <div style={styles.title}>
          <input 
            type="checkbox"
            checked={isEncrypted}
            onChange={handleEncryptionChange}
          /> Use Encryption?
        </div>
        <button onClick={calculateCost} style={styles.button}>Calculate</button>
      </div>
      <div style={styles.result}>
        {result}
      </div>
    </div>
  );
}
