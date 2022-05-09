import ServiceProvider from './serviceProvider';

export default interface Container 
{
    get<T>(service: string): T;

    has(service: string): boolean;
}
