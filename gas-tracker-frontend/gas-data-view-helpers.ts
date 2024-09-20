import { GasDatumSchema } from './gas-data.schema';
import { validateGasData } from './gas-data-validations';
import { writeGasData } from './gas-data-persistence'

export function reloadGasDataDashboard() {
  // Reload the gas data dashboard.
  for (const gasView of document.getElementsByTagName('gas-data-dashboard')) {
    gasView.remove();
  }
  document.body.appendChild(document.createElement('gas-data-dashboard'));
}

export function hookGasDataFormEvent() {
  const gasRecordForm = document.getElementById('gas-record-form');

  if (!gasRecordForm) {
    throw new Error('Gas record form not found. Probably it\'s not loaded yet.')
  }

  gasRecordForm.addEventListener('formdata', (event) => {
    event.preventDefault();

    // Convert the form data to a regular object.
    const timeStamp = new Date(event.timeStamp + performance.timeOrigin).toISOString();
    // This any will be validated below.
    const gasData: any = {
      timeStamp,
    };

    for (const [key, value] of event.formData.entries()) {
      // All the gas tracker data must be numbers
      gasData[key] = Number(value) || undefined;
    }

    // Validate and persist the data.
    validateGasData(GasDatumSchema, gasData);
    writeGasData(gasData);

    reloadGasDataDashboard();
  });
}
