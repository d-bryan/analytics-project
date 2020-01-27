'use strict';

// create elements for later use
const h1 = document.createElement('h1');
const mainContainer = document.getElementById('ecommerce-products');
const mainProductCartContainer = document.getElementById('products-cart-container');
const hostName = "https://d-bryan.github.io/analytics-project/";
const localHostName = "http://127.0.0.1:5500/";

var cartSubtotal = 0;
var cartTotalTax = 0;
var cartTotalShipping = 0;

/**
 * Multiplies product price by sales tax and number of products
 * @param {INTEGER} productPrice - Price of the product
 * @param {FLOAT} tax - Maryland state tax
 * @param {INTEGER} quantity - Number of products
 */
function calculateTax (productPrice, tax, quantity) {
  var total = (productPrice * tax * quantity);
  return total;
}

/**
 * Multiplies product price by shipping cost and number of products
 * @param {INTEGER} productPrice - Price of the product
 * @param {FLOAT} shipping - 10% shipping cost to be factored in
 * @param {INTEGER} quantity - Number of products
 */
function calculateShipping (productPrice, shipping, quantity) {
  var total = (productPrice * shipping * quantity);
  return total;
}

/**
 * Multiplies the number of items by the quantity of items
 * @param {INTEGER} quantity - total number of items selected
 * @param {INTEGER} price - value of the item selected
 */
function calculateCartValue (price, quantity) {
  var total = (price * quantity);
  return total;
}

/**
 * Adds the total sum of the cart together with tax
 * @param {INTEGER} cartProducts - total price of products in the cart
 * @param {INTEGER} cartTax - total sum of tax in the cart
 * @param {INTEGER} cartShipping - total sum of shipping cost in the cart
 */
function calculateSubtotalWithTaxAndShipping(cartProducts, cartTax, cartShipping) {
  return (cartProducts + cartTax + cartShipping);
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
 * Removes an item from the cart, subtracts the prices and sends an event to UA analytics
 * @param {CLICK} event - Button click event for remove from cart
 */
function removeItemFromCart(event) {

  if (event.target.tagName === 'BUTTON') {
    var sumProducts, sumTax, sumShipping;
    const total = document.getElementById('cart-subtotal');
    const totalTax = document.getElementById('cart-total-tax');
    const totalShipping = document.getElementById('cart-total-shipping');
    var productPrice = parseInt(event.target.parentNode.getAttribute('data-product-price'),10);
    var productTax = parseFloat(event.target.parentNode.getAttribute('data-product-tax'),10);
    var productShipping = parseFloat(event.target.parentNode.getAttribute('data-product-shipping'), 10);
    var productId = event.target.parentNode.getAttribute('data-product-id');
    var productTitle = event.target.nextElementSibling.nextElementSibling.textContent;
    var productCategory = event.target.parentNode.getAttribute('data-product-category');
    var productBrand = event.target.parentNode.getAttribute('data-product-brand');
    var productVariant = event.target.parentNode.getAttribute('data-product-variant');
    var productQuantity = parseInt(event.target.parentNode.getAttribute('data-product-quantity'), 10);
    
    // prevent the cart from going into negative numbers
    if (cartTotalShipping === 0 &&
        cartTotalTax === 0 && 
        cartSubtotal === 0) {
          event.preventDefault();

          // subtract the total from the cart 
        } else {

          // subtract the amounts from cart
          sumTax = cartTotalTax -= Math.ceil(calculateTax(productPrice, productTax, productQuantity));
          sumShipping = cartTotalShipping -= Math.ceil(calculateShipping(productPrice, productShipping, productQuantity));
          sumProducts = cartSubtotal -= calculateCartValue(productPrice, productQuantity);
          sumProducts = calculateSubtotalWithTaxAndShipping(cartSubtotal, cartTotalTax, cartTotalShipping);
          
          // change the text in the cart container
          totalTax.textContent = `Tax added is: $${sumTax}`;
          totalShipping.textContent = `Shipping added is: $${sumShipping}`;
          total.textContent = `Your total is: $${sumProducts}`;

          // send the ecommerce analytics for the product
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

          // remove the items from the page for the user
          while(event.target.parentNode.parentNode) {
            event.target.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.firstChild);
          }

        }

  }

}

/**
 * Adds an item to the cart, the price values and sends event to UA analytics
 * @param {CLICK} event - Button click event for add to cart
 */
