import { useState, useEffect } from 'react';

export default function DepthCalc() {
  const [depth, setDepth] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState(null);




  const depthToVolume = {
    22: "4.93 GB", 
    23: "17.03 GB",
    24: "44.21 GB",
    25: "102.78 GB",
    26: "225.86 GB",
    27: "480.43 GB",
    28: "1.00 TB",
    29: "2.06 TB",
    30: "4.20 TB",
    31: "8.52 TB",
    32: "17.20 TB",
    33: "34.63 TB",
    34: "69.58 TB",
    35: "139.63 TB",
    36: "279.91 TB",
    37: "560.73 TB",
    38: "1.12 PB",
    39: "2.25 PB",
    40: "4.50 PB",
    41: "9.00 PB",
  };


  function formatBytes(bytes) {
      const KB = 1000;
      const MB = KB ** 2; // 1,000,000
      const GB = KB ** 3; // 1,000,000,000
      const TB = KB ** 4; // 1,000,000,000,000
      const PB = KB ** 5; // 1,000,000,000,000,000

      if (bytes < GB) { // Less than 1 GB
          return (bytes / MB).toFixed(2) + ' MB';
      } else if (bytes < TB) { // Less than 1 TB
          return (bytes / GB).toFixed(2) + ' GB';
      } else if (bytes < PB) { // Less than 1 PB
          return (bytes / TB).toFixed(2) + ' TB';
      } else { // 1 PB or more
          return (bytes / PB).toFixed(2) + ' PB';
      }
  }


  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    setLoading(true);
    setResult("");
    setErrors({});
    try {
      const response = await fetch("https://api.swarmscan.io/v1/events/storage-price-oracle/price-update");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        setPrice(parseFloat(data.events[0].data.price));
      } else {
        setResult("No price update available");
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  }

  const handleCalculate = () => {
    validateInputs(depth.trim(), amount.trim(), price);
  }

  const validateInputs = (cleanedDepth, cleanedAmount, latestPrice) => {
    let localErrors = {};
    const depthValue = Number(cleanedDepth);
    const amountValue = Number(cleanedAmount);
    const minAmount = latestPrice * 17280;

    if (!Number.isInteger(depthValue) || depthValue < 17 || depthValue > 41) {
      localErrors.depth = "Depth must be an integer greater or equal to 17 and less than or equal to 41.";
    }
    if (!Number.isInteger(amountValue) || amountValue < minAmount) {
      localErrors.amount = `Amount must be a positive whole number and at least ${minAmount} PLUR given the current storage price of ${latestPrice} PLUR/chunk/block.`;
    }

    setErrors(localErrors);

    if (Object.keys(localErrors).length === 0) {
      const effectiveVolume = depthToVolume[depthValue] || "0";
      const theoreticalMaxVolume = formatBytes(2**(depthValue+12));
      const storageTimeInSeconds = (amountValue / latestPrice) * 5;
      const formattedTime = formatDuration(storageTimeInSeconds);
      const costInPLUR = (2 ** depthValue) * amountValue;
      const costInxBZZ = costInPLUR / 1e16;

      setResult(`A depth value of ${cleanedDepth} allows for an effective storage volume of ${effectiveVolume} and a theoretical max volume of ${theoreticalMaxVolume}. For an amount value of ${amountValue} PLUR / block / chunk it can be stored for ${formattedTime} at a cost of ${costInxBZZ.toFixed(2)} xBZZ.`);
      setDetails({
        Depth: cleanedDepth,
        Amount: amountValue,
        "Effective Volume": effectiveVolume,
        "Theoretical Max Volume": theoreticalMaxVolume,
        "Storage duration": formattedTime,
        Cost: `${costInxBZZ.toFixed(2)} xBZZ`
      });
    } else {
      setResult("");
      setDetails(null);
    }
  }

  const formatDuration = (seconds) => {
    const secondsPerDay = 86400;
    const secondsPerHour = 3600;
    if (seconds > 365 * secondsPerDay) {
      return `${(seconds / (365 * secondsPerDay)).toFixed(2)} years`;
    } else if (seconds > 7 * secondsPerDay) {
      return `${(seconds / (7 * secondsPerDay)).toFixed(2)} weeks`;
    } else if (seconds > secondsPerDay) {
      return `${(seconds / secondsPerDay).toFixed(2)} days`;
    } else if (seconds > secondsPerHour) {
      return `${(seconds / secondsPerHour).toFixed(2)} hours`;
    } else {
      return `${seconds.toFixed(2)} seconds`;
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', width: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="depthInput" style={{ display: 'block', marginBottom: '5px' }}>
          Depth:
        </label>
        <input
          id="depthInput"
          placeholder="Input batch depth (17 to 41)"
          value={depth}
          onChange={e => setDepth(e.target.value)}
          style={{ display: 'block', marginBottom: '5px', padding: '8px' }}
        />
        {errors.depth && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.depth}</div>}

        <label htmlFor="amountInput" style={{ display: 'block', marginBottom: '5px' }}>Amount (current minimum is { loading ? 'Loading...' : price * 17280 } PLUR):</label>
        <input
          id="amountInput"
          placeholder={`Input amount`}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ display: 'block', marginBottom: '5px', padding: '8px' }}
        />
        <button onClick={handleCalculate} disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Calculate'}
        </button>
      </div>

      {errors.amount && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.amount}</div>}
      {result && <div style={{ color: errors.general ? 'red' : '', marginBottom: '20px', fontSize: '16px' }}>
        {result}
      </div>}
      {details && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(details).map(([key, value]) => (
              <tr key={key}>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>{key}</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}