import Koa from 'koa';
import KoaRouter from 'koa-router';
const cors = require('@koa/cors');
import parse from 'co-body';
import serve from 'koa-static';
import mongoose from 'mongoose';

const io = require('socket.io')();

import { getDemWings } from './Wing.model';

console.log("asd");

import config from './config';
import { getWings, postWing, getEvents, processWing } from './Wing.model';

const app = new Koa();
app.use(cors());
const router = new KoaRouter({ prefix: '/api' });

async function run() {
    mongoose.connect('mongodb://localhost:32768/wingman');
}

run().catch(error => console.error(error.stack));

app.use(serve(`${__dirname}/../build/`));

router.get('/wings', getWings);
router.get('/events', getEvents);
router.post('/wing', postWing);
router.post('/process', processWing);

app
    .use(router.routes())
    .use(router.allowedMethods());


async function startKoa() {
    app.listen(config.koa.port);
    console.log(`Listening on port ${config.koa.port}`);
    const socketio = io.listen(8000, {log: false});
    socketio.on('connection', (client) => {
      client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(async () => {
          const demwings = await getDemWings();
          client.emit('timer', demwings);
        }, interval);
      });
    });


}

startKoa();
