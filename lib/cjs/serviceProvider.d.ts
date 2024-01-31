import Pimple from "./pimple";
/**
 * Service provider class for service injecting in Pimple container
 */
export default interface ServiceProvider<T> {
    register(container: Pimple<T>): void;
}
