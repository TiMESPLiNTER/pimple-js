export default interface Container {
    get(service: string): any;
    has(service: string): boolean;
}
