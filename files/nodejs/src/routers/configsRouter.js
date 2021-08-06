const express = require('express');
const debug = require('debug')('app:configsRouter');
const { MongoClient, ObjectID } = require('mongodb');

const configsRouter = express.Router();
// configsRouter.use((req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.redirect('/auth/signIn');
//     }
// });
configsRouter.route('/').get((req, res) => {
    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('Connected to the mongo DB');

            const db = client.db(dbName);

            const configs = await db.collection('configs').find().toArray();

            res.render('configs', { configs });
        } catch (error) {
            debug(error.stack);
        }
        client.close();
    })();
});

configsRouter.route('/:id').get((req, res) => {
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

            const config = await db
                .collection('configs')
                .findOne({ _id: new ObjectID(id) });

            res.render('config', {
                config,
            });
        } catch (error) {
            debug(error.stack);
        }
        client.close();
    })();
});

module.exports = configsRouter;