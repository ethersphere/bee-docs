/**
 * AmountAndDepthCalc Test Suite
 * Tests the postage stamp calculator logic
 */

// Extract the calculator logic for testing
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
      35: { label: "138.54 TB", gb: 141864.96 },
      36: { label: "277.72 TB", gb: 284385.28 },
      37: { label: "556.35 TB", gb: 569702.40 },
      38: { label: "1.11 PB", gb: 1163919.36 },
      39: { label: "2.23 PB", gb: 2338324.48 },
      40: { label: "4.46 PB", gb: 4676648.96 },
      41: { label: "8.93 PB", gb: 9363783.68 },
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
      35: { label: "128.80 TB", gb: 131891.20 },
      36: { label: "258.19 TB", gb: 264386.56 },
      37: { label: "517.23 TB", gb: 529643.52 },
      38: { label: "1.04 PB", gb: 1090519.04 },
      39: { label: "2.07 PB", gb: 2170552.32 },
      40: { label: "4.15 PB", gb: 4351590.40 },
      41: { label: "8.30 PB", gb: 8703180.80 },
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
      35: { label: "115.81 TB", gb: 118589.44 },
      36: { label: "232.16 TB", gb: 237731.84 },
      37: { label: "465.07 TB", gb: 476231.68 },
      38: { label: "931.23 TB", gb: 953579.52 },
      39: { label: "1.86 PB", gb: 1950351.36 },
      40: { label: "3.73 PB", gb: 3911188.48 },
      41: { label: "7.46 PB", gb: 7822376.96 },
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
      35: { label: "104.99 TB", gb: 107509.76 },
      36: { label: "210.46 TB", gb: 215511.04 },
      37: { label: "421.61 TB", gb: 431728.64 },
      38: { label: "844.20 TB", gb: 864460.80 },
      39: { label: "1.69 PB", gb: 1772093.44 },
      40: { label: "3.38 PB", gb: 3544186.88 },
      41: { label: "6.77 PB", gb: 7098859.52 },
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
      35: { label: "41.13 TB", gb: 42117.12 },
      36: { label: "82.45 TB", gb: 84428.80 },
      37: { label: "165.17 TB", gb: 169134.08 },
      38: { label: "330.72 TB", gb: 338657.28 },
      39: { label: "661.97 TB", gb: 677857.28 },
      40: { label: "1.32 PB", gb: 1384120.32 },
      41: { label: "2.65 PB", gb: 2778726.40 },
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
      35: { label: "137.45 TB", gb: 140748.80 },
      36: { label: "275.53 TB", gb: 282142.72 },
      37: { label: "551.97 TB", gb: 565217.28 },
      38: { label: "1.11 PB", gb: 1163919.36 },
      39: { label: "2.21 PB", gb: 2317352.96 },
      40: { label: "4.43 PB", gb: 4645191.68 },
      41: { label: "8.86 PB", gb: 9290383.36 },
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
      35: { label: "126.71 TB", gb: 129751.04 },
      36: { label: "254.01 TB", gb: 260106.24 },
      37: { label: "508.85 TB", gb: 521062.40 },
      38: { label: "1.02 PB", gb: 1069547.52 },
      39: { label: "2.04 PB", gb: 2139095.04 },
      40: { label: "4.08 PB", gb: 4278190.08 },
      41: { label: "8.17 PB", gb: 8566865.92 },
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
      35: { label: "113.82 TB", gb: 116551.68 },
      36: { label: "228.18 TB", gb: 233656.32 },
      37: { label: "457.10 TB", gb: 468070.40 },
      38: { label: "915.26 TB", gb: 937226.24 },
      39: { label: "1.83 PB", gb: 1918894.08 },
      40: { label: "3.67 PB", gb: 3848273.92 },
      41: { label: "7.34 PB", gb: 7696547.84 },
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
      35: { label: "103.08 TB", gb: 105553.92 },
      36: { label: "206.65 TB", gb: 211609.60 },
      37: { label: "413.98 TB", gb: 423915.52 },
      38: { label: "828.91 TB", gb: 848803.84 },
      39: { label: "1.66 PB", gb: 1740636.16 },
      40: { label: "3.32 PB", gb: 3481272.32 },
      41: { label: "6.64 PB", gb: 6962544.64 },
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
      35: { label: "40.80 TB", gb: 41779.20 },
      36: { label: "81.80 TB", gb: 83763.20 },
      37: { label: "163.87 TB", gb: 167802.88 },
      38: { label: "328.11 TB", gb: 335984.64 },
      39: { label: "656.76 TB", gb: 672522.24 },
      40: { label: "1.31 PB", gb: 1373634.56 },
      41: { label: "2.65 PB", gb: 2757754.88 },
    },
  },
};

