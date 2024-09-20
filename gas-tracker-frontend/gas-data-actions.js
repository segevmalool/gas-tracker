import { LitElement, html, css } from 'lit';
import { readGasData, deleteByTimestamp } from './gas-data-persistence';
import { reloadGasDataDashboard } from './gas-data-view-helpers';
export class GasDataActions extends LitElement {
    constructor() {
        super();
        this.gasData = readGasData();
    }
    deleteGasRecord(event) {
        deleteByTimestamp(event.target.parentNode.id);
        reloadGasDataDashboard();
    }
    render() {
        var _a;
        return html `
      <table>
        <tr>
          <th>Actions</th>
        </tr>
        ${(_a = this.gasData) === null || _a === void 0 ? void 0 : _a.map((gasDatum) => html `
                  <tr>
                    <td id="${gasDatum.timeStamp}"><span @click="${this.deleteGasRecord}">Delete</span></td>
                  </tr>
                `)}
      </table>
    `;
    }
}
GasDataActions.styles = css `
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
customElements.define('gas-data-actions', GasDataActions);
