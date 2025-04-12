export class EmailAlreadyExists extends Error {
    constructor() {
        super("Email Already Exists")
    }
}