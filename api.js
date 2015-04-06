import {readFileSync} from 'fs';
import Router from 'koa-router';
import requestbody from 'koa-body';
import jsonFile from 'json-file-plus';
import URLs from './config/endpoints.js';


const router = new Router();
const koaBody = requestbody();

router.get(URLs.country.list, function *(next) {
    let filename = './fake-data/country.json';
    this.body = readFileSync(filename);
    yield next;
});

router.get(URLs.user.preferences, function *(next) {
    let filename = './fake-data/user.json';
    this.body = readFileSync(filename);
    yield next;
});
router.post(URLs.user.preferences, koaBody, function *(next) {
    let filename = './fake-data/user.json';
    let file = yield jsonFile(filename);
    if ((this.request.body.autoUpdate !== undefined) &&
        (typeof this.request.body.autoUpdate === 'string') ){
        this.request.body.autoUpdate = (this.request.body.autoUpdate === 'true');
    }
    file.set(this.request.body);
    yield file.save();
    this.body = JSON.stringify(file.data);
    yield next;
});

router.get(URLs.validation.captcha, function *(next) {
    let filename = './fake-data/captcha.json';
    this.body = readFileSync(filename);
    yield next;
});

router.post(URLs.session.login, function *(next) {
    let filename = './fake-data/login.success.json';
    this.body = readFileSync(filename);
    yield next;
});

export default router;
