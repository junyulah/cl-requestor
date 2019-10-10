const http = require('http');
const https = require('https');

const checkFun = (v) => {
    if (v && typeof v !== 'function') {
        throw new TypeError('Expect null or function, but got ' + v);
    }
};

module.exports = (type, opts = {}) => {
    let sender = http;
    const {
        chunkHandler, throwBody, optionsWraper, bodyParser
    } = opts;

    // type check
    checkFun(chunkHandler);
    checkFun(optionsWraper);
    checkFun(bodyParser);

    if (type === 'https') {
        sender = https;
    }

    return (options = {}, postData = '') => {
        return new Promise((resolve, reject) => {
            if (optionsWraper) options = optionsWraper(options);
            const req = sender.request(options, (res) => {
                const chunks = [];
                const headers = res.headers;
                const statusCode = res.statusCode;

                res.on('data', function (chunk) {
                    try {
                        chunkHandler && chunkHandler(chunk, 'data');
                        if (!throwBody) {
                            chunks.push(chunk);
                        }
                    } catch(err) {
                        reject(err);
                    }
                });

                res.on('end', function () {
                    try {
                        chunkHandler && chunkHandler(null, 'end');
                        let body = null;
                        if (!throwBody) {
                            body = chunks.join('');
                            if (bodyParser) {
                                body = bodyParser(body);
                            }
                        }
                        resolve({statusCode, headers, body});
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            req.on('error', reject);
            // write data to request body
            req.write(postData);
            req.end();
        });
    };
};
