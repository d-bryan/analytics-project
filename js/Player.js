'use strict';

// videos array
const videosArray = [
  'MijmeoH9LT4', 'M7lc1UVf-VE', 'v-F3YLd6oMw', 'HluANRwPyNo', 'AslncyG8whg', 'FSs_JYwnAdI',
  'PylQlISSH8U', 'gwp2rL_fdmY', 'sakQbeRjgwg'
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

function createVideoElements (array) {
  const videoContainer = document.getElementById('videos-conatiner');

  array.map((item, index) => {
    let frameContainer = document.createElement('section');

    setAttributes(frameContainer, {
      'class': 'video-section',
      'data-video-number': index
    });

    let page = `
      <iframe 
        frameborder="0"
        allowfullscreen="1"
        allow="autoplay;"
        width="750"
        height="450"
        src="https://www.youtube.com/embed/${item}"
        >
      </iframe>
    `;

    frameContainer.innerHTML = page;
    videoContainer.append(frameContainer);

  });

}

createVideoElements(videosArray);