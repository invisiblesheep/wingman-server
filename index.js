import Koa from 'koa';
import KoaRouter from 'koa-router';
import parse from 'co-body';
import serve from 'koa-static';
import mongoose from 'mongoose';

console.log("asd");

import config from './config';
import { getWings, postWing } from './Wing.model';

const app = new Koa();
const router = new KoaRouter({ prefix: '/api' });

async function run() {
    mongoose.connect('mongodb://localhost:27017 /test');
}

run().catch(error => console.error(error.stack));

app.use(serve(`${__dirname}/../app/build/`));

router.get('/wings', getWings);
router.post('/wing', postWing);

app
    .use(router.routes())
    .use(router.allowedMethods());


function startKoa() {
    app.listen(config.koa.port);
    console.log(`Listening on port ${config.koa.port}`);
    // const socket = socketio.listen(app.listen(config.koa.port), {log: false});
    // r.connect(config.rethinkdb).then(function(conn) {
    //   return r.table('polls').orderBy({index: r.desc('createdAt')})
    //     .limit(5).changes().run(conn);
    // })
    // .then(function(cursor) {
    //   cursor.each(function(err, data) {
    //     socket.sockets.emit('poll_updated', data);
    //   });
    // });
}

startKoa();