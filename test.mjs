import fromAsync from './index.mjs';

import test from 'tape-promise/tape.js';

test('creates promise', async t => {
  const outputPromise = fromAsync([]);
  t.equal(outputPromise.constructor, Promise);
});

test('creates new array in promise', async t => {
  const expected = [ 0, 1, 2 ];
  const input = expected.values();
  const output = await fromAsync(input);
  t.equal(output.constructor, Array);
  t.notEqual(output, expected);
});

test('creates new array-like in promise', async t => {
  class C {}

  const input = [ 0, 1, 2 ];
  const output = await fromAsync.call(C, input);
  t.equal(output.constructor, C);
  t.equal(output.length, 3);
  t.equal(output[0], 0);
  t.equal(output[1], 1);
  t.equal(output[2], 2);
  t.equal(output[3], undefined);
});

test('arraylike constructor is given no arg for iterable inputs', async t => {
  let initialLength;

  class C {
    constructor (arg0) {
      initialLength = arg0;
    }
  }

  const input = [ 0, 1, 2 ];
  await fromAsync.call(C, input);
  t.equal(initialLength, undefined);
});

test('creates array if dynamic-this is not constructor', async t => {
  const expected = [ 0, 1, 2 ];
  const arrowFn = () => {};
  const output = await fromAsync.call(arrowFn, expected);
  t.equal(output.constructor, Array);
  t.deepEqual(output, expected);
});

test('does not resort to creating array if constructor throws', async t => {
  class SpecialError extends Error {}

  class C {
    constructor () {
      throw new SpecialError;
    }
  }

  const input = [ 0, 1, 2 ];
  const outputPromise = fromAsync.call(C, input);
  await t.rejects(outputPromise, SpecialError);
});

test('sync-iterable input with no promises', async t => {
  t.test('is dumped', async t => {
    const expected = [ 0, 1, 2 ];
    const input = [ 0, 1, 2 ].values();
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('sync mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = [ 0, 1, 2 ].values();
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = [ 0, 1, 2 ].values();
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });
  });

  t.test('async mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = [ 0, 1, 2 ].values();
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = [ 0, 1, 2 ].values();
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });
  });
});

test('sync-iterable input with thenables', async t => {
  t.test('is dumped', async t => {
    const expected = [ 0, 1, 2 ];
    const input = [ 0, Promise.resolve(1), Promise.resolve(2) ].values();
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('works with non-promise thenables', async t => {
    const expectedValue = {};
    const expected = [ expectedValue ];
    const inputThenable = {
      then (resolve, reject) {
        resolve(expectedValue);
      },
    };
    const input = [ inputThenable ].values();
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('awaits each input value once without mapping callback', async t => {
    const expectedValue = {};
    const expected = [ expectedValue ];
    let awaitCounter = 0;
    const inputThenable = {
      then (resolve, reject) {
        awaitCounter ++;
        resolve(expectedValue);
      },
    };
    const input = [ inputThenable ].values();
    await fromAsync(input);
    t.is(awaitCounter, 1);
  });

  t.test('sync mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = [ 0, Promise.resolve(1), Promise.resolve(2) ].values();
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = [ 0, Promise.resolve(1), Promise.resolve(2) ].values();
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });

    t.test('awaits each input value once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      let awaitCounter = 0;
      const inputThenable = {
        then (resolve, reject) {
          awaitCounter ++;
          resolve(expectedValue);
        },
      };
      const input = [ inputThenable ].values();
      await fromAsync(input, v => v);
      t.is(awaitCounter, 1);
    });
  });

  t.test('async mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = [ 0, Promise.resolve(1), Promise.resolve(2) ].values();
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = [ 0, Promise.resolve(1), Promise.resolve(2) ].values();
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });

    t.test('awaits each input value once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      let awaitCounter = 0;
      const inputThenable = {
        then (resolve, reject) {
          awaitCounter ++;
          resolve(expectedValue);
        },
      };
      const input = [ inputThenable ].values();
      await fromAsync(input, v => v);
      t.is(awaitCounter, 1);
    });

    t.test('awaits each callback result once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      const input = [ 0, 1, 2 ].values();

      let awaitCounter = 0;

      await fromAsync(input, v => {
        return {
          // This “then” method should occur three times:
          // one for each value from the input.
          then (resolve, reject) {
            awaitCounter ++;
            resolve(v);
          },
        };
      });
      t.is(awaitCounter, 3);
    });
  });
});

test('non-iterable arraylike with no promises', async t => {
  t.test('is dumped', async t => {
    const expected = [ 0, 1, 2 ];
    const input = {
      length: 3,
      0: 0,
      1: 1,
      2: 2,
      3: 3, // This is ignored because the length is 3.
    };
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('sync mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: 1,
        2: 2,
        3: 3, // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: 1,
        2: 2,
        3: 3, // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });
  });

  t.test('async mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: 1,
        2: 2,
        3: 3, // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: 1,
        2: 2,
        3: 3, // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });
  });
});

