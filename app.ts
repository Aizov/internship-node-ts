

import {tables, shopsData, cashiersData, dbData} from './constant'

import App from "./db";
import {QueryArrayResult} from "pg";


let app = new App(dbData.user, dbData.host, dbData.database, dbData.password, dbData.port)






async function getTargetCashiers1() {

    let shopIDs: ReadonlyArray<number> = [1, 5] // ATB, Arsen

    let exps: Array<string> = []

    shopsData.forEach(shop => {
        exps.push(`ExpShop_${shop.id}`)
    })

    let query = `
            SELECT id, name
            
            FROM Cashiers
            
            WHERE ${shopIDs.map((element) => `ExpShop_${element} > 0`).join(' OR ')}
            
                GROUP BY ${exps.join(', ')}, id, name
            HAVING 
                SUM(${exps.map((element) => `COALESCE(${element}, 0)`).join('+')}) > 5`

    console.log('query', query)

    await app.dbQuery(query, async (res: string) => {
        console.log('getTargetCashiers1', res)
    })


}

async function getTargetCashiers2() {
    for (let i = 0; i < shopsData.length; i++) {
        if (shopsData[i].address === 'Shevchenka 100') {

            let query = `SELECT id, number, shop, cashier, date, timework
                    FROM Cashregisters
                    WHERE shop = ${shopsData[i].id} AND mod(number, 2) <> 0 AND timework = 2
                    AND EXTRACT(DOW FROM date) = 1`
            console.log(query)

            await app.dbQuery(query, async (res: QueryArrayResult) => {
                console.log('getTargetCashiers2', res)
            })

            break
        }
    }
}


getTargetCashiers1()
getTargetCashiers2()






// app.deleteTables()
