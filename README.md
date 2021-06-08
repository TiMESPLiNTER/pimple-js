# pimple-js

Based on the work of

* M.PARAISO <mparaiso@online.fr>
* SerafimArts <nesk@xakep.ru>

and the original PHP Pimple container by Fabien Potencier.

## Usage

```js
import Pimple from './pimple';

const container: Pimple = new Pimple({env: 'dev'});

container.set('foo', (container: Pimple) => {
    return `bar (${container.get('env')})`;
});

console.log(container.get('foo')); // 'bar (dev)';
```

## Compile/transpile
```bash
$ npm run compile
```

## Tests
```bash
$ npm run test     # runs tests
$ npm run coverage # runs coverage
```