// Test helper functions
function calculateMinimumDepth(gigabytes) {
  for (let d = 17; d <= 41; d++) {
    if (gigabytes <= Math.pow(2, 12 + d) / (1024 ** 3)) {
      return d;
    }
  }
  return null;
}

function calculateStorageCost(depth, amount) {
  return (((2 ** depth) * amount) / 1e16).toFixed(4);
}

function findOptimalDepth(gigabytes, isEncrypted, erasureLevel) {
  const table = isEncrypted ? depthToEffectiveVolume.encrypted[erasureLevel] : depthToEffectiveVolume.unencrypted[erasureLevel];
  for (let d = 17; d <= 41; d++) {
    if (table[d] && table[d].gb >= gigabytes) {
      return d;
    }
  }
  return null;
}

function convertTimeToHours(time, unit) {
  const num = parseFloat(time);
  if (isNaN(num) || num <= 0) return 0;
  const hours = num * (unit === 'years' ? 8760 : unit === 'weeks' ? 168 : unit === 'days' ? 24 : 1);
  return hours < 24 ? 0 : hours;
}

// Test runner
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assertEqual(actual, expected, tolerance = 0) {
  if (tolerance > 0) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
      throw new Error(`Expected ${expected} (±${tolerance}), got ${actual}`);
    }
  } else {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  }
}

function assertTrue(value, message = '') {
  if (!value) throw new Error(`Expected true, got ${value}. ${message}`);
}

function assertFalse(value, message = '') {
  if (value) throw new Error(`Expected false, got ${value}. ${message}`);
}

// ============ TEST CASES ============

// Test 1: Time conversion
test('Time conversion: 1 day to hours', () => {
  const hours = convertTimeToHours('1', 'days');
  assertEqual(hours, 24);
});

test('Time conversion: 1 week to hours', () => {
  const hours = convertTimeToHours('1', 'weeks');
  assertEqual(hours, 168);
});

test('Time conversion: 1 year to hours', () => {
  const hours = convertTimeToHours('1', 'years');
  assertEqual(hours, 8760);
});

test('Time conversion: 48 hours (>= 24 hrs minimum)', () => {
  const hours = convertTimeToHours('48', 'hours');
  assertEqual(hours, 48);
});

test('Time conversion: 12 hours (< 24 hrs, should fail)', () => {
  const hours = convertTimeToHours('12', 'hours');
  assertEqual(hours, 0);
});

// Test 2: Minimum depth calculation
test('Minimum depth for 0.1 GB', () => {
  const depth = calculateMinimumDepth(0.1);
  assertTrue(depth >= 17 && depth <= 41, `Depth ${depth} out of valid range`);
});

test('Minimum depth for 1 GB', () => {
  const depth = calculateMinimumDepth(1);
  assertTrue(depth >= 17 && depth <= 41, `Depth ${depth} out of valid range`);
});

test('Minimum depth for 100 GB', () => {
  const depth = calculateMinimumDepth(100);
  assertTrue(depth >= 17 && depth <= 41, `Depth ${depth} out of valid range`);
});

test('Minimum depth for 1 TB', () => {
  const depth = calculateMinimumDepth(1024);
  assertTrue(depth >= 17 && depth <= 41, `Depth ${depth} out of valid range`);
});

test('Minimum depth increases with volume', () => {
  const depth1 = calculateMinimumDepth(1);
  const depth2 = calculateMinimumDepth(100);
  assertTrue(depth2 >= depth1, `Depth should increase with volume`);
});

// Test 3: Optimal depth selection
test('Optimal depth for 1 GB unencrypted, no erasure', () => {
  const depth = findOptimalDepth(1, false, 'none');
  assertEqual(depth, 21);
});

test('Optimal depth for 10 GB unencrypted, no erasure', () => {
  const depth = findOptimalDepth(10, false, 'none');
  assertTrue(depth >= 23 && depth <= 25, `Expected depth 23-25, got ${depth}`);
});

test('Optimal depth for 1 GB encrypted, no erasure', () => {
  const depth = findOptimalDepth(1, true, 'none');
  assertEqual(depth, 21);
});

test('Optimal depth for 100 GB unencrypted, strong erasure', () => {
  const depth = findOptimalDepth(100, false, 'strong');
  assertTrue(depth >= 24 && depth <= 26, `Expected depth 24-26, got ${depth}`);
});

test('Optimal depth for 100 GB unencrypted, paranoid erasure', () => {
  const depth = findOptimalDepth(100, false, 'paranoid');
  assertTrue(depth >= 26 && depth <= 28, `Expected depth 26-28, got ${depth}`);
});

