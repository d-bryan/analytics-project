# Analytics Project

## Getting Started

Most, if not all, of the content for the pages is generated using javaScript. There are container divs on each page to mount all of the content to, similar to react.

If you have javaScript disabled in your browser, none of this will work.

### Google Analytics

Universal Analytics is set up on each page for you in different ways, you will need to change the ID to your own if you wish to see the results of the data.

At the top of each HTML file you will see the following:

```javascript
  <!-- Google Analytics -->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-[YOUR ID HERE]', 'auto');
    ga('send', 'pageview');
  </script>
  <!-- End Google Analytics -->
```

Change the part where it says `'UA-[YOUR ID HERE]'` to your own analytics ID.

### User.js

The projects utilizes the `Random Users API` for the users page, the documentation for which can be found [here](https://randomuser.me/documentation). You do not require an API key to use this, it is a helpful REST API for generating a list of users for your project with random data of your choosing.

You will need to make a `GET` request to the following endpoint `https://randomuser.me/api/` and add any parameters after a query string `?`

EXAMPLE: `https://randomuser.me/api/?results=24&nat=us`

The top of the file is already set up with constants for your query strings, you can change them here or add more if you wish.

```javascript
const userAPI = 'https://randomuser.me/api/';
const maleUsers = 'gender=male';
const femaleUsers = 'gender=female';
const nationality = 'nat=us';
const numUsers = 'results=24';
```

By calling the function below it will map the data and add it to the page with the `mapCards function`

EXAMPLE: ```fetchData(`${userAPI}?${nationality}&${numUsers}`);```

```javascript
  async function fetchData (url) {
    await fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(res => {
        mapCards(res.results);
      })
      .catch(err => console.error(`FETCH USER DATA ISSUE: ${err}`));
  }
```

The buttons in the user card generate a random video from the `videosArray` at the top of the file.

These strings are used to identify the youtube video url. The full url would be `https://youtu.be/v-F3YLd6oMw` but the youtube player does not need the full string just the ending route.

```javascript
const videosArray = [
  'MijmeoH9LT4', 'M7lc1UVf-VE', 'v-F3YLd6oMw', 'HluANRwPyNo', 'AslncyG8whg', 'FSs_JYwnAdI',
  'PylQlISSH8U', 'sakQbeRjgwg'
];
```

You can read how to get started with the youtube player api [here](https://developers.google.com/youtube/iframe_api_reference?hl=en_US#Getting_Started)

This is how it is implemented to generate a random video from the `videosArray`

```javascript
  var player;
  function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
    height: '390',
      width: '640',
      videoId: getRandomVideo(videosArray),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    return player;
  }
```

#### Tracking in User.js

Every time that a user clicks on a button in the users page, Google analytics sends the following information:

```javascript
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
```

### Player.js

This file is linked to `videos.html` and has similar functionality to the video in `user.js` there is an array of videos at the top used for mapping and we use a forEach loop to create youtube players for the page.

The `player-${index}` will become `id="player-0"`

```javascript
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
```

#### Tracking in Player.js

Each video makes a callback to `onPlayerStateChange` which lets the player know whether the video is buffering, playing, paused, stopped or cued.

```javascript
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
```

### Products.js

**ALL OF THE INFORMATION USED IN THE FILE BELONGS TO _UNDER ARMOUR_ AND ITS AFFILIATE COMPANIES AND SHOULD NOT BE USED FOR COMMERCIAL PURPOSES THIS IS FOR DEMOSTRATION PURPOSES ONLY.**

This file holds an object literal of JSON items to be maped over in `ecommerce.js`. The structure of the object is as follows:

```javascript
var products: {
    id: number;
    title: string;
    description: string;
    gender: string;
    category: string;
    brand: string;
    variant: string;
    price: number;
    quantity: number;
    tax: number;
    shipping: number;
    imageLocation: string;
}
```

#### Tracking in Products.js

When the page loads an Analytics funtion fires off for impression on each item and sends the data for `id, name, category, brand and variant`

```javascript
products.forEach(item => {
  ga('ec:addImpression', {
    'id': item.id.toString(),
    'name': item.title,
    'category': item.category,
    'brand': item.category,
    'variant': item.variant,
  })
})
```

### Ecommerce.js

This file creates uses the data from `products.js` and adds them to the page using a template in the file. This file is linked to `products.html`.

Once the page is loaded the following gets executed:

```javascript
// add the items to the page
window.onload = () => {
  // create the heading element
  mainContainer.append(h1);
  setAttributes(h1, {'id': 'main-heading'});
  h1.textContent = 'Products';

  // add the products to the page
  createProducts(products);
  // add the cart text to the page
  createCart();
}
```

There are two event listeners, one for each `div` on the page containing the elements.

```javascript
mainContainer.addEventListener('click', addItemToCart, false);
mainProductCartContainer.addEventListener('click', removeItemFromCart, false);
```

1. The `addItemToCart` callback funtion performs the following:
    + If the value attempted to be added from quantity is 0 then the event listener does nothing.
    + Collects the data from the element that was clicked on and stored it into local variables.
    + Adds this data to the `cartItem` template.
    + Inserts the template item into the `div` designated for cart items.
    + Calculates the shipping, tax, and subtotal (with tax and shipping) and edits the values on the page to show to the user.
    + Fires off `addToCart` tracker for google analytics (demonstrated below).
    + Resets the quantity on the item added to 0.

2. The `removeItemFromCart` callback function performs the following:
    + If the value attempted to be subtracted from the cart is 0 then the event listener does nothing.
    + Collects values from data attributes passed through the template made by add to cart and stores them in local variables.
    + Subtracts the Individual Items value for shipping, tax and subtotal from the total cost and edits the content on the page for the user.
    + Fires off `removeFromCart` tracker for google analytics (demonstrated below).
    + Uses a while loop to remove items from the page.

#### Tracking in Ecommerce.js

There are two `enhanced ecommerce` trackers enabled on the products page. One for when a user adds an item to their cart and another for when they remove it from the cart.

##### Add to Cart

This is fired off when the user clicks on the add to cart button for an item, which calls the `addItemToCart` function.

```javascript
ga('ec:addProduct', {
  'id': productId,
  'name': productTitle,
  'category': productCategory,
  'brand': productBrand,
  'variant': productVariant,
  'price': productPrice,
  'quantity': productQuantity
});
ga('ec:setAction', 'add');
ga('send', 'event', 'UX', 'click', 'add to cart');
```

##### Remove from Cart

This is fired off when the user clicks on the remove button for an item, which calls the `removeItemToCart` function.

```javascript
ga('ec:addProduct', {
  'id': productId,
  'name': productTitle,
  'category': productCategory,
  'brand': productBrand,
  'variant': productVariant,
  'price': productPrice,
  'quantity': productQuantity
});
ga('ec:setAction', 'remove');
ga('send', 'event', 'UX', 'click', 'remove from cart');
```
