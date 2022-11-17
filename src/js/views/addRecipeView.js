import View from './View.js'
import icons from 'url:../../img/icons.svg';


class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded! :)'

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
    }

    //bind: manually set this keyword to current object (not the button on which event listener is attached to)
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();

            //use form data to read data from all the fields in the form
            //pass form as argument (this keyword refers to the form itslef)
            //can spread object into an array, with all the fields and values
            const dataArray = [...new FormData(this)];

            //Object.fromEntries turns array into object
            const data = Object.fromEntries(dataArray);
            handler(data);
        })
    }
    _generateMarkup() {


    }
}

export default new AddRecipeView();