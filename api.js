import Router from 'koa-router';
import URLs from './config/entrypoints.json';

var router = new Router();

router.get(URLs.country.list, function*(next) {
    this.body = JSON.stringify([{
        id: '0',
        label: 'USA',
        tosURL: 'http://example.com/?foo'
    }, {
        id: '1',
        label: 'BRASIL',
        tosURL: 'http://example.com/?bar'
    }]);
    yield next;
});

router.get(URLs.validation.captcha, function*(next) {
    this.body = JSON.stringify({
        questionID: '12345',
        question: '.Quanto é 3 + 5?',
        answers: [
            80,
            40,
            350
        ]
    });
    yield next;
});

router.post(URLs.session.login, function *(next) {
    this.body = JSON.stringify({
        token: '123456789'
    });
    yield next;
});

export default router;
