/*
 * Custom JS
 */

const locales = Shopify.theme.locales;

// Calculate Delivery Time - PDP
const calcDeliveryTime = () => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();

  const serializeDateTime = (date) => ({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    miliseconds: date.getMilliseconds(),
  });

  const dateResults = serializeDateTime(date);

  const dayOne = new Date(
    dateResults.year,
    dateResults.month,
    dateResults.day + 1,
    dateResults.hours,
    dateResults.minutes,
    dateResults.seconds,
    dateResults.miliseconds
  );

  const dayTwo = new Date(
    dateResults.year,
    dateResults.month,
    dateResults.day + 3,
    dateResults.hours,
    dateResults.minutes,
    dateResults.seconds,
    dateResults.miliseconds
  );

  const getOrdinalNumber = function (d) {
    if (d > 3 && d < 21) return "th";

    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  //estimate shipping date
  const setEstimation = () => {
    const dateResults1 = serializeDateTime(dayOne);
    const dateResults2 = serializeDateTime(dayTwo);
    const estimation = locales["products.product.delivery_time"];

    const finalEstimation = estimation
      .replace(
        "{{date1}}",
        `<strong> ${weekdays[dateResults1.weekday].substring(0, 3)} ${months[dateResults1.month]} ${
          dateResults1.day
        }</strong>`
      )
      .replace(
        "{{date2}}",
        `<strong> ${weekdays[dateResults2.weekday].substring(0, 3)} ${months[dateResults2.month]} ${
          dateResults2.day
        }</strong>`
      );

    const selector = document.querySelector(".js-calc-delivery-time");
    if (selector) selector.innerHTML = finalEstimation;
  };

  setEstimation();
};

calcDeliveryTime();

// Frequently Bought Together
const atcButton = document.querySelector(".js-ajax-add-to-cart");
const totalPriceContainer = document.querySelector(".js-section-total-price");
let checkedItems = [...document.querySelectorAll(".js-checkboxes input:checked")];
let selectedProducts = checkedItems.map((item) => ({id: item.id, quantity: 1}));

const calcTotalSum = () => {
  const productImages = [...document.querySelectorAll(".js-product-image:not(.is-hidden)")];
  const productsPrice = productImages.map((product) => Number(product.dataset.productPrice));
  const productsTotalPrice = productsPrice.reduce((prev, next) => prev + next, 0);

  totalPriceContainer.innerHTML = `Total Price: ${Shopify.formatMoney(productsTotalPrice)}`;
};

calcTotalSum();

function addItemsToCart(selectedProducts) {
  let formData = {
    items: selectedProducts,
  };
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log(response);
    })
    .then((data) => {
      console.log(data);
      console.log("item added", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

atcButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.target.parentElement.nextElementSibling.querySelector("button").click();

  addItemsToCart(selectedProducts);
});

document.querySelector(".js-checkboxes").addEventListener("change", (e) => {
  const checkedElement = e.target;
  const isCheckedCurrentElement = checkedElement.checked;
  const checkedElementProductId = e.target.id;
  const targetProduct = document.querySelector(`.js-product-image[data-product-id="${checkedElementProductId}"]`);

  if (!isCheckedCurrentElement) {
    targetProduct.classList.add("is-hidden");
  } else {
    targetProduct.classList.remove("is-hidden");
  }

  calcTotalSum();

  checkedItems = [...document.querySelectorAll(".js-checkboxes input:checked")];
  selectedProducts = checkedItems.map((item) => ({id: item.id, quantity: 1}));

  if (selectedProducts.length > 0) {
    atcButton.removeAttribute("disabled");
  } else {
    atcButton.setAttribute("disabled", "");
  }
});
