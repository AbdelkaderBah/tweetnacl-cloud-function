const nacl = require('tweetnacl');

const app = require('express')()
const port = process.env.PORT
const _ = require('lodash');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
    res.send('Yayyy Hello World!')
})

app.post('/verify', (req, res) => {
    if (req.body.message === undefined || req.body.signature === undefined || req.body.public_key === undefined) {
        return res.send({
            required_files: ['message', 'signature', 'public_key'],
            provided: _.keys(req.body)
        }, 400);
    }

    res.send({
        result: nacl.sign.detached.verify(
            Buffer.from(req.body.message, 'utf8'),
            Buffer.from(req.body.signature, 'base64'),
            Buffer.from(req.body.public_key, 'base64')
        )
    })
})

app.listen(port, () => {
    console.log(`${process.env.APP_NAME} listening at http://localhost:${port}`)
})
