const mongoose = require('mongoose'),
      URLSlugs = require('mongoose-url-slugs');

// define the data in our collection
const Recipe = new mongoose.Schema({
  title: {type: String, unique: true},
  rawingredients: [String],
  measuredingredients: [String],
  serving: Number,
  instructions: [String],
  image: [String],
  id: Number
});

Recipe.plugin(URLSlugs('title id'));

mongoose.model('Recipe', Recipe);

dbconf = 'mongodb://localhost/recipe-builder-v1';
mongoose.connect(dbconf, () =>{
	 //mongoose.connection.db.dropDatabase();
});