import Router from 'koa-router';
import URLs from './config/entrypoints.json';

var router = new Router();

router.get(URLs.country.list, function *(next){
    this.set('Access-Control-Allow-Origin', '*');
    this.body = JSON.stringify([
        {
            id: '0',
            label: 'USA',
            tosURL: 'http://example.com/?foo'
        },
        {
            id: '1',
            label: 'BRASIL',
            tosURL: 'http://example.com/?bar'
        }
    ]);
    yield next;
});

export default router;
