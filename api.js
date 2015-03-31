import {readFileSync} from 'fs'; 
import Router from 'koa-router';
import URLs from './config/entrypoints.json';


var router = new Router();

router.get(URLs.country.list, function*(next) {
    let filename = './fake-data/country.json';
    this.body =  readFileSync(filename);
    yield next;
});

router.get(URLs.user.preferences, function*(next) {
    let filename = './fake-data/user.json';
    this.body =  readFileSync(filename);
    yield next;
});

router.get(URLs.validation.captcha, function*(next) {
    let filename = './fake-data/captcha.json';
    this.body =  readFileSync(filename);
    yield next;
});

router.post(URLs.session.login, function *(next) {
    let filename = './fake-data/login.success.json';
    this.body =  readFileSync(filename);
    yield next;
});

export default router;