test('non-iterable arraylike with thenables', async t => {
  t.test('is dumped', async t => {
    const expected = [ 0, 1, 2 ];
    const input = {
      length: 3,
      0: 0,
      1: Promise.resolve(1),
      2: Promise.resolve(2),
      3: Promise.resolve(3), // This is ignored because the length is 3.
    };
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('works with non-promise thenables', async t => {
    const expectedValue = {};
    const expected = [ expectedValue ];
    const inputThenable = {
      then (resolve, reject) {
        resolve(expectedValue);
      },
    };
    const input = {
      length: 1,
      0: inputThenable,
    };
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('awaits each input value once without mapping callback', async t => {
    const expectedValue = {};
    const expected = [ expectedValue ];
    let awaitCounter = 0;
    const inputThenable = {
      then (resolve, reject) {
        awaitCounter ++;
        resolve(expectedValue);
      },
    };
    const input = {
      length: 1,
      0: inputThenable,
    };
    await fromAsync(input);
    t.is(awaitCounter, 1);
  });

  t.test('sync mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: Promise.resolve(1),
        2: Promise.resolve(2),
        3: Promise.resolve(3), // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: Promise.resolve(1),
        2: Promise.resolve(2),
        3: Promise.resolve(3), // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });

    t.test('awaits each input value once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      let awaitCounter = 0;
      const inputThenable = {
        then (resolve, reject) {
          awaitCounter ++;
          resolve(expectedValue);
        },
      };
      const input = {
        length: 1,
        0: inputThenable,
      };
      await fromAsync(input, v => v);
      t.is(awaitCounter, 1);
    });
  });

  t.test('async mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, undefined ],
        [ 2, undefined ],
        [ 4, undefined ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: Promise.resolve(1),
        2: Promise.resolve(2),
        3: Promise.resolve(3), // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, thisValue ],
        [ 2, thisValue ],
        [ 4, thisValue ],
      ];
      const input = {
        length: 3,
        0: 0,
        1: Promise.resolve(1),
        2: Promise.resolve(2),
        3: Promise.resolve(3), // This is ignored because the length is 3.
      };
      const output = await fromAsync(input, async function (v) {
        return [ v * 2, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });

    t.test('awaits each input value once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      let awaitCounter = 0;
      const inputThenable = {
        then (resolve, reject) {
          awaitCounter ++;
          resolve(expectedValue);
        },
      };
      const input = {
        length: 1,
        0: inputThenable,
      };
      await fromAsync(input, v => v);
      t.is(awaitCounter, 1);
    });

    t.test('awaits each callback result once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];
      const input = {
        length: 3,
        0: 0,
        1: Promise.resolve(1),
        2: Promise.resolve(2),
        3: Promise.resolve(3), // This is ignored because the length is 3.
      };

      let awaitCounter = 0;

      await fromAsync(input, v => {
        return {
          // This “then” method should occur three times:
          // one for each value from the input.
          then (resolve, reject) {
            awaitCounter ++;
            resolve(v);
          },
        };
      });
      t.is(awaitCounter, 3);
    });
  });
});

test('async-iterable input', async t => {
  t.test('is dumped', async t => {
    const expected = [ 0, 1, 2 ];

    async function* generateInput () {
      yield* expected;
    }

    const input = generateInput();
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('does not await input values', async t => {
    const prom = Promise.resolve({});
    const expected = [ prom ];

    function createInput () {
      return {
        // The following async iterator will yield one value
        // (the promise named “prom”).
        [Symbol.asyncIterator]() {
          let i = 0;
          return {
            async next() {
              if (i > 0) {
                return { done: true };
              }
              i++;
              return { value: prom, done: false }
            },
          };
        },
      };
    }

    const input = createInput();
    const output = await fromAsync(input);
    t.deepEqual(output, expected);
  });

  t.test('sync mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, 0, undefined ],
        [ 2, 1, undefined ],
        [ 4, 2, undefined ],
      ];

      async function* generateInput () {
        yield* [ 0, 1, 2 ];
      }

      const input = generateInput();
      const output = await fromAsync(input, function (v, i) {
        return [ v * 2, i, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, 0, thisValue ],
        [ 2, 1, thisValue ],
        [ 4, 2, thisValue ],
      ];

      async function* generateInput () {
        yield* [ 0, 1, 2 ];
      }

      const input = generateInput();
      const output = await fromAsync(input, function (v, i) {
        return [ v * 2, i, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });
  });

  t.test('async mapped', async t => {
    t.test('with default undefined this', async t => {
      const expected = [
        [ 0, 0, undefined ],
        [ 2, 1, undefined ],
        [ 4, 2, undefined ],
      ];

      async function* generateInput () {
        yield* [ 0, 1, 2 ];
      }

      const input = generateInput();
      const output = await fromAsync(input, async function (v, i) {
        return [ v * 2, i, this ];
      });
      t.deepEqual(output, expected);
    });

    t.test('with given this', async t => {
      const thisValue = {};
      const expected = [
        [ 0, 0, thisValue ],
        [ 2, 1, thisValue ],
        [ 4, 2, thisValue ],
      ];

      async function* generateInput () {
        yield* [ 0, 1, 2 ];
      }

      const input = generateInput();
      const output = await fromAsync(input, async function (v, i) {
        return [ v * 2, i, this ];
      }, thisValue);
      t.deepEqual(output, expected);
    });

    t.test('awaits each callback result once', async t => {
      const expectedValue = {};
      const expected = [ expectedValue ];

      async function* generateInput () {
        yield* [ 0, 1, 2 ];
      }

      const input = generateInput();

      let awaitCounter = 0;

      await fromAsync(input, v => {
        return {
          // This “then” method should occur three times:
          // one for each value from the input.
          then (resolve, reject) {
            awaitCounter ++;
            resolve(v);
          },
        };
      });

      t.is(awaitCounter, 3);
    });
  });
});
