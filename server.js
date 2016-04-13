import koa from 'koa';
import serve from 'koa-static';
import cors from 'koa-cors';
import APIRouter from './api';

const PORT = 7001;
const ROOT = './dist/classic/';
const DEV_PORT = 7002;
const DEV_ROOT = './dist/www/';
const BRANDED_PORT = 7003;
const BRANDED_ROOT = './dist/branded/';

const API_PORT = 9001;

var app = koa(),
    devApp = koa(),
    brandedApp = koa(),
    api = koa();

// Serve static files
//------------------------------------------------------------------------------
devApp.use(serve(DEV_ROOT));
brandedApp.use(serve(BRANDED_ROOT));
app.use(serve(ROOT));

// Reference Development API
//------------------------------------------------------------------------------
api.use(APIRouter.routes());
api.use(cors());
api.use(function* serveJSON(next){
    this.set('Content-Type', 'application/json');
    yield next;
});

app.listen(PORT);
console.log('serving app at http://localhost:' + PORT);

devApp.listen(DEV_PORT);
console.log('serving unbundled app at http://localhost:' + DEV_PORT);

brandedApp.listen(BRANDED_PORT);
console.log('serving branded app at http://localhost:' + BRANDED_PORT);

api.listen(API_PORT);
console.log('serving dev API at http://localhost:' + API_PORT);
