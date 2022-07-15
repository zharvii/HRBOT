function mainMenuButton() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "Slip Gaji", callback_data: "m1" }]],
    },
  };
}

function registButton() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "Buat Akun", callback_data: "m2" }]],
    },
  };
}

function batalButton() {
  return {
    reply_markup: {
      keyboard: [[{ text: "Batal" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function bulanButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "Januari" }, { text: "Februari" }, { text: "Maret" }],
        [{ text: "April" }, { text: "Mei" }, { text: "Juni" }],
        [{ text: "Juli" }, { text: "Agustus" }, { text: "September" }],
        [{ text: "Oktober" }, { text: "November" }, { text: "Desember" }],

        [{ text: "Batal" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function tahunButton() {
  var y = new Date().getFullYear();

  // var t1 = y - 1;
  // var t2 = y - 2;
  // var t3 = y - 3;
  // var t4 = y - 4;

  return {
    reply_markup: {
      keyboard: [[{ text: y }], [{ text: "Batal" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function removeKeyboardButton() {
  return {
    reply_markup: {
      remove_keyboard: true,
    },
  };
}

module.exports = {
  mainMenuButton: mainMenuButton,
  batalButton: batalButton,
  bulanButton: bulanButton,
  removeKeyboardButton: removeKeyboardButton,
  tahunButton: tahunButton,
  registButton: registButton,
};
