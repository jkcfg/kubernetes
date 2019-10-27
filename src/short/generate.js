import { long } from './index';
import { valuesForGenerate } from '../generate';

export function generateFromShorts(shorts) {
  const longs = Promise.all(shorts.map(async (v) => {
    const s = await Promise.resolve(v);
    return long(s);
  }));
  return valuesForGenerate(longs);
}
