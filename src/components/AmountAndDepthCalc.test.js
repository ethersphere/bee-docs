/**
 * AmountAndDepthCalc Test Suite
 * Tests the postage stamp calculator logic
 */

// Extract the calculator logic for testing
const depthToEffectiveVolume = {
  unencrypted: {
    none: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    medium: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    strong: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    insane: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    paranoid: {
      17: { label: "11.978 KB", gb: 0.000012 },
      18: { label: "1.742 MB", gb: 0.001699 },
      19: { label: "29.323 MB", gb: 0.028630 },
      20: { label: "179.933 MB", gb: 0.175658 },
      21: { label: "0.665 GB", gb: 0.665 },
      22: { label: "1.975 GB", gb: 1.975 },
      23: { label: "5.096 GB", gb: 5.096 },
      24: { label: "10.192 GB", gb: 10.192 },
      25: { label: "20.384 GB", gb: 20.384 },
      26: { label: "40.769 GB", gb: 40.769 },
      27: { label: "81.538 GB", gb: 81.538 },
      28: { label: "163.075 GB", gb: 163.075 },
      29: { label: "0.326 TB", gb: 326.150 },
      30: { label: "0.652 TB", gb: 652.301 },
      31: { label: "1.305 TB", gb: 1304.602 },
      32: { label: "2.609 TB", gb: 2609.203 },
      33: { label: "5.219 TB", gb: 5218.406 },
      34: { label: "10.437 TB", gb: 10436.813 },
      35: { label: "20.875 TB", gb: 20873.626 },
      36: { label: "41.749 TB", gb: 41747.251 },
      37: { label: "83.498 TB", gb: 83494.502 },
      38: { label: "166.996 TB", gb: 166989.005 },
      39: { label: "0.334 PB", gb: 333978.010 },
      40: { label: "0.668 PB", gb: 667956.019 },
      41: { label: "1.336 PB", gb: 1335912.038 },
    },
  },
  encrypted: {
    none: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    medium: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    strong: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    insane: {
      17: { label: "39.932 KB", gb: 0.000039 },
      18: { label: "5.808 MB", gb: 0.005664 },
      19: { label: "97.742 MB", gb: 0.095432 },
      20: { label: "599.775 MB", gb: 0.585527 },
      21: { label: "2.217 GB", gb: 2.217 },
      22: { label: "6.584 GB", gb: 6.584 },
      23: { label: "16.987 GB", gb: 16.987 },
      24: { label: "33.974 GB", gb: 33.974 },
      25: { label: "67.948 GB", gb: 67.948 },
      26: { label: "135.896 GB", gb: 135.896 },
      27: { label: "271.792 GB", gb: 271.792 },
      28: { label: "543.584 GB", gb: 543.584 },
      29: { label: "1.087 TB", gb: 1087.168 },
      30: { label: "2.174 TB", gb: 2174.336 },
      31: { label: "4.349 TB", gb: 4348.672 },
      32: { label: "8.698 TB", gb: 8697.344 },
      33: { label: "17.395 TB", gb: 17394.688 },
      34: { label: "34.791 TB", gb: 34789.376 },
      35: { label: "69.582 TB", gb: 69578.752 },
      36: { label: "139.163 TB", gb: 139157.504 },
      37: { label: "278.327 TB", gb: 278315.008 },
      38: { label: "556.654 TB", gb: 556630.016 },
      39: { label: "1.113 PB", gb: 1113260.032 },
      40: { label: "2.227 PB", gb: 2226520.064 },
      41: { label: "4.453 PB", gb: 4453040.128 },
    },
    paranoid: {
      17: { label: "11.978 KB", gb: 0.000012 },
      18: { label: "1.742 MB", gb: 0.001699 },
      19: { label: "29.323 MB", gb: 0.028630 },
      20: { label: "179.933 MB", gb: 0.175658 },
      21: { label: "0.665 GB", gb: 0.665 },
      22: { label: "1.975 GB", gb: 1.975 },
      23: { label: "5.096 GB", gb: 5.096 },
      24: { label: "10.192 GB", gb: 10.192 },
      25: { label: "20.384 GB", gb: 20.384 },
      26: { label: "40.769 GB", gb: 40.769 },
      27: { label: "81.538 GB", gb: 81.538 },
      28: { label: "163.075 GB", gb: 163.075 },
      29: { label: "0.326 TB", gb: 326.150 },
      30: { label: "0.652 TB", gb: 652.301 },
      31: { label: "1.305 TB", gb: 1304.602 },
      32: { label: "2.609 TB", gb: 2609.203 },
      33: { label: "5.219 TB", gb: 5218.406 },
      34: { label: "10.437 TB", gb: 10436.813 },
      35: { label: "20.875 TB", gb: 20873.626 },
      36: { label: "41.749 TB", gb: 41747.251 },
      37: { label: "83.498 TB", gb: 83494.502 },
      38: { label: "166.996 TB", gb: 166989.005 },
      39: { label: "0.334 PB", gb: 333978.010 },
      40: { label: "0.668 PB", gb: 667956.019 },
      41: { label: "1.336 PB", gb: 1335912.038 },
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
