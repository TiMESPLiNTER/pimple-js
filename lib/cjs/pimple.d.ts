import Container, { ServiceKey } from "./container";
import ServiceProvider from "./serviceProvider";
/** Declaration types */
type ServiceProviderFunction<T> = (container: Pimple<T>) => void;
type ProviderDeclaration<T> = ServiceProviderFunction<T> | ServiceProvider<T>;
type LazyServiceDefinition<T, S> = (container: Pimple<T>) => S;
type ProtectedServiceDefinition<T, S> = () => LazyServiceDefinition<T, S>;
type PlainServiceDefinition<S> = S extends Function ? () => S : S;
type ServiceDefinition<T, S> = PlainServiceDefinition<S> | LazyServiceDefinition<T, S> | ProtectedServiceDefinition<T, S>;
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
 * @version 2.1.0
 */
export default class Pimple<T> implements Container<T> {
    static get VERSION(): string;
    private _definitions;
    private _raw;
    private _resolved;
    private _resolving;
    constructor(services?: Partial<ServiceMap<T>>);
    /**
     * Define a service (first-time registration only)
     */
    set<K extends ServiceKey<T>>(name: K, service: ServiceDefinition<T, T[K]>): Pimple<T>;
    /**
     * Replace an existing service definition before it has been resolved
     */
    replace<K extends ServiceKey<T>>(name: K, service: ServiceDefinition<T, T[K]>): Pimple<T>;
    private define;
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
    protect<T extends Function>(func: T): () => T;
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
