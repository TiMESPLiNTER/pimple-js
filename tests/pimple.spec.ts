import Pimple from '../src/pimple';
import {ServiceProvider} from "../src/index.js";
import {describe, expect, it} from "@jest/globals";

describe('pimple container', () => {
    it('returns container version', async () => {
        expect(Pimple.VERSION).toBe('2.1.0');
    });

    it('stores values', async () => {
        type ServiceMap = {
            'baz': number,
            'foo': string,
        };

        const container = new Pimple<ServiceMap>({baz: 42});

        container.set('foo', 'bar');

        expect(container.get('foo')).toBe('bar');
        expect(container.get('baz')).toBe(42);
    });

    it('resolves function', async () => {
        type ServiceMap = {
            'baz': number,
            'foo': string,
        };

        const container = new Pimple<ServiceMap>();

        container.set('foo', () => {
            return 'baz';
        });

        expect(container.get('foo')).toBe('baz');
    });

    it('resolves function only once', async () => {
        type ServiceMap = {
            'foo': number,
        };

        const container = new Pimple<ServiceMap>();

        container.set('foo', () => {
            return Math.random();
        });

        expect(container.get('foo')).toBe(container.get('foo'));
    });

    it('returns true if service exists', async () => {
        type ServiceMap = {
            'foo': number,
        };

        const container = new Pimple<ServiceMap>();

        container.set('foo', () => {
            return 42;
        });

        expect(container.has('foo')).toBe(true);
    });

    it('returns true if service exists', async () => {
        type ServiceMap = {
            'foo': number,
        };

        const container = new Pimple<ServiceMap>();

        expect(container.has('foo')).toBe(false);
    });

    it('protects function', async () => {
        type ServiceMap = {
            foo: () => string,
            baz: () => string,
            untyped: Function,
        };

        const container = new Pimple<ServiceMap>();

        const typeProtectedFunction = () => 'baz';
        const untypedProtectedFunction = () => 42;

        container.set('foo', container.protect(typeProtectedFunction));
        container.set('baz', () => typeProtectedFunction);
        container.set('untyped', container.protect(untypedProtectedFunction));

        expect(container.get('foo')).toBe(typeProtectedFunction);
        expect(container.get('baz')).toBe(typeProtectedFunction);
        expect(container.get('untyped')).toBe(untypedProtectedFunction);
    });

    it('returns original function', async () => {
        type ServiceMap = {
            foo: string,
        };

        const container = new Pimple<ServiceMap>();

        const protectedFunction = () => {
            return 'baz';
        };

        container.set('foo', protectedFunction);

        expect(container.raw('foo')).toBe(protectedFunction);
    });

    it('registers services defined in service provider', async () => {
        type ServiceMap = {
            'foo': string,
        }

        const container = new Pimple<ServiceMap>();

        const serviceProviderMock: ServiceProvider<ServiceMap> = {
            register: (container: Pimple<ServiceMap>) => {
                container.set('foo', () => {
                    return 'baz'
                });
            },
        };

        container.register(serviceProviderMock);

        expect(container.get('foo')).toBe('baz');
    });

    it('registers services defined in function', async () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();

        const serviceProviderMock = (container: Pimple<ServiceMap>) => {
            container.set('foo', () => {
                return 'baz'
            });
        };

        container.register(serviceProviderMock);

        expect(container.get('foo')).toBe('baz');
    });

    it('returns new instance from factory', async () => {
        type ServiceMap = {
            foo: number,
        }

        const container = new Pimple<ServiceMap>();

        container.factory('foo', () => {
            return Math.random();
        });

        expect(container.get('foo')).not.toBe(container.get('foo'));
    });

    it('throws exception on extending an undefined service', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();

        expect(() => {
            container.extend('foo', () => {});
        }).toThrow('Definition with "foo" not defined in container.');
    });

    it('throws when calling set on an already defined service', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();
        container.set('foo', () => 'first');

        expect(() => {
            container.set('foo', () => 'second');
        }).toThrow('Service "foo" is already defined. Use replace() to overwrite it.');
    });

    it('replaces a service before it is resolved', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();
        container.set('foo', () => 'original');
        container.replace('foo', () => 'replaced');

        expect(container.get('foo')).toBe('replaced');
    });

    it('throws when replacing a service that has already been resolved', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();
        container.set('foo', () => 'original');
        container.get('foo');

        expect(() => {
            container.replace('foo', () => 'replaced');
        }).toThrow('Service "foo" has already been resolved and cannot be replaced.');
    });

    it('throws when replacing a service that is not defined', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>();

        expect(() => {
            container.replace('foo', () => 'replaced');
        }).toThrow('Service "foo" is not defined in the container.');
    });

    it('extends service', () => {
        type ServiceMap = {
            foo: string,
        }

        const container = new Pimple<ServiceMap>({
            foo: () => {
                return 'baz';
            }
        });

        container.extend('foo', (initialService: string, container: Pimple<ServiceMap>) => {
            return initialService + 'bar';
        });

        expect(container.get('foo')).toBe('bazbar');
    });
});
