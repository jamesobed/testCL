import { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

// import fs from 'fs';

// Swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// ROUTESS
import usersRouter from './routes/users';
import orderRouter from './routes/orderRoute';
import ticketRouter from './routes/ticketRoute';
import suscribe from './routes/suscribe';
import payment from './routes/paystack';
import shipment from './routes/shipment';

const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/flutter', (req: Request, res: Response) => {
  res.render('./flutter');
});
app.get('/pay', (req: Request, res: Response) => {
  res.render('./paystack');
});
app.use('/user', usersRouter);
app.use('/shipment', shipment);
app.use('/payment', payment);
app.use('/order', orderRouter);
app.use('/ticket', ticketRouter);
app.use('/cargoLand', suscribe);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
