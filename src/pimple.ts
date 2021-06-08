"use strict";

import Container from "./container";
import ServiceProvider from "./serviceProvider";

/** Declaration types */
type ServiceDeclaration  = Function|Object;
type ProviderDeclaration = Function|ServiceProvider;

/**
 * Reserved names of properties
 */
const reservedProperties: string[] = [
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
export default class Pimple implements Container
{
    /**
     * @type {string}
     */
    static get VERSION() { return '3.0.0'; }

    /**
     * @type {{}}
     * @private
     */
    private _definitions: { [key: string]: any; } = {};

    /**
     * @type {{}}
     * @private
     */
    private _raw: { [key: string]: any; } = {};

    constructor(services: { [key: string]: any; } = {}) {
        Object.keys(services).forEach((service) => {
            this.set(service, services[service]);
        }, this);
    }

    /**
     * Define a service
     */
    public set(name: string, service: ServiceDeclaration): Pimple
    {
        this._raw[name] = service;

        this._definitions[name] = service instanceof Function ?
            (function () {
                let cached: any;
                return (pimple: Pimple) => {
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
    public factory(name: string, callback: Function): Pimple {
        this._raw[name]         = callback;
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
    public get(name: string): any {
        if (this._definitions[name] instanceof Function) {
            return this._definitions[name](this);
        }
        return this._definitions[name];
    }

    /**
     * Checks whether a service is registered or not
     */
    public has(service: string): boolean {
        return service in this._definitions;
    }

    /**
     * Register a protected function
     */
    public protect(service: Function): Function {
        return () => {
            return service;
        };
    }

    /**
     * Extend a service
     */
    public extend(serviceName: string, service: Function): Function {
        if (!this._definitions[serviceName]) {
            throw new RangeError(`Definition with "${serviceName}" not defined in container.`);
        }

        var def = this._definitions[serviceName];

        return this._definitions[serviceName] = (container: Pimple) => {
            if (def instanceof Function) {
                def = def(container);
            }
            return service(def, container);
        };
    }

    /**
     * Get a service raw definition
     */
    public raw(name: string): Function {
        return this._raw[name];
    }

    /**
     * Register a service provider
     */
    public register(provider: ProviderDeclaration): Pimple {
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

    private instanceOfServiceProvider(object: any): object is ServiceProvider {
        return 'register' in object;
    }
}
