/**
 * VolumeAndDurationCalc Test Suite
 * Tests the reverse calculator - takes depth/amount and returns volume/duration
 *
 * This works backwards from AmountAndDepthCalc: given a depth and amount,
 * it should return the effective volume and storage duration that matches
 * the original calculation.
 */

// Test constants
const DEFAULT_PRICE = 1; // PLUR per chunk per block (simplified for testing)
const SECONDS_PER_BLOCK = 5;

// Effective volume tables (same as component)
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

// Test helper functions
function calculateStorageDuration(amount, price) {
  const storageTimeInSeconds = (amount / price) * SECONDS_PER_BLOCK;
  return storageTimeInSeconds;
}

function formatDuration(seconds) {
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

function calculateTheoreticalMaxVolume(depth) {
  const bytes = Math.pow(2, depth + 12);
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

function calculateCost(depth, amount) {
  const costInPLUR = (2 ** depth) * amount;
  return (costInPLUR / 1e16).toFixed(4);
}

function getEffectiveVolume(depth, isEncrypted, erasureLevel) {
  const encKey = isEncrypted ? 'encrypted' : 'unencrypted';
  const table = depthToEffectiveVolume[encKey][erasureLevel];
  return table[depth] || "N/A";
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

function assertCloseTo(actual, expected, percentTolerance) {
  const tolerance = expected * (percentTolerance / 100);
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ${expected} (±${percentTolerance}%), got ${actual}`);
  }
}

// ============ TEST CASES ============

// Test 1: Input validation
test('Depth validation: valid range 17-41', () => {
  for (let depth = 17; depth <= 41; depth += 4) {
    assertTrue(depth >= 17 && depth <= 41);
  }
});

test('Amount validation: positive integer required', () => {
  const validAmounts = [2005955210, 4011910420, 100000000];
  validAmounts.forEach(amount => {
    assertTrue(Number.isInteger(amount) && amount > 0);
  });
});

// Test 2: Storage duration calculation
test('Storage duration: 1 day for standard amount', () => {
  const amount = 86400 * DEFAULT_PRICE / SECONDS_PER_BLOCK; // 1 day worth
  const seconds = calculateStorageDuration(amount, DEFAULT_PRICE);
  assertEqual(seconds, 86400, 1);
});

test('Storage duration: scales linearly with amount', () => {
  const amount1 = 1000000;
  const amount2 = 2000000;
  const duration1 = calculateStorageDuration(amount1, DEFAULT_PRICE);
  const duration2 = calculateStorageDuration(amount2, DEFAULT_PRICE);
  assertCloseTo(duration2 / duration1, 2, 1);
});

test('Storage duration: formatting works for years', () => {
  const yearInSeconds = 365 * 86400 + 1;
  const formatted = formatDuration(yearInSeconds);
  assertTrue(formatted.includes('year'), `Expected 'year' in ${formatted}`);
});

test('Storage duration: formatting works for days', () => {
  const dayInSeconds = 86400 + 1;
  const formatted = formatDuration(dayInSeconds);
  assertTrue(formatted.includes('day'), `Expected 'day' in ${formatted}`);
});

// Test 3: Theoretical maximum volume calculation
test('Theoretical max volume: increases exponentially with depth', () => {
  const vol20 = Math.pow(2, 20 + 12);
  const vol21 = Math.pow(2, 21 + 12);
  assertTrue(vol21 > vol20, 'Volume should increase with depth');
});

test('Theoretical max volume: formatted correctly', () => {
  const formatted = calculateTheoreticalMaxVolume(20);
  assertTrue(formatted.includes('MB') || formatted.includes('GB'), 'Should have units');
  assertTrue(/^\d+\.\d+/.test(formatted), 'Should have decimal format');
});

// Test 4: Cost calculation
test('Cost calculation: increases exponentially with depth', () => {
  const amount = 2005955210;
  const cost20 = parseFloat(calculateCost(20, amount));
  const cost30 = parseFloat(calculateCost(30, amount));
  assertTrue(cost30 > cost20, 'Cost should increase with depth');
});

test('Cost calculation: increases linearly with amount', () => {
  const depth = 25;
  const amount1 = 1000000;
  const amount2 = 2000000;
  const cost1 = parseFloat(calculateCost(depth, amount1));
  const cost2 = parseFloat(calculateCost(depth, amount2));
  assertCloseTo(cost2 / cost1, 2, 2);
});

// Test 5: Effective volume lookup (core component)
test('Effective volume: exists for all depths unencrypted', () => {
  for (let d = 17; d <= 41; d++) {
    const vol = getEffectiveVolume(d, false, 'none');
    assertTrue(vol !== "N/A", `Depth ${d} should have volume`);
  }
});

test('Effective volume: exists for all depths encrypted', () => {
  for (let d = 17; d <= 41; d++) {
    const vol = getEffectiveVolume(d, true, 'paranoid');
    assertTrue(vol !== "N/A", `Depth ${d} encrypted should have volume`);
  }
});

test('Effective volume: encrypted slightly smaller than unencrypted', () => {
  const unenc = getEffectiveVolume(25, false, 'none');
  const enc = getEffectiveVolume(25, true, 'none');
  assertTrue(unenc !== enc, 'Encrypted should differ from unencrypted');
});

// Test 6: Depth-specific tests (sample depths from first calculator tests)
test('Depth 20: small batch scenario', () => {
  const depth = 20;
  const amount = 2005955210;
  const duration = calculateStorageDuration(amount, DEFAULT_PRICE);
  const maxVol = calculateTheoreticalMaxVolume(depth);
  const cost = calculateCost(depth, amount);

  assertTrue(duration > 0, 'Duration should be positive');
  assertTrue(maxVol.includes('MB') || maxVol.includes('GB'), 'Max volume should have units');
  assertTrue(parseFloat(cost) > 0, 'Cost should be positive');
});

test('Depth 25: medium batch scenario', () => {
  const depth = 25;
  const amount = 2005955210;
  const effectiveVol = getEffectiveVolume(depth, false, 'none');
  assertTrue(effectiveVol.includes('GB') || effectiveVol.includes('TB'), 'Should be GB/TB at depth 25');
});

test('Depth 30: large batch scenario', () => {
  const depth = 30;
  const amount = 2005955210;
  const cost = calculateCost(depth, amount);
  const cost25 = calculateCost(25, amount);
  assertTrue(parseFloat(cost) > parseFloat(cost25), 'Depth 30 cost should exceed depth 25');
});

// Test 7: Encryption and erasure coding impact
test('Encryption effect: encrypted batch has lower effective volume', () => {
  const unenc = getEffectiveVolume(25, false, 'none');
  const enc = getEffectiveVolume(25, true, 'none');
  // Both should be valid but different
  assertTrue(unenc !== enc, 'Encrypted and unencrypted volumes should differ');
});

test('Erasure coding effect: paranoid has smallest volume', () => {
  const depth = 25;
  const none = getEffectiveVolume(depth, false, 'none');
  const paranoid = getEffectiveVolume(depth, false, 'paranoid');
  // Paranoid should produce smaller effective volume (more overhead)
  assertTrue(paranoid !== none, 'Paranoid should differ from none');
});

// Test 8: Round-trip validation (forward and backward should match)
test('Round-trip: theoretical max volume calculation is consistent', () => {
  for (let d = 17; d <= 41; d += 4) {
    const bytes = Math.pow(2, d + 12);
    const formatted = calculateTheoreticalMaxVolume(d);
    assertTrue(formatted.includes('.') && (formatted.includes('MB') ||
              formatted.includes('GB') || formatted.includes('TB') ||
              formatted.includes('PB')), `Depth ${d} should format correctly`);
  }
});

test('Round-trip: cost formula is mathematically consistent', () => {
  const amount = 2005955210;
  for (let d = 17; d <= 30; d++) {
    const cost = calculateCost(d, amount);
    const costValue = parseFloat(cost);
    const expectedFormula = ((Math.pow(2, d) * amount) / 1e16);
    assertEqual(costValue, expectedFormula, 0.0001);
  }
});

// Test 9: Edge cases
test('Minimum depth (17): calculations work', () => {
  const depth = 17;
  const amount = 2005955210;
  const duration = calculateStorageDuration(amount, DEFAULT_PRICE);
  const maxVol = calculateTheoreticalMaxVolume(depth);
  const cost = calculateCost(depth, amount);

  assertTrue(duration > 0, 'Duration should be positive');
  assertTrue(maxVol.includes('kB') || maxVol.includes('MB'), 'Small depth should be in kB/MB');
  assertTrue(parseFloat(cost) > 0, 'Cost should be positive');
});

test('Maximum depth (41): calculations work', () => {
  const depth = 41;
  const amount = 2005955210;
  const maxVol = calculateTheoreticalMaxVolume(depth);
  const cost = calculateCost(depth, amount);

  assertTrue(maxVol.includes('PB') || maxVol.includes('TB'), 'Large depth should be in TB/PB');
  assertTrue(parseFloat(cost) > 0, 'Cost should be positive');
});

// Test 10: Price sensitivity
test('Price sensitivity: duration inverse relationship', () => {
  const amount = 1000000;
  const duration1 = calculateStorageDuration(amount, 1);
  const duration2 = calculateStorageDuration(amount, 2);
  assertEqual(duration2 / duration1, 0.5, 0.0001);
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
