import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import product from './routes/product';


export default () => {
	const app = Router();
	auth(app);
	user(app);
	product(app);


	return app
}