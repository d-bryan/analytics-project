'use strict';
// users api request parameters
const userAPI = 'https://randomuser.me/api/';
const maleUsers = 'gender=male';
const femaleUsers = 'gender=female';
const nationality = 'nat=us';
const numUsers = 'results=24';
// videos array
const videosArray = [
  'MijmeoH9LT4', 'M7lc1UVf-VE', 'v-F3YLd6oMw', 'HluANRwPyNo', 'AslncyG8whg', 'FSs_JYwnAdI',
  'PylQlISSH8U', 'gwp2rL_fdmY', 'sakQbeRjgwg'
];



  /**
   * checks fetch request to see if returned (200) and resolves response
   * @param {RESPONSE} response - fetch http response
   */
  function checkStatus (response) {
    if (response.ok) {
      console.log('resolved');
      return Promise.resolve(response);
    } else {
      console.log('rejected');
      return Promise.reject(new Error(response.statusText));
    }
  }

  function getRandomVideo (array) {
    console.log(array.length)
    let num = Math.floor(array.length * Math.random());
    return videosArray[num];
  }

  

  /**
   * Sends fetch request to url endpoint for users api
   * @param {REQUEST} url - fetch url address 
   */
  async function fetchData (url) {
    await fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(res => {
        mapCards(res.results);
      })
      // .then(data => mapData(data.results))
      .catch(err => console.error(`FETCH USER DATA ISSUE: ${err}`));
  }

  /**
   * maps the users data array to section elements
   * @param {DATA} array - users data array to map
   */
  function mapCards (array) {
    const mainContainer = document.getElementById('user-bio-container');
    array.map((item, index) => {
      // create container for user info
      let cardSection = document.createElement('section');
      setAttributes(cardSection, {
        'class': 'user-section-card', 
        'data-card-number': index, 
        'data-gender': `${item.gender}`});

      // card template
      let page = `
        <div class="card-img-container">
          <img class="card-img" src="${item.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 class="card-name">${item.name.first} ${item.name.last}</h3>
          <p class="card-text">${item.email}</p>
          <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
          <button type="button" class="video-link btn" onClick="createVideoModal()">My Favorite Video</button>
        </div>
      `;
      // add the card to the page
      cardSection.innerHTML = page;
      mainContainer.append(cardSection);

    });
  }

  /**
   * For loop to add attributes to selected element
   * @param {HTML} element - element to add attributes to
   * @param {ATTRIBUTE} attribute - attribute to add to selected element
   */
  function setAttributes (element, attribute) {
    for (let key in attribute) {
      element.setAttribute(key, attribute[key]);
    }
  }

  /**
   * gets data attributes and pushes them to a placeholder array
   * @param {ATTRIBUTE} attribute - attibute to select from element
   * @param {ARRAY} arrayLoop - array of elements to loop over 
   * @param {ARRAY} arrayPush - placeholder array to push attributes to
   */
  function getAttributes (attribute, arrayLoop, arrayPush) {
    arrayLoop.forEach(item => {
        arrayPush.push(item.getAttribute(attribute));
    })
  }

  function clearVideoModal () {
    const modalContainer = document.getElementById('iframe-player');
    const iframeContainer = document.getElementById('iframe-player');

    while (modalContainer.firstChild) {
      modalContainer.removeChild(modalContainer.firstChild);
    }
    iframeContainer.style.display = 'none';
  }

  function createVideoModal () {
    const modalContainer = document.getElementById('iframe-player');
    const iframeContainer = document.getElementById('iframe-player');

    if (modalContainer.firstChild) {
      clearVideoModal();
    }
    

    const modalCard = `
      <div class="modal">
        <button type="button" id="modal-close-btn" onClick="clearVideoModal()">Close</button>
        <div class="modal-info-container">
          <iframe 
          frameborder="0"
          allowfullscreen="1"
          allow="autoplay;"
          width="640"
          height="390"
          src="https://www.youtube.com/embed/${getRandomVideo(videosArray)}"
          >
          </iframe>
        </div>
      </div>
    `;

    iframeContainer.innerHTML = modalCard;
    iframeContainer.style.display = 'block';

  }








  // fetch the user data
  fetchData(`${userAPI}?${nationality}&${numUsers}`);


