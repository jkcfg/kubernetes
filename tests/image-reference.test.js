import { ImageReference } from '../src/image-reference';

// from https://github.com/docker/distribution/blob/master/reference/reference_test.go
[
  ['test_com', { path: 'test_com' }],
  ['test.com:tag', { path: 'test.com', tag: 'tag' }],
  ['test.com:5000', { path: 'test.com', tag: '5000' }],
  ['test.com/repo:tag', { domain: 'test.com', path: 'repo', tag: 'tag' }],
  ['test.com:5000/repo', { domain: 'test.com:5000', path: 'repo' } ],
  ['test.com:5000/repo:tag', { domain: 'test.com:5000', path: 'repo', tag: 'tag' } ],
  ['test:5000/repo@sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', {
     domain: 'test:5000',
     path: 'repo',
     digest: 'sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  }],
  ['test:5000/repo:tag@sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', {
     domain: 'test:5000',
     path: 'repo',
     tag: 'tag',
     digest: 'sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  }],
  ['test:5000/repo', { domain: 'test:5000', path: 'repo' } ],
  [':justtag', { err: 'invalid' }],
  ['b.gcr.io/test.example.com/my-app:test.example.com', {
     domain: 'b.gcr.io',
     path: 'test.example.com/my-app',
     tag: 'test.example.com',
  }],
].forEach(([input, expected]) => {
  test(input, () => {
    const f = s => ImageReference.fromString(s);
    if (expected.err) {
      expect(() => f(input)).toThrow(expected.err);
    } else {
      expect(f(input)).toEqual(expected);
    }
  });
});

[
  ['ubuntu'],
  ['ubuntu:18.04'],
  ['docker.io/library/ubuntu:18.04'],
  ['docker.io/library/ubuntu:18.04@sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
].forEach(([input]) => {
  test(`toString: ${input}`, () => {
    const ref = ImageReference.fromString(input);
    expect(ref.toString()).toEqual(input);
  });
});

[
  ['ubuntu', { output: 'ubuntu' }],
  ['ubuntu:18.04', { output: 'ubuntu' }],
  ['docker.io/library/ubuntu:18.04', { output: 'ubuntu' }],
].forEach(([input, expected]) => {
  test(`image: ${input}`, () => {
    const ref = ImageReference.fromString(input);
    expect(ref.image).toEqual(expected.output);
  });
});