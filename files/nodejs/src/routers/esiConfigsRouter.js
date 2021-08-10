const express = require('express');
const debug = require('debug')('app:esiConfigsRouter');
const { MongoClient, ObjectID } = require('mongodb');

const esiConfigsRouter = express.Router();
// esiConfigsRouter.use((req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.redirect('/auth/signIn');
//     }
// });
esiConfigsRouter.route('/').get((req, res) => {
    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('Connected to the mongo DB');

            const db = client.db(dbName);

            const esiConfigs = await db.collection('esiConfigs').find().toArray();

            res.render('pages/esiConfigs', { esiConfigs });
        } catch (error) {
            debug(error.stack);
        }
        client.close();
    })();
});

esiConfigsRouter.route('/:id').get((req, res) => {
    const id = req.params.id;
    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('Connected to the mongo DB');

            const db = client.db(dbName);

            const esiConfig = await db
                .collection('esiConfigs')
                .findOne({ _id: new ObjectID(id) });

            res.render('pages/esiConfig', {
                esiConfig,
            });
        } catch (error) {
            debug(error.stack);
        }
        client.close();
    })();
});

module.exports = esiConfigsRouter;