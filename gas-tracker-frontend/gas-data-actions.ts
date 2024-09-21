import { LitElement, html, css } from 'lit';
import { readGasData, deleteByTimestamp } from './gas-data-persistence';
import { reloadGasDataDashboard } from './gas-data-view-helpers';
import type { GasDatum } from './gas-data.types';
import { state } from 'lit/decorators/state.js';

export class GasDataActions extends LitElement {
  @state()
  private gasData?: GasDatum[];

  static styles = css`
      table, td, th {
          border: 1px solid black;
      }
      
      td, th {
          padding: 10px;
      }

      td > span:hover {
          background-color: aquamarine;
          cursor: pointer;
      }
  `;

  constructor() {
    super();
  }

  public async connectedCallback() {
    super.connectedCallback();
    await this.readGasData();
  }

  private async readGasData() {
    this.gasData = readGasData();
  }

  private async deleteGasRecord(event: PointerEvent) {
    const timeStamp = (event.target as HTMLElement)?.id;

    if (!timeStamp) {
      throw new Error('Failed to delete event, element timestamp does not exist');
    }

    deleteByTimestamp(timeStamp);
    await this.readGasData();
    reloadGasDataDashboard();
  }

  render() {
    return html`
      <table>
        <tr>
          <th>Actions</th>
        </tr>
        ${
            this.gasData?.map((gasDatum: GasDatum) =>
                html`
                  <tr>
                    <td><span id="${gasDatum.timeStamp}" @click="${this.deleteGasRecord}">Delete</span></td>
                  </tr>
                `
            )
        }
      </table>
    `;
  }
}

customElements.define('gas-data-actions', GasDataActions);
