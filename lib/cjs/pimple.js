"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
 * @version 3.0.0
 */
class Pimple {
    constructor(services = {}) {
        /**
         * @type {{}}
         * @private
         */
        this._definitions = {};
        /**
         * @type {{}}
         * @private
         */
        this._raw = {};
        Object.keys(services).forEach((service) => {
            this.set(service, services[service]);
        }, this);
    }
    /**
     * @type {string}
     */
    static get VERSION() { return '3.0.0'; }
    /**
     * Define a service
     */
    set(name, service) {
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
        if (reservedProperties.indexOf(name) === -1) {
            Object.defineProperty(this, name, {
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
        if (reservedProperties.indexOf(name) === -1) {
            Object.defineProperty(this, name, {
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
            return this._definitions[name](this);
        }
        return this._definitions[name];
    }
    /**
     * Register a protected function
     */
    protect(service) {
        return () => {
            return service;
        };
    }
    /**
     * Extend a service
     */
    extend(serviceName, service) {
        if (!this._definitions[serviceName]) {
            throw new RangeError(`Definition with "${serviceName}" not defined in container.`);
        }
        var def = this._definitions[serviceName];
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
            return this;
        }
        if (provider instanceof Function) {
            provider(this);
            return this;
        }
        return this;
    }
    instanceOfServiceProvider(object) {
        return 'register' in object;
    }
}
exports.default = Pimple;
//# sourceMappingURL=pimple.js.map