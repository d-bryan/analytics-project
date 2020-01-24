'use strict';
const bioContainer = document.getElementById('user-bio-container');
// users api request parameters
const userAPI = 'https://randomuser.me/api/';
const maleUsers = 'gender=male';
const femaleUsers = 'gender=female';
const nationality = 'nat=us';
const numUsers = 'results=24';
// videos array
const videosArray = [
  'MijmeoH9LT4', 'M7lc1UVf-VE', 'v-F3YLd6oMw', 'HluANRwPyNo', 'AslncyG8whg', 'FSs_JYwnAdI',
  'PylQlISSH8U', 'sakQbeRjgwg'
];




  /**
   * checks fetch request to see if returned (200) and resolves response
   * @param {RESPONSE} response - fetch http response
   */
  function checkStatus (response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  /**
   * returns a random video from the array
   * @param {ARRAY} array - string of videos for youtube player
   */
  function getRandomVideo (array) {
    let num = Math.floor(array.length * Math.random());
    return array[num];
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
      bioContainer.append(cardSection);

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

  /**
   * Sets the iframe contianer display to none and removes all children elements from the dom 
   */
  function clearVideoModal () {
    const modalContainer = document.getElementById('iframe-player');
    const iframeContainer = document.getElementById('iframe-player');

    while (modalContainer.firstChild) {
      modalContainer.removeChild(modalContainer.firstChild);
    }
    iframeContainer.style.display = 'none';
  }

  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function createVideoModal () {
    const modalContainer = document.getElementById('iframe-player');
    const iframeContainer = document.getElementById('iframe-player');

    if (modalContainer.firstChild) {
      clearVideoModal();
    }


      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {

        player = new YT.Player('player', { //'player-0'
          height: '390',
          width: '640',
          videoId: getRandomVideo(videosArray), //'M7lc1UVf-VE'
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        return player;
      }
    

    const modalCard = `
      <div class="modal">
        <button type="button" id="modal-close-btn" onClick="clearVideoModal()">Close</button>
          <div id="player"></div>
        </div>
      </div>
    `;

    iframeContainer.innerHTML = modalCard;
    iframeContainer.style.display = 'block';

    onYouTubeIframeAPIReady();

  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  
  function onPlayerStateChange(event) {
    var videosrc = event.target.getVideoUrl();

    if (event.data == -1) { // unstarted video

      ga(function(tracker) {
        tracker.send('event', 'Video', 'load-time', `${videosrc}`);
      })

    } else if (event.data == 0) { // ended video
      
      ga(function(tracker) {
        tracker.send('event', 'Video', 'finished-playing', `${videosrc}`);
      })

    } else if (event.data == 1) { // playing video
      
      ga(function(tracker) {
        tracker.send('event', 'Video', 'video-playing', `${videosrc}`);
      })

    } else if (event.data == 2) { // paused video
      
      ga(function(tracker) {
        tracker.send('event', 'Video', 'video-paused', `${videosrc}`);
      })

    } else if (event.data == 3) { // buffering video
      
      ga(function(tracker) {
        tracker.send('event', 'Video', 'video-loading', `${videosrc}`);
      })

    } 

  }

  function onButtonClick (event) {

    if (event.target.tagName === 'BUTTON') {
      var currentButton = event.target.innerHTML;
      var cardInfoContainer = event.target.parentNode;
      var userName = cardInfoContainer.firstElementChild.innerHTML;
      var sectionContainer = cardInfoContainer.parentNode;
      var cardNumber = (function() {
        // function to set index number starting 1 higher so it does not have 0 start index for           analytics to confuse users
        var num = parseInt(sectionContainer.getAttribute('data-card-number'), 10);
        return (num + 1).toString() 
      })() 
      var userGender = sectionContainer.getAttribute('data-gender');

      ga(function(tracker) {
        // send the text of the button they clicked on
        tracker.send('event', {
          eventCategory: 'Users',
          eventAction: 'click',
          eventLabel: `${currentButton}`
        });
        // send the number of the card they clicked on
        tracker.send('event', {
          eventCategory: 'Users',
          eventAction: 'click',
          eventLabel: `Section Number ${cardNumber}`
        });
        // send the name of the user they clicked on
        tracker.send('event', {
          eventCategory: 'Users',
          eventAction: 'click',
          eventLabel: `User Name ${userName}`
        });
        // send the gender of the user they clicked on
        tracker.send('event', {
          eventCategory: 'Users',
          eventAction: 'click',
          eventLabel: `User Gender ${userGender}`
        })
      });

    }
  
  }

  bioContainer.addEventListener('click', onButtonClick, false);

  // fetch the user data
  fetchData(`${userAPI}?${nationality}&${numUsers}`);