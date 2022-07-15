function afterProsesMessage(ctx) {
  return `Silahkan Clear Histori/Bersihkan Riwayat untuk menjaga Privasi dan Optimasi Bot \nMenu :`;
}

// function afterProsesMessage(ctx) {
//   return `Hallo ${ctx.from.first_name}, Selamat datang di Layanan Bot Kepegawaian RS.Rahman Rahim.\nSilahkan Clear Histori/Bersihkan Riwayat Untuk Lebih Optimal`;
// }

function belumTerdaftarMessage(ctx) {
  return `Hallo ${ctx.from.first_name}, anda belum teregistrasi. Silahkan registrasi terlebih dahulu ya \nMenu :`;
}

module.exports = {
  afterProsesMessage: afterProsesMessage,
  belumTerdaftarMessage: belumTerdaftarMessage,
};
