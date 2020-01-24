'use strict';

// create elements for later use
var h1 = document.createElement('h1'),
    h2 = document.createElement('h2'),
    h3 = document.createElement('h3'),
    p = document.createElement('p'),
    span = document.createElement('span'),
    img = document.createElement('img');

const mainContainer = document.getElementById('ecommerce-products');

console.log(products);
// calculateTax_addShipping(products[0].price, products[0].tax, products[0].shipping)

/**
 * Multiplies product price by sales tax, shipping percentage and then adds back into product price
 * @param {INTEGER} productPrice - Price of the product
 * @param {FLOAT} tax - Maryland state tax
 * @param {FLOAT} shipping - 10% shipping cost to be factored into price
 */
function calculateTax_addShipping (productPrice, tax, shipping) {
  return ((productPrice * tax) + (productPrice * shipping) + productPrice);
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

// id: 1,
// title: 'UA Tech &#8482;',
// description: 'Men\'s Short Sleeve Shirt',
// gender: 'Mens',
// category: 'Apparel',
// brand: 'Under Armour',
// variant: 'Black',
// price: 25.00,
// quantity: 1,
// tax: 0.06,
// shipping: 0.10,
// imageLocation: 'https://underarmour.scene7.com/is/image/Underarmour/V5-1326413-001_FC_Main?template=v65GridLarge&$wid=281&$hei=345',



function createProducts (array) {
  // var h2 = document.createElement('h2');
  array.forEach((item, index) => {
    var h2 = document.createElement('h2');
    let section = document.createElement('section');
    setAttributes(section, {
      'class': 'product-card',
      'data-product-id': `${item.id}`,
      'data-gender': `${item.gender}`,
      'data-category': `${item.category}`,
      'data-brand': `${item.brand}`
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
        <select class="product-quantity">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    `;

    if (index === 0) {
      h2.textContent = 'Men\'s';
      mainContainer.append(h2)
    }

    if (index === 3) {
      h2.textContent = 'Women\'s';
      mainContainer.append(h2)
    }

    section.innerHTML = page;
    mainContainer.append(section);

  });
}

window.onload = () => {
  // create the heading element
  mainContainer.append(h1);
  setAttributes(h1, {'id': 'main-heading'});
  h1.textContent = 'Products';

  createProducts(products);
}




















