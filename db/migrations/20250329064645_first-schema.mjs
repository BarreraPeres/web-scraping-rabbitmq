

export const up = async (knex) => {
    return knex.raw(`
    CREATE TYPE user_role AS ENUM ('admin', 'user');

    CREATE TABLE users (
        id uuid not null
        constraint pk_users primary key
        default (gen_random_uuid()),

        name text not null,
        
        email text not null 
            constraint uq_users_email unique,

        password text not null,

        role user_role not null
            constraint df_users_role default ('user'),

        utc_created_on timestamp not null
            constraint df_users_utc_created_on
            default (now())
    );
    CREATE TABLE products (
        id uuid not null
            constraint pk_products primary key
            default (gen_random_uuid()),

        url text not null UNIQUE,
        name text not null,

        utc_created_on timestamp not null
        constraint df_products_utc_created_on
        default (now())
    );
    CREATE TABLE prices (
        id uuid not null
            constraint pk_prices primary key
            default (gen_random_uuid()),

        product_id uuid not null
            constraint fk_prices_products
            references products(id),

        price int not null,

        utc_created_on timestamp not null
            constraint df_prices_utc_created_on
            default (now())
    );    
    `)
};

export const down = async (knex) => {
    return knex.raw(`
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS prices;
        DROP TABLE IF EXISTS products;
        
        DROP TYPE IF EXISTS user_role;
      `)

};
