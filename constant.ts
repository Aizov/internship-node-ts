
let dbData = {
    user: 'user',
    host: 'localhost',
    database: 'user',
    password: '',
    port: 5432,
}

let tables = [
    {
        tablename: 'Cashiers',
        fields: {
            id: 'integer',
            name: 'varchar',
            surname: 'varchar',
            age: 'int'
        }
    },
    {
        tablename: 'Shops',
        fields: {
            id: 'integer',
            name: 'varchar',
            address: 'varchar'
        }
    },
    {
        tablename: 'CashRegisters',
        fields: {
            id: 'integer',
            number: 'integer',
            shop: 'integer',
            cashier: 'integer',
            date: 'date',
            timework: 'integer'
        }
    }
]


let shopsData = [
    {id: 1, name: 'ATB', address: 'Shevchenka 100',},
    {id: 2, name: 'Vilma', address: 'DJjjdjj2',},
    {id: 3, name: 'Fora', address: 'Foravulica',},
    {id: 4, name: 'Silpo', address: 'Silpoooooo',},
    {id: 5, name: 'Arsen', address: 'Chenava 99',}
]

let cashiersData = [
    {
        id: 1, name: 'Ivan', surname: 'Surname', age: 23,
        ExpShop_1: 3,
        ExpShop_2: 3,
    },
    {
        id: 2, name: 'Andrei', surname: 'Serend', age: 41,
        ExpShop_2: 3,
        ExpShop_5: 2,
        ExpShop_4: 1,
    },
    {
        id: 3, name: 'Andreddddi', surname: 'Serxxxend', age: 35,
        ExpShop_1: 4,
        ExpShop_3: 1,
    },
    {
        id: 3, name: 'Mikola', surname: 'Mill', age: 32,
        ExpShop_1: 4,
        ExpShop_5: 2,
        ExpShop_4: 4,
    },
    {
        id: 3, name: 'Mikola', surname: 'Mill', age: 32,
        ExpShop_1: 4,
        ExpShop_2: 2,
        ExpShop_4: 4,
        ExpShop_5: 4,

    }
]

export {tables, shopsData, cashiersData, dbData}
