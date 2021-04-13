import {Pool, QueryArrayResult} from "pg";
import {cashiersData, shopsData, tables} from "./constant";

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
    dbQuery(query: string, cb: CallableFunction) {
        this.client.query(query, (err, res) => {
            cb(res)
        })


    }

    // async getTargetCashiers1() {
    //
    //     let shopIDs: any = [1, 5] // ATB, Arsen
    //
    //     let exps: string[] = []
    //     shopsData.forEach(shop => {
    //         exps.push(`ExpShop_${shop.id}`)
    //     })
    //
    //     let query = `
    //         SELECT id, name
    //
    //         FROM Cashiers
    //
    //         WHERE ${shopIDs.map((element: string) => `ExpShop_${element} > 0`).join(' OR ')}
    //
    //             GROUP BY ${exps.join(', ')}, id, name
    //         HAVING
    //             SUM(${exps.map((element: string) => `COALESCE(${element}, 0)`).join('+')}) > 5`
    //
    //     console.log('query', query)
    //
    //     await app.dbQuery(query, async (res: any) => {
    //         console.log('getTargetCashiers1', res)
    //     })
    //
    //
    // }
    // async getTargetCashiers2() {
    //     for (let i = 0; i < shopsData.length; i++) {
    //         if (shopsData[i].address === 'Shevchenka 100') {
    //
    //             let query = `SELECT id, number, shop, cashier, date, timework
    //                 FROM Cashregisters
    //                 WHERE shop = ${shopsData[i].id} AND mod(number, 2) <> 0 AND timework = 2
    //                 AND EXTRACT(DOW FROM date) = 1`
    //             console.log(query)
    //
    //             await app.dbQuery(query, async (res: any) => {
    //                 console.log('getTargetCashiers2', res)
    //             })
    //
    //             break
    //         }
    //     }
    // }


    async checkTables(){
        // Check Tables in DB and insert new, like Laravel migrate
        let query = `SELECT *
            FROM pg_catalog.pg_tables
            WHERE schemaname != 'pg_catalog' AND 
            schemaname != 'information_schema';`

        this.dbQuery(query,async (res: QueryArrayResult) => {

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
                await this.dbQuery(makeCreate(table.tablename, table.fields),(res: QueryArrayResult) => {
                    console.log(res)
                })
            }

            addShopsIDsToCashiers()

        })

        const addShopsIDsToCashiers = () =>{
            // Add Fields to Cashiers with ids shops
            shopsData.forEach(shop => {
                let query = `
                    ALTER TABLE Cashiers
                    add column ExpShop_${shop.id} bigint;`

                this.dbQuery(query,(res: QueryArrayResult) => {
                    console.log(res)

                })
            })
        }


        const pushCashiers = async () => { // seed data Cashiers
            for (let i = 0; i < cashiersData.length; i++) {
                await this.dbQuery(makePull('Cashiers', cashiersData[i]), (res: QueryArrayResult) => {
                    console.log(res)
                    // cashiersData[i]
                })
            }
        }
        // await pushCashiers()


        const pushCashRegistersData = async () => { // generate random data and seed to bd
            const date = new Date();

            function getRandomInt(min: number, max: number) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let cashRegistersData: any = []

            for (let i = 0; i < 500; i++) {

                date.setDate(date.getDate() + getRandomInt(1, 31))
                let dateStr = date.toISOString();
                console.log(i)
                cashRegistersData = [...cashRegistersData, {
                    id: i,
                    number: getRandomInt(1, 10),
                    shop: shopsData[getRandomInt(0, shopsData.length - 1)].id,
                    cashier: cashiersData[getRandomInt(0, cashiersData.length - 1)].id,
                    date: dateStr,
                    timework: getRandomInt(1, 2)
                }]
            }
            console.log(cashRegistersData)


            for (let i = 1; i < cashRegistersData.length; i++) {
                await this.dbQuery(makePull('cashRegisters', cashRegistersData[i]), (res: QueryArrayResult) => {
                    console.log(makePull('cashRegisters', cashRegistersData[i]))
                    console.log(res)
                })
            }//     DELETE FROM cashregisters

        }

        function makePull(tablename: string, fields: any){ // make query request
            let query = ''
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
        function makeCreate(tablename: string, fields: any){ // make create Table request
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

        return {
            pushCashRegistersData,
            pushCashiers
        }

    }

    async deleteTables (){
        for (let i = tables.length-1; i > -1; i--){
            let query = `DROP TABLE ${tables[i].tablename};`
            await this.dbQuery(query, async (res: QueryArrayResult) => {
                console.log(res)
            })
        }
    }

}

export default App
