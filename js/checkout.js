'use strict';

const formCancelButton = document.getElementById('form-cancel-btn');
const itemsForCartContainer = document.getElementById('products-form-checkout-container');
const priceSubtotalsContainer = document.getElementById('price-subtotals-container');
const creditCardInput = document.getElementById('cardNumberPayment');
const zipCodePayment = document.getElementById('zipCodePayment');
const cvvPayment = document.getElementById('cvvPayment');
const formCheckbox = document.getElementById('confirmInformation');
const submitBtn = document.getElementById('form-submit-btn');
const regexCard = /^[0-9]{13,16}$/;
const regexZip = /^[0-9]{5}$/;
const regexCVV = /^[0-9]{3}$/;
const hostName = "https://d-bryan.github.io/analytics-project/";
const localHostName = "http://127.0.0.1:5500/";
var priceStorage, itemStorage, numItems;


/**
 * Retreive items in local storage and store them in object format
 */
function allStorage() {
  const itemString = 'item';

  var priceStorageContainer = {},
  itemStorageContainer = [],
  keys = Object.keys(localStorage),
  i = keys.length;
  numItems = keys.length - 3;

  while ( i-- ) {
    // if local storage contains cart item values add to item object
    if (keys[i].startsWith(itemString)) {
      itemStorageContainer[ keys[i] ] = JSON.parse(localStorage.getItem( keys[i] ));
      // else add to price object
    } else {
      priceStorageContainer[ keys[i] ] = JSON.parse(localStorage.getItem( keys[i] ));
    } 
  }
  // reassign values to global variables
  priceStorage = priceStorageContainer;
  itemStorage = itemStorageContainer;
  return priceStorage, itemStorage, numItems;
}

/**
 * Adds all of the cart item objects to the page to display to the user
 * @param {ARRAY} array - array of cart item objects
 */
function addCartItemsToPage (array) {

  for (var i = 0; i < numItems; i ++) {
    var itemSection = document.createElement('section');
    var cartItem = array[`item-${i}`];
    var page = `
    <div>
      <img src="${cartItem.productImageLocation}" alt="${cartItem.productDescription}">
    </div>
    <div>
      <p class="checkout-cart-item">${cartItem.productTitle}</p>
      <p class="checkout-cart-item">${cartItem.productVariant}</p>
      <p class="checkout-cart-item">Quantity: ${cartItem.productQuantity}</p>
    </div>
  `;

    itemSection.innerHTML = page;
    itemsForCartContainer.append(itemSection);

  }

}

/**
 * Adds the total subtotals to the page for the user to see
 */
function addPriceTotalsToPage () {
  var priceSection = document.createElement('section');
  var page;

  // set the price values to 0 for when the page resets
  if (priceStorage.totalTax === undefined ||
      priceStorage.totalShipping === undefined ||
      priceStorage.totalCost === undefined) {
        page = `
          <p id="checkout-total-tax">Tax: $0</p>
          <p id="checkout-total-shipping">Shipping: $0</p>
          <p id="checkout-total-cost">Subtotal: $0</p>
        `;

    } else {
      page = `
        <p id="checkout-total-tax">Tax: $${priceStorage.totalTax}</p>
        <p id="checkout-total-shipping">Shipping: $${priceStorage.totalShipping}</p>
        <p id="checkout-total-cost">Subtotal: $${priceStorage.totalCost}</p>
      `;    
    }

  priceSection.innerHTML = page;
  priceSubtotalsContainer.append(priceSection);

}

/**
 * Checks for which type of credit card the user is putting in and changes the opacity on the image for the card
 * @param {KEYUP} event - keyup event for card input
 */
function checkForCardType (event) {
  const discover = document.getElementById('discover-img');
  const mastercard = document.getElementById('mastercard-img');
  const visa = document.getElementById('visa-img');
  const americanexpress = document.getElementById('american-express-img');
  event.stopPropagation();

  if (event.target.value === '3') {
    // set american express opacity to 100%
    americanexpress.style.opacity = 1;
    // set all others to 40%
    visa.style.opacity = .4;
    mastercard.style.opacity = .4;
    discover.style.opacity = .4;

  } else if (event.target.value === '4') {
    // set visa opacity to 100%
    visa.style.opacity = 1;
    // set all others to 40%
    americanexpress.style.opacity = .4;
    mastercard.style.opacity = .4;
    discover.style.opacity = .4;

  } else if (event.target.value === '5') {
    // set mastercard opacity to 100%
    mastercard.style.opacity = 1;
    // set all others to 40%
    visa.style.opacity = .4;
    americanexpress.style.opacity = .4;
    discover.style.opacity = .4;
    
  } else if (event.target.value === '6') {
    // set discovercard opacity to 100%
    discover.style.opacity = 1;
    // set all others to 40%
    visa.style.opacity = .4;
    mastercard.style.opacity = .4;
    americanexpress.style.opacity = .4;

  } else if (event.target.value === '') {
    // set all opacity to 40%
    americanexpress.style.opacity = .4;
    visa.style.opacity = .4;
    mastercard.style.opacity = .4;
    discover.style.opacity = .4;
  }

}

