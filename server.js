
const express = require('express');
const request = require('request');
const cors = require("cors")


const PORT = process.env.PORT || 8888;

const app = express();
const useSocket = require("socket.io");

const whitelist = ["https://plazma-company.web.app", "https://plazma-company.netlify.app", "https://plazma.web.app", "http://localhost:3000"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.static("public"))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (req, res) => {
    request(
        { url: 'http://web.ronas.ru/Home/getData?imei_=1000002450,undefined,7042446897,undefined,7042006162,undefined,1000001805,undefined,7045527594,undefined,7041475582,undefined,7046547674,undefined,7042211655,undefined,1000002737,undefined,1000000843,undefined,1000002736,undefined,1000002699,undefined,1000000805,undefined,1000002837,undefined,1000002739,undefined,1000001590,undefined,1000003219,undefined,1000003271,undefined,1000003220,undefined,1000000327,undefined,1000000692,undefined,1000000369,undefined,1000000888,undefined,1000001039,undefined,1000000653,undefined,1000000758,undefined,1000000759,undefined,1000000651,undefined,1000001488,undefined,1000001303,undefined,1000001596,undefined,undefined,undefined,' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error?.message });
            }
            res.json(JSON.parse(body));
        }
    )
});

let server = app.listen(PORT, () => console.log(`listening on ${PORT}`));

const io = useSocket(server)

io.on('connection', (socket) => {
    socket.on('change', () => socket.broadcast.emit('update'))
});