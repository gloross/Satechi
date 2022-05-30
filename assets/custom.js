/*
* Custom JS
*/

const locales = Shopify.theme.locales;

// Calculate Delivery Time - PDP
const calcDeliveryTime = () => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

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
  ]

  const date = new Date()

  const serializeDateTime = date => ({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    miliseconds: date.getMilliseconds()
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

  const getOrdinalNumber = function(d) {
    if (d > 3 && d < 21) return 'th';

    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  //estimate shipping date
  const setEstimation = () => {
    const dateResults1 = serializeDateTime(dayOne);
    const dateResults2 = serializeDateTime(dayTwo);
    const estimation = locales['products.product.delivery_time'];

    const finalEstimation = estimation
      .replace('{{date1}}', `<strong> ${weekdays[dateResults1.weekday].substring(0, 3)} ${months[dateResults1.month]} ${dateResults1.day}</strong>`)
      .replace('{{date2}}', `<strong> ${weekdays[dateResults2.weekday].substring(0, 3)} ${months[dateResults2.month]} ${dateResults2.day}</strong>`);

    const selector = document.querySelector('.js-calc-delivery-time');
    if (selector) selector.innerHTML = finalEstimation;
  }

  setEstimation()
}

calcDeliveryTime();
