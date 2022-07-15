const WizardScene = require("telegraf/scenes/wizard");

const { isNumberOnly } = require("../function/Validation");

const { searchFile, searchFolder } = require("../function/File");

const { checkYear } = require("../function/Date");

const {
  mainMenuButton,
  batalButton,
  bulanButton,
  removeKeyboardButton,
  tahunButton,
} = require("../Library/Button");

const { afterProsesMessage } = require("../Library/Message");
const bcrypt = require("bcrypt");

function home(ctx) {
  let msg = afterProsesMessage(ctx);
  let btn = mainMenuButton();
  ctx.reply(msg, btn);
}

function start(ctx) {
  let msg = `Hallo ${ctx.from.first_name}, Selamat datang di Layanan Bot Kepegawaian RS.Rahman Rahim. \n\nMenu :`;
  let btn = mainMenuButton();
  ctx.reply(msg, btn);
}

const slipWizard = new WizardScene(
  "slip",
  (ctx) => {
    try {
      // console.log(ctx.session);
      ctx.reply("Tahun : ", tahunButton());
      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      //Jika Batal
      if (ctx.message.text == "/start") {
        await ctx.deleteMessage();
        await ctx.reply("Back To Home", removeKeyboardButton());

        start(ctx);
        return ctx.scene.leave();
      } else if (ctx.message.text == "batal") {
        await ctx.reply("Proses Dibatalkan", removeKeyboardButton());
        home(ctx);
        return ctx.scene.leave();
      }

      //Validasi nama
      if (!isNumberOnly(ctx)) {
        ctx.reply("Input Tahun Hanya Diperbolehkan Menggunakan Angka");
        ctx.reply("Tahun :", tahunButton());
      } else if (ctx.message.text.length < 4) {
        ctx.reply("Input Minimal 4 Digit");
        ctx.reply("Tahun :", tahunButton());
      } else if (!checkYear(ctx.message.text)) {
        ctx.reply("Tahun Tidak Tersedia");
        ctx.reply("Tahun :", tahunButton());
      } else {
        ctx.wizard.state.tahun = ctx.message.text;
        ctx.reply("Bulan : ", bulanButton());

        return ctx.wizard.next();
      }
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      //Jika Batal
      if (ctx.message.text == "/start") {
        await ctx.deleteMessage();
        await ctx.reply("Back To Home", removeKeyboardButton());
        start(ctx);
        return ctx.scene.leave();
      } else if (ctx.message.text == "batal") {
        await ctx.reply("Proses Dibatalkan", removeKeyboardButton());
        home(ctx);
        return ctx.scene.leave();
      }

      let numberOfMonth = "";
      let month = ctx.message.text;
      // console.log(month);

      if (month == "januari") {
        numberOfMonth = "01";
      } else if (month == "februari") {
        numberOfMonth = "02";
      } else if (month == "maret") {
        numberOfMonth = "03";
      } else if (month == "april") {
        numberOfMonth = "04";
      } else if (month == "mei") {
        numberOfMonth = "05";
      } else if (month == "juni") {
        numberOfMonth = "06";
      } else if (month == "juli") {
        numberOfMonth = "07";
      } else if (month == "agustus") {
        numberOfMonth = "08";
      } else if (month == "september") {
        numberOfMonth = "09";
      } else if (month == "oktober") {
        numberOfMonth = "10";
      } else if (month == "november") {
        numberOfMonth = "11";
      } else if (month == "desember") {
        numberOfMonth = "12";
      } else {
        ctx.reply("Input Bulan Tidak Valid", removeKeyboardButton());
        home(ctx);
        return ctx.scene.leave();
      }

      let sTahun = ctx.wizard.state.tahun.substring(2);

      ctx.wizard.state.period = "" + numberOfMonth + sTahun;

      ctx.reply("Kode Akses : ", batalButton());

      return ctx.wizard.next();
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      //Jika Batal
      if (ctx.message.text == "/start") {
        await ctx.deleteMessage();
        await ctx.reply("Back To Home", removeKeyboardButton());

        start(ctx);
        return ctx.scene.leave();
      } else if (ctx.message.text == "batal") {
        await ctx.reply("Proses Dibatalkan", removeKeyboardButton());
        home(ctx);
        return ctx.scene.leave();
      }

      const validPassword = await bcrypt.compare(
        ctx.message.text,
        ctx.session.kd
      );
      if (!validPassword) {
        await ctx.deleteMessage();

        await ctx.reply("Kode Akses Salah");
        ctx.reply("Kode Akses :", batalButton());
      } else {
        await ctx.deleteMessage();

        let nik = ctx.session.nik;
        let period = ctx.wizard.state.period;
        // let id = ctx.update.message.from.id;

        searchFolder(period, async function (res, err) {
          if (err) {
            await ctx.reply("Error", removeKeyboardButton());
            home(ctx);
            return ctx.scene.leave();
          }

          if (res == true) {
            searchFile(period, nik, async function (fileName, error) {
              if (error) {
                await ctx.reply("Error", removeKeyboardButton());
                home(ctx);
                return ctx.scene.leave();
              }

              console.log(nik);
              console.log(period);
              console.log(fileName);

              if (fileName == "kosong") {
                await ctx.reply("File Tidak Tersedia", removeKeyboardButton());
                home(ctx);
                return ctx.scene.leave();
              } else {
                const doc = require("fs").createReadStream(
                  "D://Slip//" + period + "//" + fileName
                );

                await ctx.reply("File Ditemukan", removeKeyboardButton());

                ctx.replyWithChatAction("upload_document");

                await ctx.replyWithDocument({
                  source: doc,
                  filename: fileName,
                });

                home(ctx);
                return ctx.scene.leave();
              }
            });
          } else {
            await ctx.reply("Periode Tidak Ditemukan", removeKeyboardButton());
            home(ctx);
            return ctx.scene.leave();
          }
        });
      }
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = slipWizard;
