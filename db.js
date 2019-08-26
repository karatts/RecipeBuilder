const mongoose = require('mongoose'),
      URLSlugs = require('mongoose-url-slugs');

// define the data in our collection
const Recipe = new mongoose.Schema({
  title: String,
  rawingredients: [String],
  measuredingredients: [String],
  serving: Number,
  instructions: String,
  image: [String],
  id: String
});

const Ingredientv2 = new mongoose.Schema({
  name: String,
  substitute: [String]
});

Recipe.plugin(URLSlugs('title id'));

mongoose.model('Recipe', Recipe);
mongoose.model('Ingredientv2', Ingredientv2);

dbconf = 'mongodb://localhost/recipe-builder-v3';
mongoose.connect(dbconf, () =>{
	 //mongoose.connection.db.dropDatabase();
});