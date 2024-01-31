import Pimple from "./pimple.js";
import ServiceProvider from "./serviceProvider.js";

type ServiceMap = {
    'foo.factory': string,
    'bar': number,
    43: number
}

class TestServiceProvider implements ServiceProvider<ServiceMap>
{
    register(container: Pimple<ServiceMap>): void {
        container.get('bar')
    }

}

const pimple = new Pimple<ServiceMap>();

pimple.set('bar', (): number => {
    return 42;
})

pimple.set('bar', 42);

pimple.set('foo.factory', () => 'hello world')

const bar = pimple.get('bar');
console.log(typeof bar, bar);
