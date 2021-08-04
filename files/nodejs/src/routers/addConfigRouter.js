const express = require('express');
const debug = require('debug')('app:addConfigRouter');
const { MongoClient, ObjectID } = require('mongodb');

const addConfigRouter = express.Router();

addConfigRouter.route('/').post((req, res) => {
    const { host_name, bgp_asn, lo0_0, select_options } = req.body;
    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function addUser() {
        let client;
        try {
            client = await MongoClient.connect(url);

            const db = client.db(dbName);
            const config = { host_name, bgp_asn, lo0_0, select_options };
            const results = await db.collection('configs').insertOne(config);
            debug(results);
            req.login(results.ops[0], () => {
                res.redirect('configs');
            });
        } catch (error) {
            debug(error);
        }
        client.close();
    })();
});

module.exports = addConfigRouter;