var koa = require('koa'),
    serve = require('koa-static');

const PORT = 8001;
const ROOT = './dist/www/';

var app = koa();

// Serve static files
//------------------------------------------------------------------------------
app.use(serve(ROOT));

app.listen(PORT);
console.log('serving at http://localhost:' + PORT);
