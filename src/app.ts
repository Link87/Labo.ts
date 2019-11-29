import * as express from 'express';

const app: express.Application = express();

export class HttpGateway {
  constructor () {
    const router = express.Router();
    router.get('/', (_req, res) => {
      res.json({
        message: 'Hello World!',
      });
    });
    app.use('/', router);
  }

  public async listen(port: number) {
    app.listen(port, () => {
      console.log(`Started app at port ${port}`);
    });
  }
}
