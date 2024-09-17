export const GasDataKey = 'local-storage-gas-data-key-1';

function rejectTooSoon() {

}

export function writeGasData(something) {
  rejectTooSoon();

  let gasRawData = localStorage.getItem(GasDataKey);
  if (!gasRawData) {
    gasRawData = '[]';
  }
  const gasArray = JSON.parse(gasRawData);
  gasArray.push(something);
  const newGasRawData = JSON.stringify(gasArray);
  localStorage.setItem(GasDataKey, newGasRawData)
}

export function validateGasData(something) {
  if (!('carMileage' in something)) {
    throw new Error('gas tracker data requires car mileage');
  }
  if (!('gasAmount' in something)) {
    throw new Error('gas tracker data requires gas amount');
  }
  if (!('gasCost' in something)) {
    throw new Error('gas tracker data requires gas cost');
  }
  if (!(typeof something.carMileage === 'number' && !isNaN(something.carMileage))) {
    throw new Error('gas tracker mileage must be number');
  }
  if (!(typeof something.gasAmount === 'number' && !isNaN(something.gasAmount))) {
    throw new Error('gas tracker gas amount must be number');
  }
  if (!(typeof something.gasCost === 'number' && !isNaN(something.gasCost))) {
    throw new Error('gas tracker gas cost must be number');
  }
}
