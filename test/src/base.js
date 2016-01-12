import 'babel-polyfill'; // if you need to some feature like async await, open this notation.
import requestor from '../../index';
import http from 'http';
import assert from 'assert';

describe('base', () => {
    it('base', async () => {
        let server = http.createServer((req, res) => {
            res.end('hello');
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));

        let httpRequest = requestor('http');
        let port = await sp;
        let res = await httpRequest({
            hostname: '127.0.0.1',
            port
        });
        assert.equal(res.body, 'hello');
    });

    it('optionsWraper', async () => {
        let server = http.createServer((req, res) => {
            res.end('hello');
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));
        let port = await sp;

        let httpRequest = requestor('http', {
            optionsWraper: (options) => {
                options.hostname = '127.0.0.1';
                options.port = port;
                return options;
            }
        });
        let res = await httpRequest();
        assert.equal(res.body, 'hello');
    });

    it('chunkHandler', async () => {
        let server = http.createServer((req, res) => {
            res.end('hello');
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));
        let port = await sp;

        let chunks = [];
        let httpRequest = requestor('http', {
            chunkHandler: (chunk, type) => {
                if(type === 'data') {
                    chunks.push(chunk);
                } else if(type === 'end') {
                    assert.equal(chunks + '', 'hello');
                }
            }
        });
        await httpRequest({
            hostname: '127.0.0.1',
            port
        });
    });

    it('throwBody', async () => {
        let server = http.createServer((req, res) => {
            res.end('hello');
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));
        let port = await sp;

        let httpRequest = requestor('http', {
            throwBody: true
        });
        let res = await httpRequest({
            hostname: '127.0.0.1',
            port
        });

        assert.equal(res.body, null);
    });

    it('bodyParser', async () => {
        let server = http.createServer((req, res) => {
            res.end(JSON.stringify({
                a: 1000
            }));
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));
        let port = await sp;

        let httpRequest = requestor('http', {
            bodyParser: (body) => JSON.parse(body)
        });
        let res = await httpRequest({
            hostname: '127.0.0.1',
            port,
            method: 'POST'
        }, JSON.stringify({
            pd : 20
        }));
        assert.equal(res.body.a, 1000);
    });

    it('error', async (done) => {
        let httpRequest = requestor('https');
        try {
            await httpRequest();
        } catch(err) {
            done();
        }
    });

    it('error type', async (done) => {
        let server = http.createServer((req, res) => {
            res.end(JSON.stringify({
                a: 1000
            }));
        });

        let sp = new Promise((resolve) => server.listen(0, () => {
            let port = server.address().port;
            resolve(port);
        }));
        let port = await sp;

        try {
            let httpRequest = requestor('http', {
                bodyParser: 123
            });
            await httpRequest({
                hostname: '127.0.0.1',
                port
            });
        } catch (err) {
            done();
        }
    });
});