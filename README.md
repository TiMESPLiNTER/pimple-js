# pimple-js

Based on the work of

* M.PARAISO <mparaiso@online.fr>
* SerafimArts <nesk@xakep.ru>

and the original PHP Pimple container by Fabien Potencier.

## Usage

```ts
import Pimple from '@timesplinter/pimple';

type ServiceMap = {
   'foo': string, 
   'bar': string,
};

const container: Container = new Pimple<ServiceMap>({env: 'dev'});

container.set('foo', () => {
    return `baz (${container.get('env')})`;
});

container.set('bar', (container: Pimple<ServiceMap>) => {
    return `bar: ${container.get('foo')}`;
});

console.log(container.get('foo')); // 'bar (dev)';
```

## Transpiling
```bash
$ npm run transpile
```

## Tests
```bash
$ npm run test     # runs tests
$ npm run coverage # runs coverage
```
