
# mongo-minify

  Minifies a given MongoDB update query based on fields restrictions
  (inclusion or exclusion).

## Example

```js
var minify = require('mongo-minify');

minify({ $set: { a: 'b' }, $push: { 'c': 'd' } }, { a: 0 });
// { $push: { c: 'd' } }

minify({ $push: { c: 'd', e: 'f' }, $unset: { h: 1 } }, { e: 1 });
// { $push: { e: 'f' } }

minify({ $set: { 'name.first': 'Guillermo', age: 50 } }, { name: 1 });
// { $set: { 'name.first': 'Guillermo' } }
```

## API

### minify(query[, restrictions])

  `query` is any `update` or `findAndModify` query passed to MongoDB.

  `restrictions` is the fields selection format used with `find*`.
