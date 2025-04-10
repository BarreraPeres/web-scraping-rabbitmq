export class ResourceNotFound extends Error {
    constructor(message) {
        super(`${message}`);
    }
}