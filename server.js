var koa = require('koa'),
    serve = require('koa-static');

const PORT = 8001;
const ROOT = './dist/classic/';
const DEV_PORT = 8002;
const DEV_ROOT = './dist/www/';

var app = koa(),
    devApp = koa();

// Serve static files
//------------------------------------------------------------------------------
devApp.use(serve(DEV_ROOT));
app.use(serve(ROOT));

app.listen(PORT);
console.log('serving at http://localhost:' + PORT);

devApp.listen(DEV_PORT);
console.log('serving at http://localhost:' + DEV_PORT);
