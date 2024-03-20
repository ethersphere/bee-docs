import React, { useState } from 'react';
import parities from './parities';
import paritiesEncrypted from './paritiesEncrypted';

export default function UploadCostCalc() {
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState([]);
  const [dataSize, setDataSize] = useState("");
  const [redundancy, setRedundancy] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [unit, setUnit] = useState("chunks"); 
  const maxChunks = [119, 107, 97, 37];
  const maxParities = [9, 21, 31, 89];
  const maxChunksEncrypted = [59, 53, 48, 18];
  const errorTolerances = {
    Medium: "1%",
    Strong: "5%",
    Insane: "10%",
    Paranoid: "50%"
  };
  

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
    setErrorMessage("");
    setResult([]);
  
    if (!redundancy) {
      setErrorMessage("Please select a redundancy level.");
      return;
    }
  
    let totalChunks, sizeInKb;
    if (unit === "kb") {
      const kbValue = parseFloat(dataSize);
      if (isNaN(kbValue) || kbValue <= 0) {
        setErrorMessage("Please input a valid KB value above 0.");
        return;
      }
      sizeInKb = kbValue;
      totalChunks = Math.ceil((kbValue * 1024) / (2 ** 12));
    } else {
      const chunksValue = parseFloat(dataSize);
      if (isNaN(chunksValue) || chunksValue <= 0) {
        setErrorMessage("Please input a valid chunk amount above 0.");
        return;
      }
      totalChunks = Math.ceil(chunksValue);
      sizeInKb = (totalChunks * (2 ** 12)) / 1024;
    }

    const redundancyLevels = { Medium: 0, Strong: 1, Insane: 2, Paranoid: 3 };
    const redundancyLevel = redundancyLevels[redundancy];

    const quotient = isEncrypted ? Math.floor(totalChunks / maxChunksEncrypted[redundancyLevel]) : Math.floor(totalChunks / maxChunks[redundancyLevel]);
    const remainder = isEncrypted ? totalChunks % maxChunksEncrypted[redundancyLevel] : totalChunks % maxChunks[redundancyLevel];

    const remainderIndex = (remainder - 1 < 0) ? 0 : (remainder - 1);

    const selectedParities = isEncrypted ? paritiesEncrypted : parities;
    const remainderParities = selectedParities[redundancyLevel][remainderIndex] || 0;

    const totalParities = (quotient * maxParities[redundancyLevel]) + remainderParities;
    const totalDataWithParity = totalChunks + totalParities;
    const percentDifference = ((totalDataWithParity - totalChunks) / totalChunks) * 100;
    const parityDataInKb = (totalParities * (2 ** 12)) / 1024;
    
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    const resultsArray = [
      { name: "Source data size", value: `${formatNumber(sizeInKb.toFixed(0))} KB` },
      { name: "Parity data size", value: `${formatNumber(parityDataInKb.toFixed(0))} KB` },
      { name: "Source data in chunks", value: formatNumber(totalChunks) },
      { name: "Additional parity chunks", value: formatNumber(totalParities) },
      { name: "Percent cost increase", value: `${percentDifference.toFixed(2)}%` },
      { name: "Selected redundancy level", value: `${redundancy}` },
      { name: "Error tolerance", value: errorTolerances[redundancy] }
    ];
    
    
  
    setResult(resultsArray);
  
  };


  const styles = {
    container: { padding: '20px', fontFamily: 'Arial', maxWidth: '650px', margin: '0 auto' }, 
    title: { margin: '10px 0' },
    input: { padding: '8px', margin: '5px 0', width: '50%' },
    select: { padding: '8px', margin: '5px 0', width: '50%' },
    button: { padding: '10px 15px', margin: '10px 0', cursor: 'pointer' },
    result: { margin: '10px 0', fontWeight: 'bold' },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tdName: {
      border: '1px solid #ccc',
      padding: '4px 8px', 
      textAlign: 'left',
    },
    tdValue: {
      border: '1px solid #ccc',
      padding: '4px 8px', 
      textAlign: 'right',
    },
    bold: { 
      fontWeight: 'bold',
    }
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
        {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
        <button onClick={calculateCost} style={styles.button}>Calculate</button>
      </div>
      <div style={styles.result}>
        <table style={styles.table}>
          <tbody>
            {result.map((item, index) => (
              <tr key={index}>
                <td style={{...styles.tdName, ...styles.bold}}>{item.name}</td> {/* Apply bold style here */}
                <td style={styles.tdValue}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
