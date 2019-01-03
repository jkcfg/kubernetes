import { basename, dirname } from '../src/path';

test('basename of bare filename is the filename', () => {
  expect(basename('foo.txt')).toEqual('foo.txt');
});

test('basename of apparent dir is empty', () => {
  expect(basename('foo/')).toEqual('');
});

test('basename of file in a few nested directories', () => {
  expect(basename('./foo/bar/baz.config/conf.txt')).toEqual('conf.txt');
});

test('basename in current dir', () => {
  expect(basename('./foo.txt')).toEqual('foo.txt');
});

test('lack of extension does not affect basename', () => {
  expect(basename('./foo')).toEqual('foo');
});

test('dirname of filename is empty', () => {
  expect(dirname('foo')).toEqual('');
});

test('dirname of root is empty', () => {
  expect(dirname('/')).toEqual('');
});

test('dirname of single dir-looking thing', () => {
  expect(dirname('foo/')).toEqual('foo');
});

test('dirname with file at the end', () => {
  expect(dirname('foo/bar/baz')).toEqual('foo/bar');
});

test('dirname of current dir', () => {
  expect(dirname('./')).toEqual('.');
});
