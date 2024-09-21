export function reloadGasDataDashboard() {
  // Reload the gas data dashboard.
  for (const gasView of document.getElementsByTagName('gas-data-dashboard')) {
    gasView.remove();
  }
  document.body.appendChild(document.createElement('gas-data-dashboard'));
}
