const express = require('express');
const debug = require('debug')('app:addEsiConfigRouter');
const { MongoClient } = require('mongodb');

const addEsiConfigRouter = express.Router();

addEsiConfigRouter.route('/').post((req, res) => {
    const { esi_iface_name, description, interface_type, jumbo_mtu, vlans } = req.body;

    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function addConfig() {
        let client;
        try {
            client = await MongoClient.connect(url);

            const db = client.db(dbName);
            const esiConfig = { esi_iface_name, description, interface_type, jumbo_mtu, vlans };
            const results = await db.collection('esiConfigs').insertOne(esiConfig);

            debug(results);
            req.login(results.ops[0], () => {
                res.redirect('/esiConfigs');
            });
        } catch (error) {
            debug(error);
        }
        client.close();
    })();
});

module.exports = addEsiConfigRouter;