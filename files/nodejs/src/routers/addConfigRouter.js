const express = require('express');
const debug = require('debug')('app:addConfigRouter');
const { MongoClient } = require('mongodb');

const addConfigRouter = express.Router();

addConfigRouter.route('/').post((req, res) => {
    debug(req.body);
    const { host_name, bgp_asn, lo0_0, select_options } = req.body;
    // const host_name = 'keyboard';
    // const bgp_asn = 65001;
    // const lo0_0 = '192.168.66.66';
    // const select_options = 'IS-IS';

    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function addConfig() {
        let client;
        try {
            client = await MongoClient.connect(url);

            const db = client.db(dbName);
            const config = { host_name, bgp_asn, lo0_0, select_options };
            debug(config);
            const results = await db.collection('configs').insertOne(config);

            debug(results);
            req.login(results.ops[0], () => {
                res.json(results);
            });
        } catch (error) {
            debug(error);
        }
        client.close();
    })();
});

module.exports = addConfigRouter;