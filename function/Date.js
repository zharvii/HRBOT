function getDateNow(time, dateSeparator) {
  if (time) {
    let currentdate = new Date();
    return (
      currentdate.getDate() +
      dateSeparator +
      (currentdate.getMonth() + 1) +
      dateSeparator +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds()
    );
  } else {
    var now = new Date();
    let years = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month.toString().length == 1) {
      month = "0" + month;
    }

    if (day.toString().length == 1) {
      day = "0" + day;
    }
    return years + dateSeparator + month + dateSeparator + day;
  }
}

function yyyyMMDD(date) {
  return (formated = date.split("-").reverse().join("-"));
}

function checkYear(year) {
  var y = new Date().getFullYear();

  // var t1 = y - 1;
  // var t2 = y - 2;
  // var t3 = y - 3;
  // var t4 = y - 4;

  if (year != y.toString()) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  getDateNow: getDateNow,
  yyyyMMDD: yyyyMMDD,
  checkYear: checkYear,
};
