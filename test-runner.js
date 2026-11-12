let testResults = [];
let currentSuite = '';
let beforeEachCallback = null;

function describe(suiteName, callback) {
  currentSuite = suiteName;
  beforeEachCallback = null;
  callback();
}

function beforeEach(callback) {
  beforeEachCallback = callback;
}

function it(testName, callback) {
  try {
    if (beforeEachCallback) {
      beforeEachCallback();
    }

    callback();
    testResults.push({ name: currentSuite + ' - ' + testName, passed: true });
  } catch (error) {
    testResults.push({
      name: currentSuite + ' - ' + testName,
      passed: false,
      error: error.message
    });
  }
}

function deepEqual(firstValue, secondValue) {
  if (Object.is(firstValue, secondValue)) {
    return true;
  }

  if (firstValue === null || secondValue === null ||
      typeof firstValue !== 'object' || typeof secondValue !== 'object') {
    return false;
  }

  if (Array.isArray(firstValue) !== Array.isArray(secondValue)) {
    return false;
  }

  let firstKeys = Object.keys(firstValue);
  let secondKeys = Object.keys(secondValue);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every(function (key) {
    return Object.prototype.hasOwnProperty.call(secondValue, key) &&
      deepEqual(firstValue[key], secondValue[key]);
  });
}

function expect(actualValue) {
  return {
    toBe: function (expectedValue) {
      if (!Object.is(actualValue, expectedValue)) {
        throw new Error('Ожидалось: ' + String(expectedValue) + ', получено: ' + String(actualValue));
      }
    },
    toEqual: function (expectedValue) {
      if (!deepEqual(actualValue, expectedValue)) {
        throw new Error('Значения не совпадают');
      }
    }
  };
}

function renderResults() {
  let summary = document.getElementById('summary');
  let resultsList = document.getElementById('results');
  let passedTests = testResults.filter(function (result) {
    return result.passed;
  }).length;

  summary.textContent = 'Пройдено ' + passedTests + ' из ' + testResults.length + ' проверок';

  for (let result of testResults) {
    let item = document.createElement('li');
    item.className = result.passed ? 'passed' : 'failed';
    item.textContent = (result.passed ? 'OK: ' : 'Ошибка: ') + result.name;

    if (!result.passed) {
      item.textContent += ' - ' + result.error;
    }

    resultsList.appendChild(item);
  }
}
