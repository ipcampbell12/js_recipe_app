import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
/* import { getJSON, sendJSON } from './helpers.js'; */
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },

    bookmarks: [],
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceURl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,

        //&& short circuits, so if the key doesn't exist, nothing happens
        // if it does exist, the second part is returned and the value is added to everything else
        //trick for conditionally adding properties to an object
        ...(recipe.key && { key: recipe.key }),
    };
};


//fetch data from recipe api
//doesn't return anything, changes stat object
export const loadRecipe = async function (id) {

    try {

        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)

        state.recipe = createRecipeObject(data)
        //check if there is already a recipe with the same id in the bookmark state
        //if so, mark the current recipe loaded from the API as bookmarked set to true
        //all recipes will either have bookmarked set to true or false

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }

        console.log(state.recipe);
    } catch (err) {
        // temporary error handling
        //console.error(`${err} BAM BAM!`);

        //propagate error down
        throw err;
    }
}

//SEARCH FUNCTIONALITY

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        console.log(data)

        //array of search recipes 
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            };
        });

        //reset starting page to 1 when you do a different search 
        state.search.page = 1
    } catch (err) {
        throw err;
        //propagate error to be able to use it in controller
    }
};

// page is set to 1 by default
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage

    // return part of the results set
    return state.search.results.slice(start, end)
}


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

//When we add something, we get the entire data
export const addBookmark = function (recipe) {

    //Add bookmark to bookmark list
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
}

//When we remove something, we only get the id
export const removeBookmark = function (id) {

    //find the index of the recipe for the id that was passed in using the findIndex method
    const index = state.bookmarks.findIndex(el => el.id === id);

    //Remove bookmark from bookmark list using the splice method
    state.bookmarks.splice(index, 1);

    //Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }

    persistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) {

        //convert string backt to bject
        state.bookmarks = JSON.parse(storage)
    }
};

init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {

    //take all the data from the html form and turn it into an object that has the same format as the other recipes

    try {
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing => { //create object for each ingrdient and remove extra spaces
            const ingArr = ing[1].split(',').map(el => el.trime())

            //check to make sure the data was entered correctly 
            if (ingArr.length !== 3) {
                throw new Error('Wrong ingredient format! Please use the correct format')
            }

            const [quantity, unit, description] = ingArr;

            //if there is a quantity, then convert it to a number. If there is not quanity, let it return null
            return { quantity: quantity ? +quantity : null, unit, description }
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };


        // console.log(recipe)

        // will need api key
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);

        // add created recipe to bookmarks
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }


}