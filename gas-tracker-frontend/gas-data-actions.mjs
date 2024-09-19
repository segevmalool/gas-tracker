import { LitElement, html, css } from 'lit';
import { readGasData, deleteByTimestamp } from './gas-data-persistence.js';

export class GasDataActions extends LitElement {
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

  deleteGasRecord(event) {
    deleteByTimestamp(event.target.parentNode.id);
    reloadGasDataView();
  }

  render() {
    return html`
      <table>
        <tr>
          <th>Actions</th>
        </tr>
        ${
            this.gasData?.map((gasDatum) =>
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
