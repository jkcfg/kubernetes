import { encode, ascii2bytes } from '../src/base64';

test('empty -> empty', () => {
  expect(encode(new Uint8Array(0))).toEqual('');
});

test('ascii2bytes', () => {
  expect(ascii2bytes('ABC')).toEqual([65, 66, 67]);
});

// from RFC 4648
[
  ['f', 'Zg=='],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"],
].forEach(([input, output]) => {
  test(`'${input}' -> '${output}' `, () => {
    expect(encode(ascii2bytes(input))).toEqual(output);
  });
});
