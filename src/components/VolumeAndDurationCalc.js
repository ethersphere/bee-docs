import { useState, useEffect } from 'react';

export default function DepthCalc() {
  const [depth, setDepth] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [erasureLevel, setErasureLevel] = useState('none');

  // Effective volume tables from Gyuri's simulations (ν=16, depth 17-41)
  // These account for batch utilization (0.1% failure quantile), PAC overhead, and erasure coding overhead.
  const depthToEffectiveVolume = {
    unencrypted: {
      none: {
        17: "44.70 kB", 18: "6.66 MB", 19: "112.06 MB", 20: "687.62 MB",
        21: "2.60 GB", 22: "7.73 GB", 23: "19.94 GB", 24: "47.06 GB",
        25: "105.51 GB", 26: "227.98 GB", 27: "476.68 GB", 28: "993.65 GB",
        29: "2.04 TB", 30: "4.17 TB", 31: "8.45 TB", 32: "17.07 TB",
        33: "34.36 TB", 34: "69.04 TB", 35: "138.54 TB", 36: "277.72 TB",
        37: "556.35 TB", 38: "1.11 PB", 39: "2.23 PB", 40: "4.46 PB", 41: "8.93 PB",
      },
      medium: {
        17: "41.56 kB", 18: "6.19 MB", 19: "104.18 MB", 20: "639.27 MB",
        21: "2.41 GB", 22: "7.18 GB", 23: "18.54 GB", 24: "43.75 GB",
        25: "98.09 GB", 26: "211.95 GB", 27: "443.16 GB", 28: "923.78 GB",
        29: "1.90 TB", 30: "3.88 TB", 31: "7.86 TB", 32: "15.87 TB",
        33: "31.94 TB", 34: "64.19 TB", 35: "128.80 TB", 36: "258.19 TB",
        37: "517.23 TB", 38: "1.04 PB", 39: "2.07 PB", 40: "4.15 PB", 41: "8.30 PB",
      },
      strong: {
        17: "37.37 kB", 18: "5.57 MB", 19: "93.68 MB", 20: "574.81 MB",
        21: "2.17 GB", 22: "6.46 GB", 23: "16.67 GB", 24: "39.34 GB",
        25: "88.20 GB", 26: "190.58 GB", 27: "398.47 GB", 28: "830.63 GB",
        29: "1.71 TB", 30: "3.49 TB", 31: "7.07 TB", 32: "14.27 TB",
        33: "28.72 TB", 34: "57.71 TB", 35: "115.81 TB", 36: "232.16 TB",
        37: "465.07 TB", 38: "931.23 TB", 39: "1.86 PB", 40: "3.73 PB", 41: "7.46 PB",
      },
      insane: {
        17: "33.88 kB", 18: "5.05 MB", 19: "84.92 MB", 20: "521.09 MB",
        21: "1.97 GB", 22: "5.86 GB", 23: "15.11 GB", 24: "35.66 GB",
        25: "79.96 GB", 26: "172.77 GB", 27: "361.23 GB", 28: "753.00 GB",
        29: "1.55 TB", 30: "3.16 TB", 31: "6.41 TB", 32: "12.93 TB",
        33: "26.04 TB", 34: "52.32 TB", 35: "104.99 TB", 36: "210.46 TB",
        37: "421.61 TB", 38: "844.20 TB", 39: "1.69 PB", 40: "3.38 PB", 41: "6.77 PB",
      },
      paranoid: {
        17: "13.27 kB", 18: "1.98 MB", 19: "33.27 MB", 20: "204.14 MB",
        21: "771.13 MB", 22: "2.29 GB", 23: "5.92 GB", 24: "13.97 GB",
        25: "31.32 GB", 26: "67.68 GB", 27: "141.51 GB", 28: "294.99 GB",
        29: "606.90 GB", 30: "1.24 TB", 31: "2.51 TB", 32: "5.07 TB",
        33: "10.20 TB", 34: "20.50 TB", 35: "41.13 TB", 36: "82.45 TB",
        37: "165.17 TB", 38: "330.72 TB", 39: "661.97 TB", 40: "1.32 PB", 41: "2.65 PB",
      },
    },
    encrypted: {
      none: {
        17: "44.35 kB", 18: "6.61 MB", 19: "111.18 MB", 20: "682.21 MB",
        21: "2.58 GB", 22: "7.67 GB", 23: "19.78 GB", 24: "46.69 GB",
        25: "104.68 GB", 26: "226.19 GB", 27: "472.93 GB", 28: "985.83 GB",
        29: "2.03 TB", 30: "4.14 TB", 31: "8.39 TB", 32: "16.93 TB",
        33: "34.09 TB", 34: "68.50 TB", 35: "137.45 TB", 36: "275.53 TB",
        37: "551.97 TB", 38: "1.11 PB", 39: "2.21 PB", 40: "4.43 PB", 41: "8.86 PB",
      },
      medium: {
        17: "40.89 kB", 18: "6.09 MB", 19: "102.49 MB", 20: "628.91 MB",
        21: "2.38 GB", 22: "7.07 GB", 23: "18.24 GB", 24: "43.04 GB",
        25: "96.50 GB", 26: "208.52 GB", 27: "435.98 GB", 28: "908.81 GB",
        29: "1.87 TB", 30: "3.81 TB", 31: "7.73 TB", 32: "15.61 TB",
        33: "31.43 TB", 34: "63.15 TB", 35: "126.71 TB", 36: "254.01 TB",
        37: "508.85 TB", 38: "1.02 PB", 39: "2.04 PB", 40: "4.08 PB", 41: "8.17 PB",
      },
      strong: {
        17: "36.73 kB", 18: "5.47 MB", 19: "92.07 MB", 20: "564.95 MB",
        21: "2.13 GB", 22: "6.35 GB", 23: "16.38 GB", 24: "38.66 GB",
        25: "86.69 GB", 26: "187.31 GB", 27: "391.64 GB", 28: "816.39 GB",
        29: "1.68 TB", 30: "3.43 TB", 31: "6.94 TB", 32: "14.02 TB",
        33: "28.23 TB", 34: "56.72 TB", 35: "113.82 TB", 36: "228.18 TB",
        37: "457.10 TB", 38: "915.26 TB", 39: "1.83 PB", 40: "3.67 PB", 41: "7.34 PB",
      },
      insane: {
        17: "33.26 kB", 18: "4.96 MB", 19: "83.38 MB", 20: "511.65 MB",
        21: "1.93 GB", 22: "5.75 GB", 23: "14.84 GB", 24: "35.02 GB",
        25: "78.51 GB", 26: "169.64 GB", 27: "354.69 GB", 28: "739.37 GB",
        29: "1.52 TB", 30: "3.10 TB", 31: "6.29 TB", 32: "12.70 TB",
        33: "25.57 TB", 34: "51.37 TB", 35: "103.08 TB", 36: "206.65 TB",
        37: "413.98 TB", 38: "828.91 TB", 39: "1.66 PB", 40: "3.32 PB", 41: "6.64 PB",
      },
      paranoid: {
        17: "13.17 kB", 18: "1.96 MB", 19: "33.01 MB", 20: "202.53 MB",
        21: "765.05 MB", 22: "2.28 GB", 23: "5.87 GB", 24: "13.86 GB",
        25: "31.08 GB", 26: "67.15 GB", 27: "140.40 GB", 28: "292.67 GB",
        29: "602.12 GB", 30: "1.23 TB", 31: "2.49 TB", 32: "5.03 TB",
        33: "10.12 TB", 34: "20.34 TB", 35: "40.80 TB", 36: "81.80 TB",
        37: "163.87 TB", 38: "328.11 TB", 39: "656.76 TB", 40: "1.31 PB", 41: "2.63 PB",
      },
    },
  };

  const erasureLevelLabels = {
    none: "None",
    medium: "Medium",
    strong: "Strong",
    insane: "Insane",
    paranoid: "Paranoid",
  };

  function formatBytes(bytes) {
      const KB = 1000;
      const MB = KB ** 2;
      const GB = KB ** 3;
      const TB = KB ** 4;
      const PB = KB ** 5;

      if (bytes < GB) {
          return (bytes / MB).toFixed(2) + ' MB';
      } else if (bytes < TB) {
          return (bytes / GB).toFixed(2) + ' GB';
      } else if (bytes < PB) {
          return (bytes / TB).toFixed(2) + ' TB';
      } else {
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

  const getEffectiveVolume = (depthValue) => {
    const encKey = isEncrypted ? 'encrypted' : 'unencrypted';
    const table = depthToEffectiveVolume[encKey][erasureLevel];
    return table[depthValue] || "N/A";
  };

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
      const effectiveVolume = getEffectiveVolume(depthValue);
      const theoreticalMaxVolume = formatBytes(2**(depthValue+12));
      const storageTimeInSeconds = (amountValue / latestPrice) * 5;
      const formattedTime = formatDuration(storageTimeInSeconds);
      const costInPLUR = (2 ** depthValue) * amountValue;
      const costInxBZZ = costInPLUR / 1e16;

      setResult(`A depth value of ${cleanedDepth} allows for an effective storage volume of ${effectiveVolume} and a theoretical max volume of ${theoreticalMaxVolume}. For an amount value of ${amountValue} PLUR / block / chunk it can be stored for ${formattedTime} at a cost of ${costInxBZZ.toFixed(2)} xBZZ.`);
      setDetails({
        Depth: cleanedDepth,
        Amount: amountValue,
        Encryption: isEncrypted ? "Yes" : "No",
        "Erasure Coding": erasureLevelLabels[erasureLevel],
        "Effective Volume": effectiveVolume,
        "Theoretical Max Volume": theoreticalMaxVolume,
        "Storage duration": formattedTime,
        Cost: `${costInxBZZ.toFixed(4)} xBZZ`
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

        <label htmlFor="amountInput" style={{ display: 'block', marginBottom: '5px' }}>Amount (current minimum is { loading ? 'Loading...' : (price * 17280) + 10 } PLUR):</label>
        <input
          id="amountInput"
          placeholder={`Input amount`}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ display: 'block', marginBottom: '5px', padding: '8px' }}
        />

        <label htmlFor="erasureSelect" style={{ display: 'block', marginBottom: '5px', marginTop: '5px' }}>
          Erasure Coding Level:
        </label>
        <select
          id="erasureSelect"
          style={{ display: 'block', marginBottom: '5px', padding: '8px' }}
          value={erasureLevel}
          onChange={e => setErasureLevel(e.target.value)}
        >
          <option value="none">None</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
          <option value="insane">Insane</option>
          <option value="paranoid">Paranoid</option>
        </select>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={() => setIsEncrypted(!isEncrypted)}
          /> Use Encryption?
        </label>

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
