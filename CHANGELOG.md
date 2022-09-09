# array-from-async changelog

## v3.0.0 (2022-09-08)
Added support for non-iterable arraylike objects – objects that have a length
property and element properties, like `{ length: 2, 0: 'x', 1: 'y' }`.

Also made the package not be affected by mutation of `globalThis.Array` or
`globalThis.Symbol`. This is a breaking change, but mutation of `globalThis` is
bad practice anyway.

This makes the package up to date with the specification as of 2022-09-08. Many
tests were also added, and several developer dependencies were upgraded (the
package itself still has no dependencies).

## v2.0.3 (2021-12-17)
Community-health files `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` were added.
`package.json`’s `LICENSE.md` was reverted back to the correct BSD-3-Clause.

## v2.0.2 (2021-12-17)
Fixed repository links in `package.json` and added back `.editorconfig`.

## v2.0.1 (2021-12-17)
The library was split out into its own repository from an NPM workspace in
tc39/proposals-array-from-async. This is to be able to maintain the library if
the proposal reaches Stage 4 (in which case the proposal repository would be
archived).

In addition, `package.json`’s version had not been updated and was fixed.

## v2.0.0 (2021-12-17)
The library was changed to be a standalone implementation that exports a single
default function and which does not monkey-patch the global Array constructor.

The license was also changed from MIT to BSD-3 in order to match the rest of
TC39’s code.

## v1.0.5 (2021-09-21)
The polyfill was updated to correctly throw a TypeError when its `this` receiver
is not a constructor.

## v1.0.0–1.0.4 (2021-09)
This was the original version. It was a polyfill that mutated the global Array
constructor. All subsequent patch versions were documentation changes.
