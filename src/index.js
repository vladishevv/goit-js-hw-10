import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBoxEll = document.querySelector('#search-box');
const countryListEll = document.querySelector('.country-list');
const countryInfoEll = document.querySelector('.country-info');

searchBoxEll.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  let name = e.target.value.trim();
  if (name === '') {
    clearContent();
  } else {
    fetchHendler(name);
  }
}

function fetchHendler(name) {
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        clearContent();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        clearContent();
        countryListMarkUp(data);
        return;
      }
      if ((data.length = 1)) {
        clearContent();
        countryListMarkUp(data);
        countryInfoMarkUp(data);
        return;
      }
    })
    .catch(error => {
      clearContent();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryInfoMarkUp(data) {
  const markUp = data.map(({ capital, population, languages }) => {
    return `<p>Capital: ${capital}</p><p>Population: ${population}</p><p>Languages: ${Object.values(
      languages
    )}</p>`;
  });
  countryInfoEll.innerHTML = markUp.join('');
}

function countryListMarkUp(data) {
  const markUp = data.map(({ name: { official }, flags: { svg } }) => {
    return `<li><img src=${svg} width='50'></img>${official}</li>`;
  });
  countryListEll.innerHTML = markUp.join('');
}

function clearContent() {
  countryListEll.innerHTML = '';
  countryInfoEll.innerHTML = '';
}
