const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
    const { username, password } = req.body;
    const url =
        'mongodb://localhost:27017';
    const dbName = 'junosConfig';

    (async function addUser() {
        let client;
        try {
            client = await MongoClient.connect(url);

            const db = client.db(dbName);
            const user = { username, password };
            const results = await db.collection('users').insertOne(user);
            debug(results);
            req.login(results.ops[0], () => {
                res.redirect('/');
            });
        } catch (error) {
            debug(error);
        }
        client.close();
    })();
});

authRouter
    .route('/signIn')
    .get((req, res) => {
        res.render('signin');
    })
    .post(
        passport.authenticate('local', {
            successRedirect: '../configs',
            failureRedirect: '/auth/signIn',
        })
    );
authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
});

module.exports = authRouter;