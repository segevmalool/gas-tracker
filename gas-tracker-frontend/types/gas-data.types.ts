import type { InferType } from 'yup';
import { GasDatumSchema } from './gas-data.schema';

export type GasDatum = InferType<typeof GasDatumSchema>;

export interface GasData {
  gasData: GasDatum[],
}

export enum GasDataPersistenceEvents {
  addRecord = 'addRecord',
  deleteRecordByTimestamp = 'deleteRecordByTimestamp',
}

export type GasDataMilesPerGallon = { endDateTimestamp: string, mpg: number };
