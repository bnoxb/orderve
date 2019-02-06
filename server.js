require('dotenv').config(); // IMPORTANT: This must come before you require your database! 

require('./db/db');
const express               = require('express');
const app                   = express();
const morgan                = require('morgan');
// const mongoose              = require('mongoose'); // Not sure if we need mongoose here
const bodyParser            = require('body-parser');
const methodOverride        = require('method-override');
const session               = require('express-session');
var MongoDBStore            = require('connect-mongodb-session')(session);
const Users                 = require('./models/User');
const Events                = require('./models/Event');
// const Services              = require('./models/Service');

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'mySessions'
});

  // Catch errors
store.on('error', function(error) {
    console.log(error);
});

const servicesController    = require('./controllers/servicesController');
const usersController       = require('./controllers/usersController');
const eventsController      = require('./controllers/eventsController');
const authController        = require('./controllers/authController');
const bidController         = require('./controllers/bidController');

// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
}));

// other middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('short'));
app.use(express.static('public'));

app.use('/users', usersController);
app.use('/services', servicesController);
app.use('/events', eventsController);
app.use('/auth', authController);
app.use('/bids', bidController);

// load the first home page
app.get('/', async (req,res) => {
    console.log(`loaded the first page`);
    try {
        const events = await Events.find({});
        const users = await Users.find({});

        res.render('index.ejs', {
            currentUserId: req.session.userId,
            currentSession: req.session,
            events: events,
            users: users
        });
    } catch (err) {
        res.send(err);
    }
});

// load the about page
app.get('/about', async (req, res) => {
    try {
        res.render('about.ejs', {
            currentUserId: req.session.userId,
            currentSession: req.session,
        })
     } catch (err) {
        res.send(err);
        console.log(err);
    }
});


app.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`);
})