function addItemToCart (event) {


  if (event.target.tagName === 'BUTTON') {
    const checkoutError = document.getElementById('checkout-error');
    var sumProducts, sumTax, sumShipping;
    const cartContainer = document.getElementById('product-cart-section');
    const total = document.getElementById('cart-subtotal');
    const totalTax = document.getElementById('cart-total-tax');
    const totalShipping = document.getElementById('cart-total-shipping');
    var productQuantity = parseInt(event.target.previousElementSibling.previousElementSibling.value, 10);
    var resetSelect = event.target.previousElementSibling.previousElementSibling;
    var productPrice = parseInt(event.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML, 10);
    var productId = event.target.parentNode.parentNode.getAttribute('data-product-id');
    var productTitle = event.target.parentNode.firstElementChild.innerHTML;
    var productDescription = event.target.parentNode.firstElementChild.nextElementSibling.innerHTML;
    var productImageLocation = event.target.parentNode.parentNode.firstElementChild.firstElementChild.src;
    var productVariant = event.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
    var productGender = event.target.parentNode.parentNode.getAttribute('data-gender');
    var productCategory = event.target.parentNode.parentNode.getAttribute('data-category');
    var productBrand = event.target.parentNode.parentNode.getAttribute('data-brand');
    var productTax = parseFloat(event.target.parentNode.parentNode.getAttribute('data-tax'), 10);
    var productShipping = parseFloat(event.target.parentNode.parentNode.getAttribute('data-shipping'), 10);

    // Template for cart items
    var cartItem = `
    <div class="cart-container">
    
    <section 
      class="cart-item" 
      data-product-price="${productPrice}"
      data-product-tax="${productTax}"
      data-product-shipping="${productShipping}"
      data-product-quantity="${productQuantity}"
      data-product-id="${productId}"
      data-product-category="${productCategory}"
      data-product-brand="${productBrand}"
      data-product-variant="${productVariant}"
      data-product-title="${productTitle}"
      data-product-description="${productDescription}"
      data-product-image-location="${productImageLocation}"
      data-product-gender="${productGender}"
    >
    <button id="remove-items-btn" class="remove-items-button">Remove</button>
        <img src="${productImageLocation}" alt="${productDescription}"/>
        <p class="product-title">${productTitle}</p>
        <p class="product-description">${productDescription}</p>
        <p class="quantity-${productTitle}">${productQuantity.toString()}</p>
        <p class="cart-color">${productVariant}</p>
      </section>
    </div>
    `;

    // if the user attempts to add nothing to their cart do not allow them
    if (productQuantity === 0) {
      event.preventDefault();
    } else {
      // set the checkout error display to none
      checkoutError.style.display = 'none';
      // otherwise add to the cart
      cartContainer.insertAdjacentHTML('beforebegin', cartItem);

      // change the values for the variables
      sumShipping = cartTotalShipping += Math.ceil(calculateShipping(productPrice, productShipping, productQuantity));
      sumTax = cartTotalTax += Math.ceil(calculateTax(productPrice, productTax, productQuantity));
      sumProducts = cartSubtotal += calculateCartValue(productPrice, productQuantity);
      sumProducts = calculateSubtotalWithTaxAndShipping(cartSubtotal, cartTotalTax, cartTotalShipping);
      // set the text for the cart
      totalTax.textContent = `Tax added is: $${sumTax}`;
      totalShipping.textContent = `Shipping added is: $${sumShipping}`;
      total.textContent = `Your total is: $${sumProducts}`;

      // send the ecommerce analytics for the product
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

      // reset the select option
      resetSelect.value = 0;

    }

  }

}


/**
 * Takes JSON and maps to template
 * @param {ARRAY} array - array of products from products.js
 */
