export declare type ServiceKey<T> = keyof T;
export default interface Container<T> {
    get<K extends ServiceKey<T>>(key: K): T[K];
    has<K extends ServiceKey<T>>(key: K): boolean;
}
