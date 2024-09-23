import { EventEmitter } from 'events';
import { Observable, Subscriber } from 'rxjs';

import { GasDataKey } from '../gas-data-constants';
import { GasData, GasDataPersistenceEvents, GasDatum } from '../types/gas-data.types';

// This class combines a rxjs observable with an event emitter in order to provide a pub-sub interface.
export class GasDataPersistence extends EventEmitter {
  private static instance: GasDataPersistence;

  private gasData$: Observable<GasData> =
    new Observable((subscriber: Subscriber<GasData>) => {
      this.on(GasDataPersistenceEvents.addRecord, (gasDatum: GasDatum) => {
        this.addGasDatum(gasDatum);
        subscriber.next({ gasData: this.readGasData() });
      });

      this.on(GasDataPersistenceEvents.deleteRecordByTimestamp, async (timestamp) => {
        this.deleteByTimestamp(timestamp)
        subscriber.next({ gasData: this.readGasData() })
      });

      subscriber.next({ gasData: this.readGasData() })
    });

  public get getGasData$() {
    return this.gasData$;
  }

  private addGasDatum(something: GasDatum): void {
    let gasRawData = localStorage.getItem(GasDataKey);
    if (!gasRawData) {
      gasRawData = '[]';
    }
    const gasArray = JSON.parse(gasRawData);
    gasArray.push(something);
    const newGasRawData = JSON.stringify(gasArray);
    localStorage.setItem(GasDataKey, newGasRawData)
  }

  private readGasData(): GasDatum[] {
    const rawData = localStorage.getItem(GasDataKey);

    if (!rawData) {
      return [];
    }

    return JSON.parse(rawData);
  }

  private overwriteGasData(totalThing: GasDatum[]): void {
    localStorage.setItem(GasDataKey, JSON.stringify(totalThing));
  }

  private deleteByTimestamp(timestamp: string): void {
    let gasData = this.readGasData();

    const indexOfGasRecord = gasData.findIndex((gasRecord: GasDatum) => gasRecord.timeStamp === timestamp);

    if (indexOfGasRecord < 0) {
      throw new Error('Can\'t find gas record with given timestamp');
    }

    gasData.splice(indexOfGasRecord, 1);

    this.overwriteGasData(gasData);
  }

  public static getInstance() {
    if (GasDataPersistence.instance) {
      return GasDataPersistence.instance;
    }

    GasDataPersistence.instance = new this();
    return GasDataPersistence.instance;
  }
}
