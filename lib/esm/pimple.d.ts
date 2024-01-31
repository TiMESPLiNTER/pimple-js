import Container, { ServiceKey } from "./container";
import ServiceProvider from "./serviceProvider";
/** Declaration types */
type ProviderDeclaration<T> = Function | ServiceProvider<T>;
type LazyServiceDefinition<T, S> = (container: Pimple<T>) => S;
type ProtectedServiceDefinition<T, S> = () => LazyServiceDefinition<T, S>;
type ServiceDefinition<T, S> = LazyServiceDefinition<T, S> | ProtectedServiceDefinition<T, S> | S;
type ServiceMap<T> = {
    [key in ServiceKey<T>]: ServiceDefinition<T, T[ServiceKey<T>]>;
};
/**
 * Pimple dependency injection container
 *
 * @copyright 2011 M.PARAISO <mparaiso@online.fr>
 * @copyright 2016 SerafimArts <nesk@xakep.ru>
 * @copyright 2021 TiMESPLiNTER <dev@timesplinter.ch>
 * @license LGPL
 * @version 3.0.0
 */
export default class Pimple<T> implements Container<T> {
    /**
     * @type {string}
     */
    static get VERSION(): string;
    /**
     * @type {{}}
     * @private
     */
    private _definitions;
    /**
     * @type {{}}
     * @private
     */
    private _raw;
    constructor(services?: Partial<ServiceMap<T>>);
    /**
     * Define a service
     */
    set<K extends ServiceKey<T>>(name: K, service: ServiceDefinition<T, T[K]>): Pimple<T>;
    /**
     * Register a factory
     */
    factory<K extends ServiceKey<T>>(name: K, callback: ServiceDefinition<T, T[K]>): Pimple<T>;
    /**
     * Get a service instance
     */
    get<K extends ServiceKey<T>>(name: K): T[K];
    /**
     * Checks whether a service is registered or not
     */
    has<K extends ServiceKey<T>>(name: K): boolean;
    /**
     * Register a protected function
     */
    protect<K extends ServiceKey<T>>(key: K, service: T[K]): () => T[K];
    /**
     * Extend a service
     */
    extend<K extends ServiceKey<T>>(serviceName: K, service: Function): Function;
    /**
     * Get a service raw definition
     */
    raw<K extends ServiceKey<T>>(name: K): ServiceDefinition<T, T[K]>;
    /**
     * Register a service provider
     */
    register(provider: ProviderDeclaration<T>): Pimple<T>;
    private instanceOfServiceProvider;
}
export {};
