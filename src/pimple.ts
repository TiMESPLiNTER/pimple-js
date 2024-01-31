"use strict";

import Container, {ServiceKey} from "./container";
import ServiceProvider from "./serviceProvider";

/** Declaration types */
type ProviderDeclaration<T> = (container: Pimple<T>) => void|ServiceProvider<T>;
type LazyServiceDefinition<T, S> = (container: Pimple<T>) => S;
type ProtectedServiceDefinition<T, S> = () => LazyServiceDefinition<T, S>;
type ServiceDefinition<T, S> = LazyServiceDefinition<T, S>|ProtectedServiceDefinition<T, S>|S;
type ServiceMap<T> = { [key in ServiceKey<T>]: ServiceDefinition<T, T[ServiceKey<T>]> };

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
export default class Pimple<T> implements Container<T>
{
    /**
     * @type {string}
     */
    static get VERSION() { return '3.0.0'; }

    /**
     * @type {{}}
     * @private
     */
    private _definitions: Partial<ServiceMap<T>> = {};

    /**
     * @type {{}}
     * @private
     */
    private _raw: Partial<ServiceMap<T>> = {};

    constructor(services: Partial<ServiceMap<T>> = {}) {
        Object.keys(services).forEach((service) => {
            const serviceKey = service as ServiceKey<T>;
            this.set(serviceKey, services[serviceKey] as T[ServiceKey<T>]);
        }, this);
    }

    /**
     * Define a service
     */
    public set<K extends ServiceKey<T>>(name: K, service: ServiceDefinition<T,T[K]>): Pimple<T>
    {
        this._raw[name] = service;

        this._definitions[name] = service instanceof Function ?
            (function () {
                let cached: any;
                return (pimple: Pimple<T>) => {
                    if (cached === undefined) {
                        cached = service(pimple);
                    }
                    return cached;
                };
            }()) : service;

        if (reservedProperties.indexOf(name.toString()) === -1) {
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
    public factory<K extends ServiceKey<T>>(name: K, callback: ServiceDefinition<T,T[K]>): Pimple<T> {
        this._raw[name]         = callback;
        this._definitions[name] = callback;

        if (reservedProperties.indexOf(name.toString()) === -1) {
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
    public get<K extends ServiceKey<T>>(name: K): T[K] {
        if (this._definitions[name] instanceof Function) {
            return (this._definitions[name] as LazyServiceDefinition<T, T[K]>)(this);
        }
        return this._definitions[name] as T[K];
    }

    /**
     * Checks whether a service is registered or not
     */
    public has<K extends ServiceKey<T>>(name: K): boolean {
        return name in this._definitions;
    }

    /**
     * Register a protected function
     */
    public protect<K extends ServiceKey<T>>(key: K, service: T[K]): () => T[K] {
        return () => service;
    }

    /**
     * Extend a service
     */
    public extend<K extends ServiceKey<T>>(serviceName: K, service: Function): Function {
        if (!this._definitions[serviceName]) {
            throw new RangeError(`Definition with "${serviceName.toString()}" not defined in container.`);
        }

        let def = this._definitions[serviceName];

        return this._definitions[serviceName] = (container: Pimple<T>) => {
            if (def instanceof Function) {
                def = def(container);
            }
            return service(def, container);
        };
    }

    /**
     * Get a service raw definition
     */
    public raw<K extends ServiceKey<T>>(name: K): ServiceDefinition<T, T[K]> {
        if (!this._raw[name]) {
            throw new RangeError();
        }

        return this._raw[name] as ServiceDefinition<T, T[K]>;
    }

    /**
     * Register a service provider
     */
    public register(provider: ProviderDeclaration<T>): Pimple<T> {
        if (this.instanceOfServiceProvider(provider) && provider.register instanceof Function) {
            provider.register(this);
        } else {
            provider(this);
        }

        return this;
    }

    private instanceOfServiceProvider(object: any): object is ServiceProvider<T> {
        return 'register' in object;
    }
}