/**
 * Clears local storage and sends the user back to the products page
 */
function cancelPurchase () {
  localStorage.clear();
  window.location.href = `${hostName}products.html`; 
}

/**
 * If the personal information they enter is the same as the shipping information
 * then we change the requirements for the form and hide certain elements 
 * @param {CLICK} event - click event to edit the form
 */
function checkForDuplicateInformation (event) {
  const shippingFieldset = document.getElementById('shipping-information');
  event.stopPropagation();

  // if the personal information is the same as the shipping information modify the form
  if (event.target.checked) {

    shippingFieldset.childNodes.forEach(item => {

      // remove the required attribute
      if (item.tagName === 'INPUT' ||
          item.tagName === 'SELECT') {
            item.removeAttribute('required');
      }

      // set the display to none
      if (item.tagName === 'INPUT' ||
          item.tagName === 'LABEL' ||
          item.tagName === 'SELECT' ||
          item.tagName === 'BR') {
            shippingFieldset.style.display = 'none';
            item.style.display = 'none';
      }
    })

  } else {

    shippingFieldset.childNodes.forEach(item => {

      // set the required attribute back to true
      if (item.tagName === 'INPUT' ||
          item.tagName === 'SELECT') {
            console.log(item)
            item.setAttribute('required', 'true');
      }

      // set the display back to block
      if (item.tagName === 'INPUT' ||
          item.tagName === 'LABEL' ||
          item.tagName === 'SELECT' ||
          item.tagName === 'BR') {
            shippingFieldset.style.display = 'block';
            item.style.display = 'inline-block';
      }
    })
  }
}

/**
 * Validates the credit card information through regex,
 * if all information passes the checks then the form is submitted 
 * and information is sent to google analytics for the purchase that
 * has just been made
 * @param {CLICK} event - submit button for form
 */
function checkoutItems (event) {
  var purcahseId = new Date().toISOString();
  var totalTax = document.getElementById('checkout-total-tax');
  var totalShipping = document.getElementById('checkout-total-shipping');
  var totalCost = document.getElementById('checkout-total-cost');
  event.stopPropagation();

  console.log(totalTax.textContent)
  console.log(totalShipping.textContent)
  console.log(totalCost.textContent)

  // if the event target is the submit button
  if(event.target.id === 'form-submit-btn') {

    // if the credit card number does not pass the regex prevent submission
    if (!creditCardInput.value.match(regexCard)) {
      console.log('card error');
      event.preventDefault();
      alert('Credit Card Number must be 13 - 16 digits');

      // if the zip code does not pass the regex prevent submission
    } else if (!zipCodePayment.value.match(regexZip)) {
      console.log('zip error');
      event.preventDefault();
      alert('Zip code must be 5 digits');

      // if the cvv number does not pass the regex prevent submission
    } else if (!cvvPayment.value.match(regexCVV)) {
      console.log('cvv error');
      event.preventDefault();
      alert('CVV must be 3 digits');

      // if the user has no items in their cart prevent submission
    } else if (totalTax.textContent === 'Tax: $0') {
      event.preventDefault();
      alert('You have no items in your cart');

      // if the user has no items in their cart prevent submission
    } else if (totalShipping.textContent === 'Shipping: $0') {
      event.preventDefault();
      alert('You have no items in your cart');

      // if the user has no items in their cart prevent submission
    } else if (totalCost.textContent === 'Subtotal: $0') {
      event.preventDefault();
      alert('You have no items in your cart');

      // submit the form
    } else {
      console.log('success');

      // send analytics information
      for (var i = 0; i < numItems; i ++) {
        var cartItem = itemStorage[`item-${i}`];
        
        // add the product
        ga('ec:addProduct', {
          'id': cartItem.productId,
          'name': cartItem.productTitle,
          'category': cartItem.productCategory,
          'brand': cartItem.productBrand,
          'variant': cartItem.productVariant,
          'price': cartItem.productPrice,
          'quantity': cartItem.productQuantity
        });

      }

      // set the action to a purchase
      ga('ec:setAction', 'purchase', {
        id: purcahseId,
        affiliation: 'Online Analytics Project',
        revenue: priceStorage.totalCost,
        tax: priceStorage.totalTax,
        shipping: priceStorage.totalShipping,
        coupon: 'DEMO'
      });

      // send the pageview
      ga('send', 'pageview');
      
      // reset local storage
      localStorage.clear();

    }
  }
}



// get items from local storage
allStorage();
// add the cart items to the page 
addCartItemsToPage(itemStorage);
// add price totals to page
addPriceTotalsToPage();



// add event listeners to the page
creditCardInput.addEventListener('keyup', checkForCardType, false);
formCheckbox.addEventListener('click', checkForDuplicateInformation, false);
submitBtn.addEventListener('click', checkoutItems, false);
formCancelButton.addEventListener('click', cancelPurchase, false);