import { Inject, Container, Service } from 'typedi';
import { DBTables } from '../enums';
import { IProduct, IProductReturn } from '../interfaces';

@Service()
export default class ProductService {
    constructor(
        @Inject('logger') private logger,
        @Inject('mysql') private mysql,
    ) { }

    public async add(productData: IProduct): Promise<boolean> {

        await this.mysql.insert(DBTables.PRODUCT, productData);
        return true;
    }

    public async show(): Promise<IProductReturn[]> {
        const products: IProductReturn[] = await this.mysql.find(DBTables.PRODUCT);
        return products;
    }

    public async showById(id: string): Promise<IProductReturn> {
        const products: IProductReturn = await this.mysql.find(DBTables.PRODUCT, { id });
        return products;
    }

    public async checkout(data): Promise<boolean> {
        await this.mysql.insert(DBTables.CHECKOUT, data);
        return true;
    }
}