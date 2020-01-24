  'use strict';

  // videos array
  const videosArray = [
    'MijmeoH9LT4', 'M7lc1UVf-VE', 'v-F3YLd6oMw', 'HluANRwPyNo', 'AslncyG8whg', 'FSs_JYwnAdI',
    'PylQlISSH8U', 'sakQbeRjgwg'
  ];
  // https://youtu.be/R4SYIfhzMmU


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

  function createDivContainers (array) {
  const mainDiv = document.getElementById('main-video');


    array.forEach((item, index) => {
      let playerDiv = document.createElement('div');
      setAttributes(playerDiv, {'id': `player-${index}`});
      mainDiv.append(playerDiv);
    })
  }



  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {

    videosArray.forEach((item, index) => {

      player = new YT.Player(`player-${index}`, { //'player-0'
        height: '390',
        width: '640',
        videoId: item, //'M7lc1UVf-VE'
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
      
    })
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    // event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  // var done = false;
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

  function stopVideo() {
    player.stopVideo();
  }

  createDivContainers(videosArray);