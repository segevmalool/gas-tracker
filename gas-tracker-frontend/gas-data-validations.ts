import type { Schema } from 'yup';
import { GasDatum } from './gas-data.types';

export function validateGasData(schema: Schema, something: unknown): GasDatum {
  return schema.validateSync(something);
}