// Test 4: Encryption/erasure impact
test('Encrypted requires higher or equal depth than unencrypted for same volume', () => {
  const volumeGB = 50;
  const unencDepth = findOptimalDepth(volumeGB, false, 'none');
  const encDepth = findOptimalDepth(volumeGB, true, 'none');
  assertTrue(encDepth >= unencDepth, `Encrypted should need >= depth than unencrypted`);
});

test('Paranoid erasure requires higher or equal depth than none', () => {
  const volumeGB = 50;
  const noneDepth = findOptimalDepth(volumeGB, false, 'none');
  const paranoidDepth = findOptimalDepth(volumeGB, false, 'paranoid');
  assertTrue(paranoidDepth >= noneDepth, `Paranoid should need >= depth than none`);
});

// Test 5: Storage cost calculation
test('Storage cost calculation for depth 20, amount 2005955210', () => {
  const cost = calculateStorageCost(20, 2005955210);
  assertTrue(parseFloat(cost) > 0, 'Cost should be positive');
});

test('Storage cost increases exponentially with depth', () => {
  const amount = 2005955210;
  const cost20 = parseFloat(calculateStorageCost(20, amount));
  const cost30 = parseFloat(calculateStorageCost(30, amount));
  assertTrue(cost30 > cost20, `Cost at depth 30 should be > cost at depth 20`);
});

test('Storage cost increases linearly with amount', () => {
  const cost1 = parseFloat(calculateStorageCost(25, 2005955210));
  const cost2 = parseFloat(calculateStorageCost(25, 4011910420));
  assertEqual(cost2 / cost1, 2, 0.01);
});

// Test 6: Edge cases - depth 17 to 41 coverage
for (let d = 17; d <= 41; d += 4) {
  test(`All erasure levels exist for depth ${d} (unencrypted)`, () => {
    const table = depthToEffectiveVolume.unencrypted;
    ['none', 'medium', 'strong', 'insane', 'paranoid'].forEach(level => {
      assertTrue(table[level][d] !== undefined, `Missing depth ${d} for level ${level}`);
    });
  });

  test(`All erasure levels exist for depth ${d} (encrypted)`, () => {
    const table = depthToEffectiveVolume.encrypted;
    ['none', 'medium', 'strong', 'insane', 'paranoid'].forEach(level => {
      assertTrue(table[level][d] !== undefined, `Missing depth ${d} for level ${level}`);
    });
  });
}

// Test 7: Volume consistency checks
test('Effective volume values are monotonically increasing (depth)', () => {
  const table = depthToEffectiveVolume.unencrypted.none;
  for (let d = 17; d < 41; d++) {
    assertTrue(table[d + 1].gb > table[d].gb, `Volume should increase from depth ${d} to ${d + 1}`);
  }
});

test('Encrypted volumes slightly lower or equal to unencrypted', () => {
  ['none', 'medium', 'strong', 'insane', 'paranoid'].forEach(level => {
    for (let d = 17; d <= 41; d++) {
      const unenc = depthToEffectiveVolume.unencrypted[level][d].gb;
      const enc = depthToEffectiveVolume.encrypted[level][d].gb;
      assertTrue(enc <= unenc * 1.01, `Encrypted ${level} at depth ${d} should be ≤ unencrypted`);
    }
  });
});

test('Paranoid erasure has smallest volumes', () => {
  for (let d = 17; d <= 41; d++) {
    const none = depthToEffectiveVolume.unencrypted.none[d].gb;
    const paranoid = depthToEffectiveVolume.unencrypted.paranoid[d].gb;
    assertTrue(paranoid < none, `Paranoid volume should be < none at depth ${d}`);
  }
});

// Run all tests
function runTests() {
  const results = {
    total: tests.length,
    passed: 0,
    failed: 0,
    failures: [],
  };

  tests.forEach(({ name, fn }) => {
    try {
      fn();
      results.passed++;
      console.log(`✓ ${name}`);
    } catch (err) {
      results.failed++;
      results.failures.push({ name, error: err.message });
      console.log(`✗ ${name}: ${err.message}`);
    }
  });

  return results;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}

const testResults = runTests();
console.log(`\n${'='.repeat(60)}`);
console.log(`TOTAL TESTS: ${testResults.total}`);
console.log(`PASSED: ${testResults.passed}`);
console.log(`FAILED: ${testResults.failed}`);
if (testResults.failures.length > 0) {
  console.log(`\nFAILURES:`);
  testResults.failures.forEach(({ name, error }) => {
    console.log(`  - ${name}: ${error}`);
  });
}
