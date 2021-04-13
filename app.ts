

import {Client, Pool} from "pg";
interface ShopInterface {
    id: bigint,
    name: string,
    address: string
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
            date: 'date',
            timework: 'integer'
        }
    }
]

class App {
    private client: Pool
    private connected: boolean | undefined;

    constructor(user: string,
                host: string,
                database: string,
                password: string,
                port: number)
    {
        this.client = new Pool({
            user, host, database, password, port,
        })
        this.client.connect().then(async r => {
            console.log('created connection')
            this.connected = true
            await this.checkTables()


        }).catch(e => console.error(e))

    }
    async dbQuery(query: string, cb: any) {
        await this.client.query(query, (err, res) => {
            cb(res)
            // this.client.end().then(err => console.log('connection close'))
        })


    }




    async deleteTables (){
        for (let i = tables.length-1; i > -1; i--){
                // tables[i].tablename
            let query = `DROP TABLE ${tables[i].tablename};`
            console.log(query)
            await app.dbQuery(query, async (res: any) => {
                console.log(res)
            })
        }

    }
    async checkTables (){


        let shopsData = [
            {
                id: 1, name: 'ATB', address: 'Vulicya 54',
            },
            {
                id: 2, name: 'Vilma', address: 'DJjjdjj2',
            },
            {
                id: 3, name: 'Fora', address: 'Foravulica',
            }
        ]

        let cashiersData = [
            {
                id: 1, name: 'Ivan', surname: 'Surname', age: 23,
                ExpShop_2: 3,
                ExpShop_3: 1,

            },
            {
                id: 2, name: 'Andrei', surname: 'Serend', age: 41,
                ExpShop_2: 3,
                ExpShop_3: 2,
            },
            {
                id: 3, name: 'Andreddddi', surname: 'Serxxxend', age: 35,
                ExpShop_1: 4,
                ExpShop_3: 1,
            }
        ]

        async function pushCashiers() {
            for (let i = 0; i < cashiersData.length; i++){
                await app.dbQuery(makePull('Cashiers', cashiersData[i]), (res: any) => {
                    console.log(makePull('Cashiers', cashiersData[i]))
                    console.log(res)
                    // cashiersData[i]
                })
            }
        }
        await pushCashiers()



        async function pushCashRegistersData() {
            const date = new Date();
            function getRandomInt(min: number, max: number) {
                min = Math.ceil(min); max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let cashRegistersData = [
                {
                    id: 1,
                    number: 5,
                    date: '2021-04-12T06:37:12.688Z',
                    timework: 1
                }
            ]

            for (let i = 1; i < getRandomInt(1, 40); i++) {

                date.setDate(date.getDate() - getRandomInt(1, 31))
                let dateStr = date.toISOString();

                cashRegistersData = [...cashRegistersData, {
                    id: cashRegistersData.length,
                    number: i,
                    date: dateStr,
                    timework: getRandomInt(1, 2)
                }]
            }
            console.log(cashRegistersData)

            for (let i = 0; i < cashRegistersData.length; i++) {
                await app.dbQuery(makePull('cashRegisters', cashRegistersData[i]), (res: any) => {
                    console.log(makePull('cashRegisters', cashRegistersData[i]))
                    console.log(res)
                })
            }
            //     DELETE FROM Cashiers

        }

        function makePull(tablename: any, fields: any){
            let query = ''
            console.log(fields)
            let keys = Object.keys(fields)

            Object.values(fields).forEach((value, index) => {
                if (typeof value === "string") fields[keys[index]] = `\'${value}\'`
            })

            console.log(fields)
            query = `INSERT INTO ${tablename} (${Object.keys(fields)})
            VALUES 
                (${Object.values(fields)})
            ;`

            return query
        }
        function makeCreate(tablename: any, fields: any){
            let str = ''

            let lastItem = Object.keys(fields)[Object.keys(fields).length-1];
            for (const [key, value] of Object.entries(fields)) {
                str += `${key} ${value}`
                if(lastItem !== key) str += ', '
            }


            query = `CREATE TABLE ${tablename}(
                ${str}
            );`
            console.log(query)

            return query
        }

        // await pushCashRegistersData()

            //     DELETE FROM cashRegisters





        let query = `SELECT *
            FROM pg_catalog.pg_tables
            WHERE schemaname != 'pg_catalog' AND 
            schemaname != 'information_schema';`

        app.dbQuery(query,async (res: any) => {

            console.log('rows', res.rows)
            res.rows.forEach((row: any, index: number) => {
                for (let i = tables.length-1; i > -1; i--){
                    if(row.tablename === tables[i].tablename){
                        tables.splice(i, 1)
                    }
                }
            })

            for (let i = 0; i < tables.length; i++){
                const table = tables[i];
                console.log(table.tablename)
                await app.dbQuery(makeCreate(table.tablename, table.fields),(res: any) => {
                    console.log(res)
                })
            }

            addShopsIDsToCashiers()

        })


        function addShopsIDsToCashiers(){
            shopsData.forEach(shop => {
                let query = `
                    ALTER TABLE Cashiers
                    add column ExpShop_${shop.id} bigint;`


                app.dbQuery(query,(res: any) => {
                    console.log(query)
                    console.log(res)

                })
            })
        }
        return {
            pushCashRegistersData
        }

    }

}




let dbData = {
    user: 'user',
    host: 'localhost',
    database: 'user',
    password: '',
    port: 5432,
}

let app = new App(dbData.user, dbData.host, dbData.database, dbData.password, dbData.port)
// app.deleteTables()





// let query = `SELECT * FROM CASHIERS`
// query = `
//     INSERT INTO Cashiers(${Object.keys(tables[0].fields).join(',')})
//     VALUES ('1', 'Ivan', 'Shevchuk', 23);
//     `
// // query = `
// //     SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'cashiers';
// //     `
//
//
// app.dbQuery(query,(res: any) => {
//     console.log(query)
//     console.log(res.rows)
//
//
//
//     // app.deleteTables()
//
// })


// interface users {
//     email: 'varchar',
//     firstName: 'varchar',
//     lastName: 'varchar',
//     age: 'int'
// }

// generate()



// app.dbQuery(``,(res: object) => {
//
//     console.log(res)
//
//
// })



// let app = new App(...Object.values(dbData))

// console.log(dbData.user, dbData.host, dbData.database, dbData.password, dbData.port)






// const client = new Client()
// await client.connect()
// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await client.end()


// class Shop implements ShopInterface{
//     constructor(shop) {
//         console.log(shop)
//     }
// }
//
//
// let dbshop = {
//     id: 123123,
//     name: 'dssdsd',
//     address: 'ccccc'
// }
//
// let shop = new Shop(dbshop)
//
