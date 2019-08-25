const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

//express
const app = express();
const router = express.Router();
//express-session
const sessionOptions = {
	secret: 'this is a random secret',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));
//body-parser
app.use(bodyParser.urlencoded({extended: false}));
// express static setup
app.use(express.static(path.join(__dirname, 'public')));
// hbs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

require('./db');

mongoose.Promise = global.Promise;
const Recipe = mongoose.model("Recipe");

app.use('/', router);

//-------------------GENERAL FUNCTIONS-----------------------
// FUNCTION # 1: GENERATE A UNIQUE ID FOR EACH RECIPE
function genID();
// FUNCTION # 2: ADD A RECIPE
function addRecipe();

//------------------START UP FUNCTIONS-----------------------
// ADD 5 BASIC RECIPES TO DATABASE
// RECIPE # 1: PB & J

// RECIPE # 2: ROAST BEEF SANDWICH

// RECIPE # 3: BAKED POTATO

// RECIPE # 4: CHICKEN AND EGG FRIED RICE

// RECIPE # 5: BACON AND EGGS BREAKFAST

//---------------------LOADING PAGES-------------------------

router.get('/',(req, res) => {
    console.log('in router.get /');
    // send all recipes in the database
    // and ingredients?
    res.render('home', {});
});

//-----------------------------------------------------------

//listen on port 9090
app.listen(process.env.PORT || 9090);