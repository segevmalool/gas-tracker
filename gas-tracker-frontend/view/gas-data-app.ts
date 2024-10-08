import { LitElement, html, css } from 'lit';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { state } from 'lit/decorators/state.js';
import { Subscription } from 'rxjs';


import { GasDataPersistence } from '../persistence/gas-data-persistence';
import { GasData, GasDataPersistenceEvents, GasDatum } from '../types/gas-data.types';

import { GasDatumSchema } from '../types/gas-data.schema';
import { validateGasData } from '../validations/gas-data-validations';

import './gas-data-analytics-dashboard';

export class GasDataApp extends LitElement {
  private carMileageRef: Ref<HTMLInputElement> = createRef();
  private gasAmountRef: Ref<HTMLInputElement> = createRef();
  private gasCostRef: Ref<HTMLInputElement> = createRef();

  private gasDataSubscription?: Subscription;

  @state()
  private gasData?: GasDatum[];

  @state()
  private showAddRecordForm: boolean = false;

  @state()
  private showDashboard: boolean = false;

  static styles = css`
      table, td, th {
          border: 1px solid black;
      }
      
      td, th {
          padding: 10px;
      }
      
      .indicateAction:hover {
          background-color: chartreuse;
          cursor: pointer;
      }
  `;

  public async connectedCallback() {
    super.connectedCallback();
    await this.subscribeGasData();
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.gasDataSubscription?.unsubscribe();
  }

  private async subscribeGasData() {
    this.gasDataSubscription = GasDataPersistence.getInstance().getGasData$.subscribe((gasDataObservation: GasData) => {
      if (!gasDataObservation.gasData) {
        throw new Error('received empty gas data')
      }

      this.gasData = gasDataObservation.gasData;
    });
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
    GasDataPersistence.getInstance().emit(GasDataPersistenceEvents.addRecord, gasData);
  }

  private async deleteGasRecord(event: PointerEvent) {
    const timeStamp = (event.target as HTMLElement)?.id;

    if (!timeStamp) {
      throw new Error('Failed to delete event, element timestamp does not exist');
    }

    GasDataPersistence.getInstance().emit(GasDataPersistenceEvents.deleteRecordByTimestamp, timeStamp);
  }

  private getGasDataTable() {
    return html`
      <h2>Your Gas Data</h2>
      <table>
        <tr>
          <th>Car Mileage</th>
          <th>Gas Amount Purchased</th>
          <th>Gas Total Cost</th>
          <th>Date and Time</th>
          <th>Actions</th>
        </tr>
        ${this.gasData?.map((gasDatum: GasDatum) =>
            html`
              <tr>
                <td>${gasDatum.carMileage}</td>
                <td>${gasDatum.gasAmount}</td>
                <td>${gasDatum.gasCost}</td>
                <td>${new Date(gasDatum.timeStamp).toLocaleDateString()} ${new Date(gasDatum.timeStamp).toLocaleTimeString()}</td>
                <td><span id="${gasDatum.timeStamp}" class="indicateAction" @click="${this.deleteGasRecord}">Delete</span></td>
              </tr>
            `
        )}
      </table>
      <hr>
    `;
  }

  private getAddGasDatumForm() {
    return html`
      <div>
        <h2>Record your gas datas</h2>
        <label>Total mileage (miles, read odometer): <input ${ref(this.carMileageRef)} name="carMileage"
                                                            type="text"></label><br>
        <label>Gas purchased (gallons): <input ${ref(this.gasAmountRef)} name="gasAmount" type="text"></label><br>
        <label>Gas total cost (dollars): <input ${ref(this.gasCostRef)} name="gasCost" type="text"></label><br>
        <label><input @click=${this.submitGasDatum} type="submit"></label>
      </div>
      <hr>
    `;
  }

  private getDataVis() {
    return html`
      <gas-data-analytics-dashboard></gas-data-analytics-dashboard>
      <hr>
    `;
  }

  private getGasDataControlPanel() {
    return html`
      <div>
        <button @click="${() => this.showAddRecordForm = !this.showAddRecordForm}">
          ${this.showAddRecordForm ? 'Hide' : 'Show'} Add Record Form
        </button>
        <button @click="${() => this.showDashboard = !this.showDashboard}">
          ${this.showDashboard ? 'Hide' : 'Show'} Data Analytics
        </button>
      </div>
      <hr>
    `;
  }

  render() {
    return html`
      ${this.getGasDataControlPanel()}
      ${this.showAddRecordForm ? this.getAddGasDatumForm() : null}
      ${this.showDashboard ? this.getDataVis() : null}
      ${this.getGasDataTable()}
    `
  }
}

customElements.define('gas-data-dashboard', GasDataApp);
