import React, { useState, useEffect } from 'react';

function FetchPriceComponent() {
  const [price, setPrice] = useState(null);
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('hours');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('GB');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [erasureLevel, setErasureLevel] = useState('none');
  const [convertedTime, setConvertedTime] = useState(null);
  const [minimumDepth, setMinimumDepth] = useState(null);
  const [depth, setDepth] = useState(null);
  const [amount, setAmount] = useState(null);
  const [storageCost, setStorageCost] = useState(null);
  const [minimumDepthStorageCost, setMinimumDepthStorageCost] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [volumeError, setVolumeError] = useState('');

  // Effective volume tables from Gyuri's simulations (ν=16, logBucketSize 1-18, i.e. depth 17-34)
  // These account for batch utilization (0.1% failure quantile), PAC overhead, and erasure coding overhead.
  // label: human-readable effective volume, gb: value in GB for comparison
  const depthToEffectiveVolume = {
    unencrypted: {
      none: {
        17: { label: "44.70 kB", gb: 0.000043 },
        18: { label: "6.66 MB", gb: 0.006504 },
        19: { label: "112.06 MB", gb: 0.109434 },
        20: { label: "687.62 MB", gb: 0.671504 },
        21: { label: "2.60 GB", gb: 2.60 },
        22: { label: "7.73 GB", gb: 7.73 },
        23: { label: "19.94 GB", gb: 19.94 },
        24: { label: "47.06 GB", gb: 47.06 },
        25: { label: "105.51 GB", gb: 105.51 },
        26: { label: "227.98 GB", gb: 227.98 },
        27: { label: "476.68 GB", gb: 476.68 },
        28: { label: "993.65 GB", gb: 993.65 },
        29: { label: "2.04 TB", gb: 2088.96 },
        30: { label: "4.17 TB", gb: 4270.08 },
        31: { label: "8.45 TB", gb: 8652.80 },
        32: { label: "17.07 TB", gb: 17479.68 },
        33: { label: "34.36 TB", gb: 35184.64 },
        34: { label: "69.04 TB", gb: 70696.96 },
      },
      medium: {
        17: { label: "41.56 kB", gb: 0.000040 },
        18: { label: "6.19 MB", gb: 0.006045 },
        19: { label: "104.18 MB", gb: 0.101738 },
        20: { label: "639.27 MB", gb: 0.624287 },
        21: { label: "2.41 GB", gb: 2.41 },
        22: { label: "7.18 GB", gb: 7.18 },
        23: { label: "18.54 GB", gb: 18.54 },
        24: { label: "43.75 GB", gb: 43.75 },
        25: { label: "98.09 GB", gb: 98.09 },
        26: { label: "211.95 GB", gb: 211.95 },
        27: { label: "443.16 GB", gb: 443.16 },
        28: { label: "923.78 GB", gb: 923.78 },
        29: { label: "1.90 TB", gb: 1945.60 },
        30: { label: "3.88 TB", gb: 3973.12 },
        31: { label: "7.86 TB", gb: 8048.64 },
        32: { label: "15.87 TB", gb: 16250.88 },
        33: { label: "31.94 TB", gb: 32706.56 },
        34: { label: "64.19 TB", gb: 65730.56 },
      },
      strong: {
        17: { label: "37.37 kB", gb: 0.000036 },
        18: { label: "5.57 MB", gb: 0.005439 },
        19: { label: "93.68 MB", gb: 0.091484 },
        20: { label: "574.81 MB", gb: 0.561338 },
        21: { label: "2.17 GB", gb: 2.17 },
        22: { label: "6.46 GB", gb: 6.46 },
        23: { label: "16.67 GB", gb: 16.67 },
        24: { label: "39.34 GB", gb: 39.34 },
        25: { label: "88.20 GB", gb: 88.20 },
        26: { label: "190.58 GB", gb: 190.58 },
        27: { label: "398.47 GB", gb: 398.47 },
        28: { label: "830.63 GB", gb: 830.63 },
        29: { label: "1.71 TB", gb: 1751.04 },
        30: { label: "3.49 TB", gb: 3573.76 },
        31: { label: "7.07 TB", gb: 7239.68 },
        32: { label: "14.27 TB", gb: 14612.48 },
        33: { label: "28.72 TB", gb: 29409.28 },
        34: { label: "57.71 TB", gb: 59095.04 },
      },
      insane: {
        17: { label: "33.88 kB", gb: 0.000032 },
        18: { label: "5.05 MB", gb: 0.004932 },
        19: { label: "84.92 MB", gb: 0.082930 },
        20: { label: "521.09 MB", gb: 0.508877 },
        21: { label: "1.97 GB", gb: 1.97 },
        22: { label: "5.86 GB", gb: 5.86 },
        23: { label: "15.11 GB", gb: 15.11 },
        24: { label: "35.66 GB", gb: 35.66 },
        25: { label: "79.96 GB", gb: 79.96 },
        26: { label: "172.77 GB", gb: 172.77 },
        27: { label: "361.23 GB", gb: 361.23 },
        28: { label: "753.00 GB", gb: 753.00 },
        29: { label: "1.55 TB", gb: 1587.20 },
        30: { label: "3.16 TB", gb: 3235.84 },
        31: { label: "6.41 TB", gb: 6563.84 },
        32: { label: "12.93 TB", gb: 13240.32 },
        33: { label: "26.04 TB", gb: 26664.96 },
        34: { label: "52.32 TB", gb: 53575.68 },
      },
      paranoid: {
        17: { label: "13.27 kB", gb: 0.000013 },
        18: { label: "1.98 MB", gb: 0.001934 },
        19: { label: "33.27 MB", gb: 0.032490 },
        20: { label: "204.14 MB", gb: 0.199355 },
        21: { label: "771.13 MB", gb: 0.753057 },
        22: { label: "2.29 GB", gb: 2.29 },
        23: { label: "5.92 GB", gb: 5.92 },
        24: { label: "13.97 GB", gb: 13.97 },
        25: { label: "31.32 GB", gb: 31.32 },
        26: { label: "67.68 GB", gb: 67.68 },
        27: { label: "141.51 GB", gb: 141.51 },
        28: { label: "294.99 GB", gb: 294.99 },
        29: { label: "606.90 GB", gb: 606.90 },
        30: { label: "1.24 TB", gb: 1269.76 },
        31: { label: "2.51 TB", gb: 2570.24 },
        32: { label: "5.07 TB", gb: 5191.68 },
        33: { label: "10.20 TB", gb: 10444.80 },
        34: { label: "20.50 TB", gb: 20992.00 },
      },
    },
    encrypted: {
      none: {
        17: { label: "44.35 kB", gb: 0.000042 },
        18: { label: "6.61 MB", gb: 0.006455 },
        19: { label: "111.18 MB", gb: 0.108574 },
        20: { label: "682.21 MB", gb: 0.666221 },
        21: { label: "2.58 GB", gb: 2.58 },
        22: { label: "7.67 GB", gb: 7.67 },
        23: { label: "19.78 GB", gb: 19.78 },
        24: { label: "46.69 GB", gb: 46.69 },
        25: { label: "104.68 GB", gb: 104.68 },
        26: { label: "226.19 GB", gb: 226.19 },
        27: { label: "472.93 GB", gb: 472.93 },
        28: { label: "985.83 GB", gb: 985.83 },
        29: { label: "2.03 TB", gb: 2078.72 },
        30: { label: "4.14 TB", gb: 4239.36 },
        31: { label: "8.39 TB", gb: 8591.36 },
        32: { label: "16.93 TB", gb: 17336.32 },
        33: { label: "34.09 TB", gb: 34908.16 },
        34: { label: "68.50 TB", gb: 70144.00 },
      },
      medium: {
        17: { label: "40.89 kB", gb: 0.000039 },
        18: { label: "6.09 MB", gb: 0.005947 },
        19: { label: "102.49 MB", gb: 0.100088 },
        20: { label: "628.91 MB", gb: 0.614170 },
        21: { label: "2.38 GB", gb: 2.38 },
        22: { label: "7.07 GB", gb: 7.07 },
        23: { label: "18.24 GB", gb: 18.24 },
        24: { label: "43.04 GB", gb: 43.04 },
        25: { label: "96.50 GB", gb: 96.50 },
        26: { label: "208.52 GB", gb: 208.52 },
        27: { label: "435.98 GB", gb: 435.98 },
        28: { label: "908.81 GB", gb: 908.81 },
        29: { label: "1.87 TB", gb: 1914.88 },
        30: { label: "3.81 TB", gb: 3901.44 },
        31: { label: "7.73 TB", gb: 7915.52 },
        32: { label: "15.61 TB", gb: 15984.64 },
        33: { label: "31.43 TB", gb: 32184.32 },
        34: { label: "63.15 TB", gb: 64665.60 },
      },
      strong: {
        17: { label: "36.73 kB", gb: 0.000035 },
        18: { label: "5.47 MB", gb: 0.005342 },
        19: { label: "92.07 MB", gb: 0.089912 },
        20: { label: "564.95 MB", gb: 0.551709 },
        21: { label: "2.13 GB", gb: 2.13 },
        22: { label: "6.35 GB", gb: 6.35 },
        23: { label: "16.38 GB", gb: 16.38 },
        24: { label: "38.66 GB", gb: 38.66 },
        25: { label: "86.69 GB", gb: 86.69 },
        26: { label: "187.31 GB", gb: 187.31 },
        27: { label: "391.64 GB", gb: 391.64 },
        28: { label: "816.39 GB", gb: 816.39 },
        29: { label: "1.68 TB", gb: 1720.32 },
        30: { label: "3.43 TB", gb: 3512.32 },
        31: { label: "6.94 TB", gb: 7106.56 },
        32: { label: "14.02 TB", gb: 14356.48 },
        33: { label: "28.23 TB", gb: 28907.52 },
        34: { label: "56.72 TB", gb: 58081.28 },
      },
      insane: {
        17: { label: "33.26 kB", gb: 0.000032 },
        18: { label: "4.96 MB", gb: 0.004844 },
        19: { label: "83.38 MB", gb: 0.081426 },
        20: { label: "511.65 MB", gb: 0.499658 },
        21: { label: "1.93 GB", gb: 1.93 },
        22: { label: "5.75 GB", gb: 5.75 },
        23: { label: "14.84 GB", gb: 14.84 },
        24: { label: "35.02 GB", gb: 35.02 },
        25: { label: "78.51 GB", gb: 78.51 },
        26: { label: "169.64 GB", gb: 169.64 },
        27: { label: "354.69 GB", gb: 354.69 },
        28: { label: "739.37 GB", gb: 739.37 },
        29: { label: "1.52 TB", gb: 1556.48 },
        30: { label: "3.10 TB", gb: 3174.40 },
        31: { label: "6.29 TB", gb: 6440.96 },
        32: { label: "12.70 TB", gb: 13004.80 },
        33: { label: "25.57 TB", gb: 26183.68 },
        34: { label: "51.37 TB", gb: 52602.88 },
      },
      paranoid: {
        17: { label: "13.17 kB", gb: 0.000013 },
        18: { label: "1.96 MB", gb: 0.001914 },
        19: { label: "33.01 MB", gb: 0.032236 },
        20: { label: "202.53 MB", gb: 0.197783 },
        21: { label: "765.05 MB", gb: 0.747119 },
        22: { label: "2.28 GB", gb: 2.28 },
        23: { label: "5.87 GB", gb: 5.87 },
        24: { label: "13.86 GB", gb: 13.86 },
        25: { label: "31.08 GB", gb: 31.08 },
        26: { label: "67.15 GB", gb: 67.15 },
        27: { label: "140.40 GB", gb: 140.40 },
        28: { label: "292.67 GB", gb: 292.67 },
        29: { label: "602.12 GB", gb: 602.12 },
        30: { label: "1.23 TB", gb: 1259.52 },
        31: { label: "2.49 TB", gb: 2549.76 },
        32: { label: "5.03 TB", gb: 5150.72 },
        33: { label: "10.12 TB", gb: 10362.88 },
        34: { label: "20.34 TB", gb: 20828.16 },
      },
    },
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

  useEffect(() => {
    if (depth !== null && amount !== null) {
      calculateStorageCost();
    }
    if (minimumDepth !== null && amount !== null) {
      calculateMinimumDepthStorageCost();
    }
  }, [depth, amount, minimumDepth]);

  const fetchPrice = async () => {
    try {
      const response = await fetch("https://api.swarmscan.io/v1/events/storage-price-oracle/price-update");
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        setPrice(parseFloat(data.events[0].data.price));
      } else {
        console.error("No price update available.");
      }
    } catch (error) {
      console.error("Error fetching price:", error.message);
    }
  };

  const getEffectiveVolumeTable = () => {
    const encKey = isEncrypted ? 'encrypted' : 'unencrypted';
    return depthToEffectiveVolume[encKey][erasureLevel];
  };

  const handleCalculate = () => {
    if (!price) {
      console.error("Price data not available");
      return;
    }

    setShowResults(false);
    setTimeError('');
    setVolumeError('');

    const hours = convertTimeToHours(time, timeUnit);
    const gigabytes = convertVolumeToGB(volume, volumeUnit);

    if (!hours || !gigabytes) return;

    setConvertedTime(hours);

    const table = getEffectiveVolumeTable();

    // Find the smallest depth whose effective volume (in GB) >= requested volume
    let foundDepth = null;
    for (let d = 17; d <= 34; d++) {
      if (table[d] && table[d].gb >= gigabytes) {
        foundDepth = d;
        break;
      }
    }

    if (!foundDepth) {
      setVolumeError('Requested volume exceeds maximum available effective volume for the selected settings.');
      return;
    }

    setDepth(foundDepth);

    // Minimum depth: based on theoretical max volume (2^(depth+12) bytes), ignoring utilization
    const minDepth = calculateMinimumDepth(gigabytes);
    setMinimumDepth(minDepth);

    // Amount: blocks * price
    const blocks = hours * 3600 / 5;
    const totalAmount = blocks * price;
    setAmount(totalAmount);

    setShowResults(true);
  };

  const calculateMinimumDepth = (gigabytes) => {
    for (let d = 17; d <= 34; d++) {
      if (gigabytes <= Math.pow(2, 12 + d) / (1024 ** 3)) {
        return d;
      }
    }
    return null;
  };

  const calculateStorageCost = () => {
    if (depth !== null && amount !== null) {
      const cost = ((2 ** depth) * amount) / 1e16;
      setStorageCost(cost.toFixed(4));
    }
  };

  const calculateMinimumDepthStorageCost = () => {
    if (minimumDepth !== null && amount !== null) {
      const cost = ((2 ** minimumDepth) * amount) / 1e16;
      setMinimumDepthStorageCost(cost.toFixed(4));
    }
  };

  const convertTimeToHours = (time, unit) => {
    const num = parseFloat(time);
    if (isNaN(num) || num <= 0) {
      setTimeError('Time must be a positive number greater than 24 hrs.');
      return 0;
    }
    const hours = num * (unit === 'years' ? 8760 : unit === 'weeks' ? 168 : unit === 'days' ? 24 : 1);
    if (hours < 24) {
      setTimeError('Time must be longer than 24 hours.');
      return 0;
    }
    return hours;
  };

  const convertVolumeToGB = (volume, unit) => {
    const num = parseFloat(volume);
    if (isNaN(num) || num <= 0) {
      setVolumeError('Volume must be a positive number.');
      return 0;
    }
    const gigabytes = num * (unit === 'TB' ? 1024 : unit === 'PB' ? 1048576 : unit === 'MB' ? 1 / 1024 : unit === 'kB' ? 1 / (1024 * 1024) : 1);
    if (gigabytes <= 0) {
      setVolumeError('Volume must be greater than 0.');
      return 0;
    }

    // Check against max effective volume for the selected settings
    const table = getEffectiveVolumeTable();
    const maxGb = table[34].gb;
    if (gigabytes > maxGb) {
      setVolumeError(`Volume exceeds maximum effective volume (${table[34].label}) for the selected encryption and erasure settings.`);
      return 0;
    }
    return gigabytes;
  };

  const getEffectiveVolumeLabel = (d) => {
    const table = getEffectiveVolumeTable();
    return table[d] ? table[d].label : "N/A";
  };

  const erasureLevelLabels = {
    none: "None",
    medium: "Medium",
    strong: "Strong",
    insane: "Insane",
    paranoid: "Paranoid",
  };

  return (
    <div style={{ alignItems: 'flex-start', width: 'auto' }}>
      <div>
        <label htmlFor="timeInput" style={{ display: 'block', marginBottom: '5px' }}>
          Time:
        </label>
        <input
          id="timeInput"
          style={{ marginRight: '5px', padding: '8px' }}
          value={time}
          onChange={e => setTime(e.target.value)}
          placeholder="Enter time (>= 24 hrs)"
        />
        <select
          style={{ marginRight: '5px', padding: '8px' }}
          value={timeUnit}
          onChange={e => setTimeUnit(e.target.value)}
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="years">Years</option>
        </select>
        {timeError && <p style={{ color: 'red', marginBottom: '10px' }}>{timeError}</p>}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <label htmlFor="volumeInput" style={{ display: 'block', marginBottom: '5px' }}>
          Volume:
        </label>
        <input
          id="volumeInput"
          style={{ marginRight: '5px', padding: '8px' }}
          value={volume}
          onChange={e => setVolume(e.target.value)}
          placeholder="Enter volume"
        />
        <select
          style={{ marginRight: '5px', padding: '8px' }}
          value={volumeUnit}
          onChange={e => setVolumeUnit(e.target.value)}
        >
          <option value="kB">Kilobytes</option>
          <option value="MB">Megabytes</option>
          <option value="GB">Gigabytes</option>
          <option value="TB">Terabytes</option>
          <option value="PB">Petabytes</option>
        </select>
        {volumeError && <p style={{ color: 'red', marginBottom: '10px' }}>{volumeError}</p>}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <label htmlFor="erasureSelect" style={{ display: 'block', marginBottom: '5px' }}>
          Erasure Coding Level:
        </label>
        <select
          id="erasureSelect"
          style={{ padding: '8px' }}
          value={erasureLevel}
          onChange={e => setErasureLevel(e.target.value)}
        >
          <option value="none">None</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
          <option value="insane">Insane</option>
          <option value="paranoid">Paranoid</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={() => setIsEncrypted(!isEncrypted)}
          /> Use Encryption?
        </label>
      </div>
      <div>
        <button
          style={{ padding: '10px 15px', cursor: 'pointer', display: 'inline-block', width: 'auto' }}
          onClick={handleCalculate}
        >
          Calculate
        </button>
      </div>

      {showResults && !timeError && !volumeError && (
        <div>
          <div style={{ marginTop: '20px', fontSize: '16px' }}>
            {`In order to store ${volume} ${volumeUnit} of data for ${time} ${timeUnit}`}
            {` (${isEncrypted ? 'encrypted' : 'unencrypted'}, ${erasureLevelLabels[erasureLevel]} erasure coding),`}
            {` a depth of ${depth} and an amount value of ${amount} should be used.`}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Field</th>
                <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Time</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{convertedTime} hours</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Volume</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{`${volume} ${volumeUnit}`}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Encryption</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{isEncrypted ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Erasure Coding</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{erasureLevelLabels[erasureLevel]}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Suggested Minimum Amount</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{amount + 10} PLUR</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Suggested Safe Depth</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{`${depth} (for an `}<a href="/docs/concepts/incentives/postage-stamps#effective-utilisation-table">effective volume</a>{` of ${getEffectiveVolumeLabel(depth)})`}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Suggested Minimum Depth</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{minimumDepth} (see <a href="/docs/concepts/incentives/postage-stamps#effective-utilisation-table">batch utilisation</a> - may require <a href="#dilute-your-batch">dilution</a>)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Batch Cost for Safe Depth</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{storageCost} xBZZ</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: '8px', border: '1px solid' }}>Batch Cost for Minimum Depth</td>
                <td style={{ padding: '8px', border: '1px solid' }}>{minimumDepthStorageCost} xBZZ</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FetchPriceComponent;
