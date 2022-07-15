const selectors = {
  sectionShippingProtection: ".js-section-shipping-protection",
  productCheckbox: ".js-product-checkbox",
  shippingProtectionPrice: ".js-shipping-protection-price",
};

const sections = document.querySelectorAll(selectors.sectionShippingProtection);

sections.forEach((section) => {
  const productHandle = section.dataset.productHandle;
  const productCheckbox = section.querySelector(selectors.productCheckbox);

  const init = function () {
    if (!section) {
      return;
    }

    function moveSection() {
      const sectionShippingMethod = document.querySelector(".section--shipping-method");
      sectionShippingMethod.parentNode.insertBefore(section, sectionShippingMethod);
    }

    moveSection();

    function addItemToCart(productId) {
      let formData = {
        items: [
          {
            id: productId,
            quantity: 1,
          },
        ],
      };
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          window.location.reload();
        })
        .then((data) => {
          console.log("item added", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function removeItemFromCart(productId) {
      let productIdJSON = JSON.parse('{"' + productId + '": 0}');
      let updateData = {
        updates: productIdJSON,
      };
      fetch("/cart/update.js", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then(function (data) {
          console.log(data.status, data.body);
          if (data.status == 200) {
            window.location.reload();
          } else {
            console.error("Request returned an error", data);
          }
        })
        .catch(function (error) {
          console.error("Request failed", error);
        });
    }

    function checkboxChange(element, data) {
      element.addEventListener("change", (e) => {
        console.log(e);
        if (element.checked) {
          addItemToCart(data.variants[0].id);
        } else {
          removeItemFromCart(data.variants[0].id);
        }
      });
    }

    function fetchProduct(productHandle) {
      let productUrl = "/products/" + productHandle + ".js";
      fetch(productUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          checkboxChange(productCheckbox, data);
          section.querySelector(selectors.shippingProtectionPrice).innerHTML = `${Shopify.formatMoney(data.price)}`;
        });
    }

    fetchProduct(productHandle);
  };

  init();
});
