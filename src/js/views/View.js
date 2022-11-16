import icons from 'url:../../img/icons.svg';

//will be parent class of other child views
export default class View {
  _data;

  //data stored in this.data
  render(data, render = true) {

    //check if there is not data or if the data is just an empty array
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) {
      return markup;
    }

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {

    this._data = data;

    //generate new markup and compare it to old markup
    const newMarkup = this._generateMarkup();

    //create virutal DOM in memory - nodeList 
    //DOM that WOULD be rendered on the page
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    //loop over two arrays at the same time and compare them
    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];

      //compares the content of the two nodes from original number of servings and updated number of servings
      //console.log(curEl, newEl.isEqualNode(curEl))

      //if the nodes aren't equal, change the text content of the current element to match the new element
      //firstChild node is what contains the text
      //Only do it for nodes that have an an actual text value
      // ? => optional chaining => returns undefined if objct is null or undefined
      // (in case first child doesn't exit)
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        // console.log(newEl.firstChild.nodeValue.trim())
        curEl.textContent = newEl.textContent;
      }

      //update changed attributes
      //copy attributes from newElements to current one
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
      };
    });
  }

  //clear data from parent element
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  };




  //Display error message

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  };

  //Display success message 
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  };


}