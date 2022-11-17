import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

//from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {

  try {

    //get hash from url 
    //remove hash symbol at end of hash
    const id = window.location.hash.slice(1);

    // guard clause: if no idea, then return
    if (!id) return;
    //spinner while loading
    recipeView.renderSpinner();

    //STEP #0: Keep recipe from search results selected 
    resultsView.update(model.getSearchResultsPage())

    // STEP #1: UPDATING BOOKMARKS VIEW
    //Keep selected recipe highlighted in bookmarks view
    bookmarksView.update(model.state.bookmarks)

    //STEP #2: LOADING RECIPE

    // returns promise - asynchronous
    // recipe is loaded and stored in state object
    await model.loadRecipe(id);

    //STEP #3: RENDERING RECIPE

    //pass data into render method
    recipeView.render(model.state.recipe)



  }
  catch (err) {
    recipeView.renderError(`${err} BAM BAM!`);
    console.log(err)

  }


};


const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;


    // 2. Load search results
    await model.loadSearchResults(query)

    // 3. render results 

    //This is for ALL the results. We only want some results at a time
    // const results = model.state.search.results;
    // resultsView.render(results)

    resultsView.render(model.getSearchResultsPage());

    //4. Render inital pagination and pass in entire search object
    paginationView.render(model.state.search);


  } catch (err) {
    console.log(err)
  }
};


const controlPagination = function (goToPage) {
  //Render new results 
  //Render will overried previous markup because of clear() method
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination button
  paginationView.render(model.state.search);

}


const controlServings = function (newServings) {
  //Update recipe servings (in state)
  model.updateServings(newServings);


  // recipeView.render(model.state.recipe)
  //use the update method instead of render so you don't have to reload the whole page every time you update the number of servings
  recipeView.update(model.state.recipe)


}

const controlAddBookmark = function () {
  //#1) ADD/REMOVE BOOKMARK
  //If the recipe has not been bookmarked, then bookmark it 
  //Otherwise, if it is bookmarked, than remove it 
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else {
    model.removeBookmark(model.state.recipe.id)
  }

  //If the the recipe has been bookmarked, then remove it

  //#2) UPDATE RECIPE VIEW
  //Render only the parts of the page that were updated with the data from state
  recipeView.update(model.state.recipe);

  //#3) RENDER BOOKMARKS
  //list will look like results list
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

//need to handle function as function that returns a promise
const controlAddRecipe = async function (newRecipe) {

  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    //render added recipe 
    recipeView.render(model.state.recipe);

    //Success message
    recipeView.renderMessage();

    //Render updated bookmark view
    bookmarksView.render(model.state.bookmarks)

    //Change ID in URl usin history API (change URL without loading page)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)


  } catch (err) {
    console.log('BOOM BOOM!', err)
    addRecipeView.renderError(err.message)
  }

}


//publisher/subscriber pattern
//this method is the subscriber
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

}

init();

