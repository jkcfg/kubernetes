import { values } from '../src/chart/values';

function params(obj = {}) {
  return { Object: (k, d) => (obj.hasOwnProperty(k)) ? obj[k] : d };
}

test('empty values and empty defaults', () => {
  const vals = values(params({}));
  expect(vals({})).toEqual({});
});

test('defaults', () => {
  const vals = values(params({}));
  expect(vals({app: 'foo'})).toEqual({app: 'foo'});
});

test('defaults and values', () => {
  const commandLine = {image: {repository: 'helloworld'}};
  const vals = values(params({values: commandLine}));
  expect(vals({image: {tag: 'v1'}})).toEqual({
    image: {
      repository: 'helloworld',
      tag: 'v1',
    }
  });
});

test('values override defaults', () => {
  const vals = values(params({values: {app: 'bar'}}));
  expect(vals({app: 'foo'})).toEqual({app: 'bar'});
});
