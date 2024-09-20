import { GasDataKey } from './gas-data-constants';
export function writeGasData(something) {
    let gasRawData = localStorage.getItem(GasDataKey);
    if (!gasRawData) {
        gasRawData = '[]';
    }
    const gasArray = JSON.parse(gasRawData);
    gasArray.push(something);
    const newGasRawData = JSON.stringify(gasArray);
    localStorage.setItem(GasDataKey, newGasRawData);
}
function overwriteGasData(totalThing) {
    localStorage.setItem(GasDataKey, JSON.stringify(totalThing));
}
export function readGasData() {
    const rawData = localStorage.getItem(GasDataKey);
    if (!rawData) {
        return [];
    }
    return JSON.parse(rawData);
}
export function deleteByTimestamp(timestamp) {
    let gasData = readGasData();
    const indexOfGasRecord = gasData.findIndex((gasRecord) => gasRecord.timeStamp === timestamp);
    console.log(indexOfGasRecord);
    if (indexOfGasRecord < 0) {
        throw new Error('Can\'t find gas record with given timestamp');
    }
    gasData.splice(indexOfGasRecord, 1);
    overwriteGasData(gasData);
}
