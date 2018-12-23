import overlay from '../src/cons/overlay';
import { fs, Encoding } from './mock';

test('trivial overlay: no bases, resources, patches', () => {
  const o = overlay({});
  const { dir, read } = fs({}, {});
  expect.assertions(1);
  o('config', {dir, read }).then(v => {
    expect(v).toEqual([]);
  });
});
