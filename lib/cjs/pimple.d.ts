import ServiceProvider from "./serviceProvider";
/** Declaration types */
declare type ServiceDeclaration = Function | Object;
declare type ProviderDeclaration = Function | ServiceProvider;
/**
 * Pimple dependency injection container
 *
 * @copyright 2011 M.PARAISO <mparaiso@online.fr>
 * @copyright 2016 SerafimArts <nesk@xakep.ru>
 * @copyright 2021 TiMESPLiNTER <dev@timesplinter.ch>
 * @license LGPL
 * @version 3.0.0
 */
export default class Pimple {
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
    constructor(services?: {
        [key: string]: any;
    });
    /**
     * Define a service
     */
    set(name: string, service: ServiceDeclaration): Pimple;
    /**
     * Register a factory
     */
    factory(name: string, callback: Function): Pimple;
    /**
     * Get a service instance
     */
    get(name: string): any;
    /**
     * Register a protected function
     */
    protect(service: Function): Function;
    /**
     * Extend a service
     */
    extend(serviceName: string, service: Function): Function;
    /**
     * Get a service raw definition
     */
    raw(name: string): Function;
    /**
     * Register a service provider
     */
    register(provider: ProviderDeclaration): Pimple;
    private instanceOfServiceProvider;
}
export {};
