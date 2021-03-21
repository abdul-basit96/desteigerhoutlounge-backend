import MySQL from './connection';
import { Service } from 'typedi';


@Service()
export default class Query {

    async find(data: object, tableName: string) {
        const { fields, values } = this.extractData(data);
        let condition: string = '';
        for (let i = 0; i < fields.length; i++) {
            condition = condition.length > 0 ? condition + ' and ' : '';
            condition = `${condition} ${fields[i]} = ${values[i]}`;
        }
        const query = `SELECT * from ${tableName} where ${condition};`
        const resp = await this.generalFunction(query);
        return resp[0] ? resp[0] : false;
    }

    async insert(data: object, tableName: string): Promise<boolean> {
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
            try {
                const mysql = await MySQL.startConnection();
                mysql.query(query, async function (err, result) {
                    if (err) throw new Error(err);
                    await MySQL.endConnection();
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    extractData(data: object): { fields: string[], values: string[] } {
        try {
            let fields: string[] = [], values: string[] = [];
            Object.keys(data).map(function (key) {
                fields.push(key);
                values.push(`'${data[key]}'`);
            });
            return { fields, values };
        } catch (e) {
            throw new Error(e);
        }
    }
}