import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import ProductService from '../../services/product';

const route = Router();

export default (app: Router) => {
    app.use('/product', route);
    const logger: Logger = Container.get('logger');
    const productServiceInstance = Container.get(ProductService);


    route.post('/add',
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
            try {
                await productServiceInstance.add(req.body);
                return res.send("Success").status(201);
            } catch (e) {
                console.log('aaa', e)
                return next(e);
            }
        });

    route.get('/show',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const products = await productServiceInstance.show();
                res.json({ products }).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get('/showone',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const product = await productServiceInstance.showById(String(req.query.id));
                res.json({ product }).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post('/checkout',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await productServiceInstance.checkout(req.body);
                return res.send('Success').status(200);
            } catch (e) {
                return next(e);
            }
        });
}