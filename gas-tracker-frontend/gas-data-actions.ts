import { LitElement, html, css } from 'lit';
import { readGasData, deleteByTimestamp } from './gas-data-persistence';
import { reloadGasDataDashboard } from './gas-data-view-helpers';
import type { GasDatum } from './gas-data.types';

export class GasDataActions extends LitElement {
  private gasData;

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
    this.gasData = readGasData();
  }

  deleteGasRecord(event: any) {
    deleteByTimestamp(event.target.parentNode.id);
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
                    <td id="${gasDatum.timeStamp}"><span @click="${this.deleteGasRecord}">Delete</span></td>
                  </tr>
                `
            )
        }
      </table>
    `;
  }
}

customElements.define('gas-data-actions', GasDataActions);
