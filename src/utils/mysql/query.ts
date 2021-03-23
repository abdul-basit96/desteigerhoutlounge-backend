import MySQL from './connection';
import { Service } from 'typedi';


@Service()
export default class Query {

    async find(tableName: string, data?: object) {
        let query = `SELECT * from ${tableName}`;
        if (data) {
            const { fields, values } = this.extractData(data);
            let condition: string = '';
            for (let i = 0; i < fields.length; i++) {
                condition = condition.length > 0 ? condition + ' and ' : '';
                condition = `${condition} ${fields[i]} = ${values[i]}`;
            }
            query = `${query} where ${condition};`
        }


        const resp: any = await this.generalFunction(query);
        return resp.length > 1 ? resp : resp[0] ? resp[0] : false;
    }

    async insert(tableName: string, data?: object): Promise<boolean> {
        const { fields, values } = this.extractData(data);
        const query = `INSERT INTO ${tableName} (${fields}) VALUES (${values});`
        const result = await this.generalFunction(query) ? true : false;
        return result;
    }

    async update() {
        try {
            await MySQL.startConnection();

            await MySQL.endConnection();
        } catch (e) {

        }
    }

    async delete() {
        return new Promise(async (resolve, reject) => {
            try {
                await MySQL.startConnection();


                await MySQL.endConnection();
            } catch (e) {
                throw new Error(e)
            }
        });
    }

    generalFunction(query: string) {
        return new Promise(async (resolve, reject) => {
            const mysql = await MySQL.startConnection();
            mysql.query(query, async function (err, result) {
                if (err) console.log(err); reject(err);
                await MySQL.endConnection();
                resolve(result);
            });
        });
    }

    extractData(data: object): { fields: string[], values: string[] } {

        let fields: string[] = [], values: string[] = [];
        Object.keys(data).map(function (key) {
            fields.push(key);
            values.push(`'${data[key]}'`);
        });
        return { fields, values };

    }
}