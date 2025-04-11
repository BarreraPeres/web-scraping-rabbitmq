import knexModule from "knex"
import knexFile from "./knexfile.mjs"

const knex = knexModule(knexFile);

class Db {
    constructor() {
        this.knex = knex
    }
}

export default Db;