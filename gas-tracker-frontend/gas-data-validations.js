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
