import View from './View.js'
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');

            //keep you from clickin on something that's not a button;

            if (!btn) return;
            const goToPage = +btn.dataset.goto;

            handler(goToPage);

        });
    };

    _generateMarkup() {

        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
        console.log(numPages)

        const pNum = this._data.page;
        //Page 1, and there are other pages
        if (pNum === 1 && numPages > 1) {

            //only want button for next page
            return `
            <button data-goto="${pNum + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${(pNum + 1)}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }



        //Last page
        if (pNum === numPages && numPages > 1) {
            //only want button for previous page
            return `
          <button data-goto="${pNum - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${(pNum - 1)}</span>
          </button>`
        }
        //Other page 
        if (pNum !== 1 && pNum < numPages) {
            //want button for next and previous page

            return `
            <button data-goto="${pNum - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${(pNum - 1)}</span>
          </button>
          <button data-goto="${pNum + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${(pNum + 1)}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
            `
        }
        //Page 1, and there are NO other pages
        if (pNum === 1 && numPages === 1) {
            return ''
        }
    }
}

export default new PaginationView();

