

import {Client, Pool} from "pg";
interface ShopInterface {
    id: bigint,
    name: string,
    address: string
}


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
        ]

        let cashiersData = [
            {
                id: 1,
                name: 'Ivan',
                surname: 'Surname',
                age: 23,
                ExpShop_2: 3,

            },
            {
                id: 2,
                name: 'Vilma',
                adress: 'DJjjdjj2',
            }
        ]

        let shopsData = [
            {
                id: 1,
                name: 'ATB',
                adress: 'Vulicya',
            },
            {
                id: 2,
                name: 'Vilma',
                adress: 'DJjjdjj2',
            }
        ]


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
                await app.dbQuery(create(table),(res: any) => {
                    console.log(res)
                })
            }

            addShopsIDsToCashiers()

        })


        function create(element: any){
            let str = ''

            let lastItem = Object.values(element.fields)[Object.keys(element.fields).length-1];
            for (const [key, value] of Object.entries(element.fields)) {
                str += `${key} ${value}`
                if(lastItem !== value) str += ', '
            }


            query = `CREATE TABLE ${element.tablename}(
                ${str}
            );`
            console.log(query)

            return query
        }

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
// app.checkTables()






let query = `SELECT * FROM CASHIERS`
query = `
    INSERT INTO Cashiers(${Object.keys(tables[0].fields).join(',')})
    VALUES ('1', 'Ivan', 'Shevchuk', 23);
    `
// query = `
//     SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'cashiers';
//     `


app.dbQuery(query,(res: any) => {
    console.log(query)
    console.log(res.rows)



    // app.deleteTables()

})


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
