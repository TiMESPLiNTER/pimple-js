"use strict";
/**
 * Reserved names of properties
 */
const reservedProperties = [
    'get', 'set', 'factory', 'raw',
    'protect', 'share', 'toString', 'constructor',
    'prototype'
];
/**
 * Pimple dependency injection container
 *
 * @copyright 2011 M.PARAISO <mparaiso@online.fr>
 * @copyright 2016 SerafimArts <nesk@xakep.ru>
 * @copyright 2021 TiMESPLiNTER <dev@timesplinter.ch>
 * @license LGPL
 * @version 2.1.0
 */
export default class Pimple {
    static get VERSION() { return '2.1.0'; }
    constructor(services = {}) {
        this._definitions = {};
        this._raw = {};
        this._resolved = new Map();
        this._resolving = [];
        Object.keys(services).forEach((service) => {
            const serviceKey = service;
            this.set(serviceKey, services[serviceKey]);
        }, this);
    }
    /**
     * Define a service (first-time registration only)
     */
    set(name, service) {
        if (this.has(name)) {
            throw new Error(`Service "${name.toString()}" is already defined. Use replace() to overwrite it.`);
        }
        return this.define(name, service);
    }
    /**
     * Replace an existing service definition before it has been resolved
     */
    replace(name, service) {
        var _a;
        if (!this.has(name)) {
            throw new RangeError(`Service "${name.toString()}" is not defined in the container.`);
        }
        if (this._resolved.has(name)) {
            const trace = [];
            let current = name;
            while (current !== null) {
                trace.unshift(current.toString());
                current = (_a = this._resolved.get(current)) !== null && _a !== void 0 ? _a : null;
            }
            throw new Error(`Service "${name.toString()}" has already been resolved and cannot be replaced. Resolution trace: ${trace.join(' → ')}`);
        }
        return this.define(name, service);
    }
    define(name, service) {
        this._raw[name] = service;
        this._definitions[name] = service instanceof Function ?
            (function () {
                let cached;
                return (pimple) => {
                    if (cached === undefined) {
                        cached = service(pimple);
                    }
                    return cached;
                };
            }()) : service;
        if (reservedProperties.indexOf(name.toString()) === -1) {
            Object.defineProperty(this, name, {
                configurable: true,
                get: () => {
                    return this.get(name);
                }
            });
        }
        return this;
    }
    /**
     * Register a factory
     */
    factory(name, callback) {
        this._raw[name] = callback;
        this._definitions[name] = callback;
        if (reservedProperties.indexOf(name.toString()) === -1) {
            Object.defineProperty(this, name, {
                configurable: true,
                get: () => {
                    return this.get(name);
                }
            });
        }
        return this;
    }
    /**
     * Get a service instance
     */
    get(name) {
        if (this._definitions[name] instanceof Function) {
            const firstResolution = !this._resolved.has(name);
            if (firstResolution) {
                const parent = this._resolving.length > 0 ? this._resolving[this._resolving.length - 1] : null;
                this._resolved.set(name, parent);
                this._resolving.push(name);
            }
            try {
                return this._definitions[name](this);
            }
            finally {
                if (firstResolution) {
                    this._resolving.pop();
                }
            }
        }
        return this._definitions[name];
    }
    /**
     * Checks whether a service is registered or not
     */
    has(name) {
        return name in this._definitions;
    }
    /**
     * Register a protected function
     */
    protect(func) {
        return () => func;
    }
    /**
     * Extend a service
     */
    extend(serviceName, service) {
        if (!this._definitions[serviceName]) {
            throw new RangeError(`Definition with "${serviceName.toString()}" not defined in container.`);
        }
        let def = this._definitions[serviceName];
        return this._definitions[serviceName] = (container) => {
            if (def instanceof Function) {
                def = def(container);
            }
            return service(def, container);
        };
    }
    /**
     * Get a service raw definition
     */
    raw(name) {
        return this._raw[name];
    }
    /**
     * Register a service provider
     */
    register(provider) {
        if (this.instanceOfServiceProvider(provider) && provider.register instanceof Function) {
            provider.register(this);
        }
        else if (provider instanceof Function) {
            provider(this);
        }
        return this;
    }
    instanceOfServiceProvider(object) {
        return 'register' in object;
    }
}
//# sourceMappingURL=pimple.js.map