import koa from 'koa';
import serve from 'koa-static';
import cors from 'koa-cors';
import APIRouter from './api';

const PORT = 8001;
const ROOT = './dist/classic/';
const DEV_PORT = 8002;
const DEV_ROOT = './dist/www/';
const API_PORT = 9001;

var app = koa(),
    devApp = koa(),
    api = koa();

// Serve static files
//------------------------------------------------------------------------------
devApp.use(serve(DEV_ROOT));
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

api.listen(API_PORT);
console.log('serving dev API at http://localhost:' + API_PORT);
