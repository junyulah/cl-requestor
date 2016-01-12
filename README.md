# cl-requestor

- you can configurate a requestor.

- each requestor response a promise

- you have some options to handler request process.

## install

`npm i cl-requestor --save`

## demo

```
import requestor from 'requestor';

let httpRequest = requestor('http');

httpRequest({
    hostname: '127.0.0.1',
    port: 8000
}); // return a promise

```

## data structure of promise

```
{
    headers: {},
    body: null
}
```

## requestor (type, opts)

opts = { bodyParser, optionsWraper, chunkHandler, throwBody }

### type

http or https

### bodyParser

Parse response body.

```
let httpRequest = requestor('http', {
   bodyParser: (body) => JSON.parse(body)
});

httpRequest({
   hostname: '127.0.0.1',
   port: 8000
});
```

### optionsWraper

You can wrap the request options.

```
let httpRequest = requestor('http', {
    optionsWraper: (options) => {
        options.hostname = '127.0.0.1';
        options.port = port;
        options.headers.a ++;
        return options; // remember returning options
    }
});

httpRequest({
    headers: {
        a: 1
    }
});
```

### chunkHandler

You can control the chunk when get response from server.

```
chunkHandler(chunk, type)

type: "data" | "end"
```

```
let chunks = [];
let httpRequest = requestor('http', {
    chunkHandler: (chunk, type) => {
        if(type === 'data') {
            chunks.push(chunk);
        } else if(type === 'end') {
            console.log(chunks + '');
        }
    }
});

httpRequest({
    hostname: '127.0.0.1',
    port: 8000
});
```

### throwBody

When throwBody is true, response body of promise will be null.