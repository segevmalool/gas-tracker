import { GasDataKey } from '../gas-data-constants';
import type { GasDatum } from '../types/gas-data.types';

export function addGasDatum(something: GasDatum): void {
  let gasRawData = localStorage.getItem(GasDataKey);
  if (!gasRawData) {
    gasRawData = '[]';
  }
  const gasArray = JSON.parse(gasRawData);
  gasArray.push(something);
  const newGasRawData = JSON.stringify(gasArray);
  localStorage.setItem(GasDataKey, newGasRawData)
}

function overwriteGasData(totalThing: GasDatum[]): void {
  localStorage.setItem(GasDataKey, JSON.stringify(totalThing));
}

export function readGasData(): GasDatum[] {
  const rawData = localStorage.getItem(GasDataKey);

  if (!rawData) {
    return [];
  }

  return JSON.parse(rawData);
}

// The timestamp input identifies the record, but it doesn't
export function deleteByTimestamp(timestamp: string): void {
  let gasData = readGasData();

  const indexOfGasRecord = gasData.findIndex((gasRecord: GasDatum) => gasRecord.timeStamp === timestamp);

  if (indexOfGasRecord < 0) {
    throw new Error('Can\'t find gas record with given timestamp');
  }

  gasData.splice(indexOfGasRecord, 1);

  overwriteGasData(gasData);
}
