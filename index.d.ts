/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 */
declare function fromAsync<T>(items: AsyncIterable<T>): Promise<T[]>;
/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 */
declare function fromAsync<T>(
  items: Iterable<T> | ArrayLike<T>
): Promise<Awaited<T>[]>;

/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 *
 * @param mapfn
 * A function to call on every element of the array.
 * If provided, every value to be added to the array is first passed through this function,
 * and `mapFn`'s return value is added to the array instead awaited.
 */
declare function fromAsync<T, U>(
  items: AsyncIterable<T>,
  mapfn: (item: Awaited<T>, index: number) => U
): Promise<Awaited<U>[]>;
/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 *
 * @param mapfn
 * A function to call on every element of the array.
 * If provided, every value to be added to the array is first passed through this function,
 * and `mapFn`'s return value is added to the array instead awaited.
 */
declare function fromAsync<T, U>(
  items: Iterable<T> | ArrayLike<T>,
  mapfn: (item: Awaited<T>, index: number) => U
): Promise<Awaited<U>[]>;

/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 *
 * @param mapfn
 * A function to call on every element of the array.
 * If provided, every value to be added to the array is first passed through this function,
 * and `mapFn`'s return value is added to the array instead (after being awaited).
 *
 * @param thisArg
 * Value to use as `this` when executing `mapFn`.
 */
declare function fromAsync<T, U, ThisType>(
  items: AsyncIterable<T>,
  mapfn: (this: ThisType, item: T, index: number) => U,
  thisArg: ThisType
): Promise<Awaited<U>[]>;
/**
 * Creates a new, shallow-copied Array instance
 * from an async iterable, iterable, or array-like object.
 *
 * @param items
 * An async iterable, iterable, or array-like object to convert to an array.
 *
 * @param mapfn
 * A function to call on every element of the array.
 * If provided, every value to be added to the array is first passed through this function,
 * and `mapFn`'s return value is added to the array instead (after being awaited).
 *
 * @param thisArg
 * Value to use as `this` when executing `mapFn`.
 */
declare function fromAsync<T, U, ThisType>(
  items: Iterable<T> | ArrayLike<T>,
  mapfn: (this: ThisType, item: Awaited<T>, index: number) => U,
  thisArg: ThisType
): Promise<Awaited<U>[]>;

export default fromAsync;
