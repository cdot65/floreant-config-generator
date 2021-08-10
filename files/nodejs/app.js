const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// declaring variables
const PORT = process.env.PORT || 3000;

// create an instance of express library
const app = express();

// import our routers to call just below
const configsRouter = require('./src/routers/configsRouter');
const esiConfigsRouter = require('./src/routers/esiConfigsRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');
const addConfigRouter = require('./src/routers/addConfigRouter');
const addEsiConfigRouter = require('./src/routers/addEsiConfigRouter');

// middleware layer
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'junosConfig' }));

// user authentication
require('./src/config/passport.js')(app);

// express configuration
app.set('views', './src/views');
app.set('view engine', 'ejs');

// import body-parsing with express
app.use(express.json());

// declare the routes for our imported routers
app.use('/auth', authRouter);
app.use('/esiConfigs', esiConfigsRouter);
app.use('/configs', configsRouter);
app.use('/api/add-config', addConfigRouter);
app.use('/api/add-esi-config', addEsiConfigRouter);
app.use('/api/add-data', adminRouter);

// Collapsed Spine builder form
app.get('/collapsed-spine', function(req, res) {
    res.render('pages/collapsed-spine');
});

// CRB builder form
app.get('/crb', function(req, res) {
    res.render('pages/crb');
});

// Data Center landing page
app.get('/data-center', function(req, res) {
    res.render('pages/data-center');
});

// ERB builder form
app.get('/erb', function(req, res) {
    res.render('pages/erb');
});

// ESI builder form
app.get('/esi', function(req, res) {
    res.render('pages/esi');
});

// Security landing page
app.get('/security', function(req, res) {
    res.render('pages/security');
});

// this should never run unless index.ejs is deleted
app.get('/', (req, res) => {
    res.render('index', { title: 'junosConfig', data: ['a', 'b', 'c'] });
});

// opening web service on our declared port, log message to console
app.listen(PORT, () => {
    debug(`listening on port ${chalk.green(PORT)}`);
});