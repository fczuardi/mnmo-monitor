import {readFileSync} from 'fs';
import Router from 'koa-router';
import requestbody from 'koa-body';
import jsonFile from 'json-file-plus';
import URLs from './config/endpoints.js';


const router = new Router();
const koaBody = requestbody();

console.log(URLs.country.list);

router.get(URLs.country.list, function* countryList(next) {
    let filename = './fake-data/country.json';
    this.body = readFileSync(filename);
    yield next;
});
router.get(URLs.languages.list, function* languagesList(next) {
    let filename = './fake-data/languages.json';
    this.body = readFileSync(filename);
    yield next;
});
router.get(URLs.columns.list, function* columnList(next) {
    let filename = './fake-data/columns.json';
    this.body = readFileSync(filename);
    yield next;
});
router.get(URLs.filters.groups, function* groupsList(next) {
    let filename = './fake-data/groups.json';
    this.body = readFileSync(filename);
    yield next;
});
router.get(URLs.user.preferences, function* getUserPref(next) {
    let filename = './fake-data/user.json';
    this.body = readFileSync(filename);
    yield next;
});
router.post(URLs.user.preferences, koaBody, function* postUserPref(next) {
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

router.post(URLs.columns.list, koaBody, function* postColumnsList(next) {
    let filename = './fake-data/columns.json';
    let file = yield jsonFile(filename);
    if (Array.isArray(this.request.body.enabled)) {
        console.log(this.request.body);
        file.data = {};
        file.set(this.request.body);
    }
    yield file.save();
    this.body = JSON.stringify(file.data);
    yield next;
});

router.get(URLs.validation.captcha, function* getCaptcha(next) {
    let filename = './fake-data/captcha.json';
    this.body = readFileSync(filename);
    yield next;
});

router.post(URLs.session.login, function* makeLogin(next) {
    let filename = './fake-data/login.success.json';
    this.body = readFileSync(filename);
    yield next;
});

export default router;
