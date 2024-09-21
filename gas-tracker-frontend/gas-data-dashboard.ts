import { LitElement, html, css } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { state } from 'lit/decorators/state.js';

import { addGasDatum, readGasData } from './gas-data-persistence';
import type { GasDatum } from './gas-data.types';

import { GasDatumSchema } from './gas-data.schema';
import { validateGasData } from './gas-data-validations';

import { reloadGasDataDashboard } from './gas-data-view-helpers';

import './gas-data-actions';

export class GasDataDashboard extends LitElement {
  private carMileageRef: Ref<HTMLInputElement> = createRef();
  private gasAmountRef: Ref<HTMLInputElement> = createRef();
  private gasCostRef: Ref<HTMLInputElement> = createRef();


  @state()
  private gasData?: GasDatum[];

  static styles = css`
      table, td, th {
          border: 1px solid black;
      }
      
      td, th {
          padding: 10px;
      }
  `;

  public async connectedCallback() {
    super.connectedCallback();
    await this.readGasData();
  }

  private async readGasData() {
    this.gasData = readGasData();
  }

  private async submitGasDatum(): Promise<void> {
    const timeStamp = new Date().toISOString();

    const gasData: GasDatum = {
      timeStamp,
      carMileage: Number(this.carMileageRef.value?.value),
      gasAmount: Number(this.gasAmountRef.value?.value),
      gasCost: Number(this.gasCostRef.value?.value),
    };

    // Validate and persist the data.
    validateGasData(GasDatumSchema, gasData);
    addGasDatum(gasData);
    await this.readGasData();
    reloadGasDataDashboard();
  }

  private getGasDataTable() {
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

  private getGasDatumForm() {
    return html`
      <h2>Record your gas datas:</h2>
      <div>
        <label>Total mileage (miles, read odometer): <input ${ref(this.carMileageRef)} name="carMileage" type="text"></label><br>
        <label>Gas purchased (gallons): <input ${ref(this.gasAmountRef)} name="gasAmount" type="text"></label><br>
        <label>Gas total cost (dollars): <input ${ref(this.gasCostRef)} name="gasCost" type="text"></label><br>
        <label><input @click=${this.submitGasDatum} type="submit"></label>
      </div>
    `;
  }

  render() {
    return html`
      ${this.getGasDatumForm()}
      <hr>
      <h2>Your Gas Data</h2>
      <div style="display: flex;">
        ${this.getGasDataTable()}
        <gas-data-actions></gas-data-actions>
      </div>
    `
  }
}

customElements.define('gas-data-dashboard', GasDataDashboard);
