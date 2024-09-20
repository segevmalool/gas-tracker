import { LitElement, html, css } from 'lit';
import { readGasData } from './gas-data-persistence';
import type { GasDatum } from './gas-data.types';

import './gas-data-actions';

export class GasDataDashboard extends LitElement {
  private gasData;

  static styles = css`
      table, td, th {
          border: 1px solid black;
      }
      
      td, th {
          padding: 10px;
      }
  `;

  constructor() {
    super();
    this.gasData = readGasData();
  }

  getGasDataTable() {
    return html`
      <table>
        <tr>
          <th>Car Mileage</th>
          <th>Gas Amount Purchased</th>
          <th>Gas Total Cost</th>
          <th>Date and Time</th>
        </tr>
        ${this.gasData?.map((gasDatum: GasDatum) =>
            html`
              <tr>
                <td>${gasDatum.carMileage}</td>
                <td>${gasDatum.gasAmount}</td>
                <td>${gasDatum.gasCost}</td>
                <td>${new Date(gasDatum.timeStamp).toLocaleDateString()} ${new Date(gasDatum.timeStamp).toLocaleTimeString()}</td>
              </tr>
            `
        )}
      </table>
    `;
  }

  render() {
    return html`
      <div style="display: flex;">
        ${this.getGasDataTable()}
        <gas-data-actions></gas-data-actions>
      </div>
    `
  }
}

customElements.define('gas-data-dashboard', GasDataDashboard);
