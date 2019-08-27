const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const uniqid = require('uniqid');

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
const Ingredient = mongoose.model('Ingredientv2'); 

app.use('/', router);

//-------------------------------------------------------------------------------
//------------------------------ TEST FUNCTIONS ---------------------------------
//-------------------------------------------------------------------------------

function findAllRecipes(){
    Recipe.find({}, (err, result, count) => {
        console.log(result);
    });
}

function findAllIngredients(){
    Ingredient.find({}, (err, result, count) => {
        console.log(result);
    });
}

//-------------------------------------------------------------------------------
//---------------------------- GENERAL FUNCTIONS --------------------------------
//-------------------------------------------------------------------------------

// FUNCTION # 1: ADD A RECIPE
function addRecipe(title, rawingredients, measuredingredients, serving, instructions, image){
    //if no image, set default image
    if(image === ""){
        image = "../images/recipes/noImageRecipe.jpg";
    }
    //generate a unique id for the recipe slug
    var id = uniqid();
    //change format of ingredients so that they are all Uppercase first letter, lowercase rest of letters
    var ingredientList = [];
    for(let j = 0; j < rawingredients.length; j++){
        //var currIngredient = rawingredients[j];
        var currIngredient = rawingredients[j].trim();
        currIngredient = currIngredient.replace(/  +/g, ' ');
        var splitIngredient = currIngredient.split(" ");
        var newCurrIngredient = "";
        for(let v=0; v < splitIngredient.length; v++){
            var ingredientPart = splitIngredient[v];
            ingredientPart = ingredientPart.toLowerCase();
            ingredientPart = ingredientPart.replace(ingredientPart.charAt(0), ingredientPart.charAt(0).toUpperCase());
            newCurrIngredient = newCurrIngredient + ingredientPart + " ";
        }
        ingredientList[j] = newCurrIngredient.trim();
    }
    //change formart of measured ingredients to all lowercase
    var measuredIngredientList = [];
    for(let b = 0; b < measuredingredients.length; b++){
        measuredIngredientList[b] = measuredingredients[b].toLowerCase();
    }

    //create and save new recipe
    const newRecipe = new Recipe({
        title: title,
        rawingredients: ingredientList,
        measuredingredients: measuredIngredientList,
        serving: serving,
        instructions: instructions,
        image: image,
        id: id
    });
    Recipe.find({}, (err0, results, count) => {
        newRecipe.save((err1) => {
            if(err1){
                console.log(err1);
                console.log('Error saving new recipe: ' + title);
            }
            console.log("Saved recipe" + newRecipe.title);
        });
    });
}

// FUNCTION # 2: ADD INGREDIENTS

//-------------------------------------------------------------------------------
//--------------------------- CLEAR DATABASE INFO -------------------------------
//-------------------------------------------------------------------------------

/* Ingredient.remove({}, function(err) { 
   console.log('collection removed') 
}); */

/* Recipe.remove({}, function(err) { 
   console.log('collection removed') 
}); */

//-------------------------------------------------------------------------------
//--------------------------- START UP FUNCTIONS --------------------------------
//-------------------------------------------------------------------------------

// ADD 3 BASIC RECIPES TO DATABASE
function startUpRecipes(){
// RECIPE # 1: PB & J
    addRecipe("PB & J", ["PeAnUT BuTTer", "jelly", "whIte BreAd"], ["1 teaspoon peanut butter", "1 teaspoon jelly", "2 slices white bread"], 1, "Spread peanut butter on unbuttered side of one slice of bread, and jelly on the other. Top with other slice, so that peanut butter and jelly are in the middle.", "../images/recipes/pb-j.jpg");
// RECIPE # 2: ROAST BEEF SANDWICH
    addRecipe("Roast Beef Sandwich", ["Roast Beef", "whIte BreAd", "MaYo", "Salt"], ["3 slices roast beef", "2 slices white bread", "1 teaspoon Mayo", "Pinch of sALT"], 1, "Place 3 slices roast beef on a single slice of bread. Sprinkle with salt. Spread mayo on other slice of bread and place bread on top of roast beef, mayo side facing the roast beef.", "../images/recipes/roast-beef.jpg");
// RECIPE # 3: BAKED POTATO
    addRecipe("Baked Potato", ["ButTer", "Russet PoTato", "SALT", "Olive OIL", "pepper"], ["4 russet potato", "Olive Oil", "Salt", "Pepper", "butter"], 4, "Preheat oven to 350°. Prick potatoes all over with a fork and rub with oil; season generously with salt and pepper. Place potatoes directly on an oven rack and roast until very soft when squeezed and skin is crisp, 60–75 minutes. Cut open each potato; season with salt and pepper and top with butter.", "../images/recipes/roast-beef.jpg");
}

// ADD STARTER INGREDIENTS TO ARRAY
function startUpIngredients(){
    Recipe.find({}, (err, results, count) => {
        for(let v = 0; v < results.length; v++){
            var ingredientList = results[v].rawingredients;
            console.log(ingredientList);
            for(let u = 0; u < ingredientList.length; u++){
                if(!ingredients.includes(ingredientList[u])){
                    console.log("Adding "+ingredientList[u]+" to the ingredients list.");
                    ingredients.push(ingredientList[u]);
                }
            }
        }
    });
}

//-------------------------------------------------------------------------------
//----- LOADING INITIALIZING PAGES - ONLY NEED TO BE RAN AT SETUP OF DB ---------
//-------------------------------------------------------------------------------

var ingredients = [];

// ADD RECIPES TO DATABASE IF THERE ARE NONE
router.get('/init', (req, res) => {
    console.log("initializing recipes...");

    Recipe.find({}, (err, results, count) => {
        if(results.length === 0 ){
            startUpRecipes();
            console.log("Adding starter recipes.");
        }
        else{
            startUpIngredients();
            res.redirect('/init/2');
        }

        console.log(results);
        console.log(ingredients);
    });

    res.render('init', {});

});

// ADD INGREDIENTS TO DATABASE IF THERE ARE NONE
// uses info stored in array to setup ingredients in the db
router.get('/init/2', (req, res) => {
    console.log("initializing ingredients...");

    Ingredient.find({}, (err, result, count) =>{
        if(result.length === 0){
            for(let b = 0; b<ingredients.length; b++){
                const newIngr = new Ingredient({
                    name: ingredients[b],
                    substitute: ['none']
                });
                newIngr.save((err) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect('/');
                    }
                });
            }
        }
    });
    res.render('init', {});
});

//-------------------------------------------------------------------------------
// ------------------------------ SITE PAGES ------------------------------------
//-------------------------------------------------------------------------------

router.get('/',(req, res) => {
    console.log('in router.get /');
    
    Ingredient.find({}, (err, ingResults, count) => {
        if(err){
            console.log(err);
        }
        Recipe.find({}, (err, recResults, count) => {
            if(err){
                console.log(err);
            }
            
            console.log(ingResults);
            console.log(recResults);
            res.render('home', {ingredients: ingResults, recipes: recResults});
        });
    });
});

//-----------------------------------------------------------

//listen on port 9090
app.listen(process.env.PORT || 9090);