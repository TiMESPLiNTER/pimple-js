import Pimple from '../src/pimple';

describe('pimple container', () => {
    it('returns container verison', async () => {
        expect(Pimple.VERSION).toBe('3.0.0');
    });

    it('stores values', async () => {
        const container = new Pimple({baz: 42});

        container.set('foo', 'bar');

        expect(container.get('foo')).toBe('bar');
        expect(container.get('baz')).toBe(42);
    });

    it('resolves function', async () => {
        const container = new Pimple();

        container.set('foo', () => {
            return 'baz';
        });

        expect(container.get('foo')).toBe('baz');
    });

    it('protects function', async () => {
        const container = new Pimple();

        const protectedFunciton = () => {
            return 'baz';
        };

        container.set('foo', container.protect(protectedFunciton));

        expect(container.get('foo')).toBe(protectedFunciton);
    });

    it('returns original function', async () => {
        const container = new Pimple();

        const protectedFunciton = () => {
            return 'baz';
        };

        container.set('foo', protectedFunciton);

        expect(container.raw('foo')).toBe(protectedFunciton);
    });

    it('registers services defined in service provider', async () => {
        const container = new Pimple();

        const serviceProviderMock = {
            register: (container: Pimple) => {
                container.set('foo', () => {
                    return 'baz'
                });
            },
        };

        container.register(serviceProviderMock);

        expect(container.get('foo')).toBe('baz');
    });

    it('registers services defined in function', async () => {
        const container = new Pimple();

        const serviceProviderMock = (container: Pimple) => {
            container.set('foo', () => {
                return 'baz'
            });
        };

        container.register(serviceProviderMock);

        expect(container.get('foo')).toBe('baz');
    });

    it('returns new instance from factory', async () => {
        const container = new Pimple();

        container.factory('foo', () => {
            return Math.random();
        });

        expect(container.get('foo')).not.toBe(container.get('foo'));
    });

    it('throws exception on extending an undefined service', () => {
        const container = new Pimple();

        expect(() => {
            container.extend('foo', () => {});
        }).toThrow('Definition with "foo" not defined in container.');
    });

    it('extends service', () => {
        const container = new Pimple({
            foo: () => {
                return 'baz';
            }
        });

        container.extend('foo', (initialService: string, container: Pimple) => {
            return initialService + 'bar';
        });

        expect(container.get('foo')).toBe('bazbar');
    });
});
