import React, { useState, useEffect } from 'react';

function FetchPriceComponent() {
  const [price, setPrice] = useState(null);
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('hours');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('GB');
  const [convertedTime, setConvertedTime] = useState(null);
  const [convertedVolume, setConvertedVolume] = useState(null);
  const [depth, setDepth] = useState(null);
  const [amount, setAmount] = useState(null);
  const [storageCost, setStorageCost] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [volumeError, setVolumeError] = useState('');


  const volumeToDepth = {
    "4.93" : 22,
    "17.03": 23,
    "44.21": 24,
    "102.78": 25,
    "225.86": 26,
    "480.43": 27,
    "1024.00": 28,
    "2109.44": 29,
    "4300.80": 30,
    "8724.48": 31,
    "17612.80": 32,
    "35461.12": 33,
    "71249.92": 34,
    "142981.12": 35,
    "286627.84": 36,
    "574187.52": 37,
    "1174405.12": 38,
    "2359296.00": 39,
    "4718592.00": 40,
    "9437184.00": 41
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  useEffect(() => {
    if (depth !== null && amount !== null) {
      calculateStorageCost();
    }
  }, [depth, amount]); 

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
    setConvertedVolume(gigabytes);
    calculateDepth(gigabytes);
    calculateAmount(hours * 3600 / 5); 
    setShowResults(true);
  };

  

  const calculateDepth = (gigabytes) => {
    const keys = Object.keys(volumeToDepth).map(key => parseFloat(key)).sort((a, b) => a - b);
    let foundKey = keys.find(key => key >= gigabytes);
    setDepth(foundKey ? volumeToDepth[foundKey.toFixed(2)] : 'No suitable depth found');
  };

  const calculateAmount = (blocks) => {
    if (price !== null) {
      const totalAmount = blocks * price;
      setAmount(totalAmount);
    }
  };

  const calculateStorageCost = () => {
    if (depth !== null && amount !== null) {
      const cost = ((2**depth) * amount) / 1e16;
      setStorageCost(cost.toFixed(2));
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
    const gigabytes = num * (unit === 'TB' ? 1024 : unit === 'PB' ? 1048576 : unit === 'MB' ? 1/1024 : 1);
    if (gigabytes <= 0 || gigabytes >= 9437184) {
      setVolumeError('Volume must be greater than 0 and less than 9 PB.');
      return 0;
    }
    return gigabytes;
  };
  
  

  return (
    <div style={{alignItems: 'flex-start', width: 'auto'}}>
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
        placeholder="Enter volume (<= 9 PB)"
    />
    <select
      style={{ marginRight: '5px', padding: '8px' }}
      value={volumeUnit}
      onChange={e => setVolumeUnit(e.target.value)}
    >
      <option value="MB">Megabytes</option>
      <option value="GB">Gigabytes</option>
      <option value="TB">Terabytes</option>
      <option value="PB">Petabytes</option>
    </select>

    {volumeError && <p style={{ color: 'red', marginBottom: "10px" }}>{volumeError}</p>}
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
          {`In order to store ${volume} ${volumeUnit} of data for ${time} ${timeUnit}, a depth of ${depth} and an amount value of ${amount} should be used.`}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px', border: '1px solid' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Time</td>
              <td>{convertedTime} hours</td>
            </tr>
            <tr>
              <td>Volume</td>
              <td>{convertedVolume} GB</td>
            </tr>
            <tr>
              <td>Depth</td>
              <td>{depth}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{amount} PLUR</td>
            </tr>
            <tr>
              <td>Storage Cost</td>
              <td>{storageCost} xBZZ</td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default FetchPriceComponent;