function createProducts (array) {
  
  array.forEach((item, index) => {
    var h2 = document.createElement('h2');
    let section = document.createElement('section');
    setAttributes(section, {
      'class': 'product-card',
      'data-product-id': `${item.id}`,
      'data-gender': `${item.gender}`,
      'data-category': `${item.category}`,
      'data-brand': `${item.brand}`,
      'data-tax': `${item.tax}`,
      'data-shipping': `${item.shipping}`
    });

    // card template
    let page = `
      <div class="product-img-container">
        <img class="product-img" src="${item.imageLocation}" alt="${item.description}">
      </div>
      <div class="product-info-container">
        <p class="product-text product-title">${item.title}</p>
        <p class="product-text product-description">${item.description}</p>
        <span class="product-text product-color">${item.variant}</span>
        <span class="product-text product-price">${item.price}</span>
        <br/>
        <label class="product-label" for="${item.title}">Quantity</label>
        <select id="quantity-${item.title}" class="product-quantity">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <br/>
        <button class="add-to-cart btn">Add to Cart</button>
      </div>
    `;

    // add mens category heading to page
    if (index === 0) {
      h2.textContent = 'Men\'s';
      mainContainer.append(h2)
    }

    // add womens category heading to page
    if (index === 3) {
      h2.textContent = 'Women\'s';
      mainContainer.append(h2)
    }

    // add the content to the page
    section.innerHTML = page;
    mainContainer.append(section);

  });
}

/**
 * Creates the cart and adds text container to it
 */
function createCart () {
  var h2 = document.createElement('h2');
  var section = document.createElement('section');
  setAttributes(h2, {'id': 'product-cart-heading'});
  setAttributes(section, {'id': 'product-cart-section'});
  h2.textContent = 'Cart';

  let cart = `
  <div id="products-checkout-container">
    <p id="checkout-error">You must add items to your cart</p>
    <p id="cart-total-tax">Tax added is: ${cartTotalTax}</p>
    <p id="cart-total-shipping">Shipping added is: ${cartTotalShipping}</p>
    <p id="cart-subtotal">Your total is: ${cartSubtotal}</p>
    <button id="products-checkout">Checkout</button>
  </div>
  `;

  // set the inner html to the section
  section.innerHTML = cart;
  // append cart heading and body text to page
  mainProductCartContainer.append(h2);
  mainProductCartContainer.append(section);
}

/**
 * Sets the items in the cart to local storage to be used in the cart to show the user
 * @param {ARRAY} array - items in cart for checkout
 */
function createStorageForCheckout (array) {
  array.forEach((item, index) => {
    // localStorage.setItem(item.dataset.productTitle, JSON.stringify(item.dataset));
    localStorage.setItem( `item-${index}`, JSON.stringify(item.dataset) );
  });
}

/**
 * Proceeds the user to the checkout page, adds the items to local storage
 * @param {CLICK} event - Checkout button click
 */
function checkoutItems (event) {
  // prevent the event from bubbling to the container for remove elements
  event.stopPropagation();

  // if the target id matches the checkout button id
  if (event.target.id === 'products-checkout') {
    const checkoutError = document.getElementById('checkout-error');
    var totalZero = event.target.previousElementSibling.textContent.slice(15, 16);

    // if the total is zero do nothing and show error to user
    if (totalZero === '0') {
      event.preventDefault();
      checkoutError.style.display = 'block';

      // proceed with checkout and move to checkout page
    } else {
      const cartItems = document.querySelectorAll('section.cart-item');
      
      checkoutError.style.display = 'none';
      var totalTax = event.target.parentNode.firstElementChild.nextElementSibling.textContent.slice(15, event.target.parentNode.firstElementChild.textContent.length);
      var totalShipping = event.target.previousElementSibling.previousElementSibling.textContent.slice(20, event.target.previousElementSibling.previousElementSibling.textContent.length);
      var totalCost = event.target.previousElementSibling.textContent.slice(16, event.target.previousElementSibling.textContent.length);

      // create local storage for tax, shipping and subtotal
      localStorage.setItem('totalTax', totalTax);
      localStorage.setItem('totalShipping', totalShipping);
      localStorage.setItem('totalCost', totalCost);

      // create local storage for items in cart
      createStorageForCheckout(cartItems);

      // move the user to checkout
      window.location.href = `${hostName}checkout.html`; 
    
    }
  }
}


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

  // get the container element for the checkout after creating it
  const productsCheckoutContainer = document.getElementById('products-checkout-container');
  // add the event listener for moving items to checkout.html
  productsCheckoutContainer.addEventListener('click', checkoutItems, false);

  // clear local storage in case user returns to page
  localStorage.clear();

}




// add the event listeners to the page
mainContainer.addEventListener('click', addItemToCart, false);
mainProductCartContainer.addEventListener('click', removeItemFromCart, false);


