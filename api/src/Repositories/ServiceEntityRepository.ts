import Database from "../Database/Database";
import autoParseJSON from "../Services/AutoParseJSON";
import { Parameters } from "../Types/Parameters";

class ServiceEntityRepository extends Database
{
    private entity: string;

    public constructor(entity: string) {
        super();
        this.entity = entity;
    }

    public async insert(fields: Array<string>, values: Array<string>) {
        return new Promise(async (resolve, reject) => {
            let sql = `INSERT INTO ${this.entity}(${fields.join(', ')}) VALUES(${Array.from({ length: fields.length }, () => '?').join(', ')})`;
            console.log(sql);
            console.log(values);

            this.getConnection().query(sql, values, async function(err, result) {
                if(err) {
                    reject(err);
                    return;
                }
               
                resolve(result);
            })
        })
    }

    public async findAll() {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${this.entity}`;

            this.getConnection().query(sql, async function(err, result) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findBy(options: Parameters = {}) {
        return new Promise(async (resolve, reject) => {
            let keys = Object.keys(options);
            let paramsStr = keys.map((p) => p + ' = ?');
            let sql = `SELECT * FROM ${this.entity} where ${paramsStr.join(' and ')}`

            this.getConnection().query(sql, Object.values(options), async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(autoParseJSON(result));
            })
        })
    }

    public async findOneBy(options: Parameters = {}) {
        return new Promise(async (resolve, reject) => {
            let keys = Object.keys(options);
            let paramsStr = keys.map((p) => p + ' = ?');
            let sql = `SELECT * FROM ${this.entity} where ${paramsStr.join(' and ')}`

            this.getConnection().query(sql, Object.values(options), async function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result[0]);
            })
        })
    }

    public async persist() {

    }
}

export default ServiceEntityRepository;