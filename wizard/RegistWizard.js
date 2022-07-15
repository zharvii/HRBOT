const WizardScene = require("telegraf/scenes/wizard");

const { isNumberOnly } = require("../function/Validation");

const {
  mainMenuButton,
  batalButton,
  removeKeyboardButton,
  registButton,
} = require("../Library/Button");

const { afterProsesMessage, belumTerdaftarMessage } = require("../Library/Message");

const db = require("../Library/db");

const bcrypt = require("bcrypt");

function home(ctx) {
  let msg = afterProsesMessage(ctx);
  let btn = mainMenuButton();
  ctx.reply(msg, btn);
}

function unreg(ctx) {
  let msg = belumTerdaftarMessage(ctx);
  let btn = registButton();
  ctx.reply(msg, btn);
}

function checkPass(pwd) {
  var letter = /[a-zA-Z]/;
  var number = /[0-9]/;
  var valid = number.test(pwd) && letter.test(pwd);
  return valid;
}

const registWizard = new WizardScene(
  "regist",
  (ctx) => {
    try {
      ctx.reply("NIK : ", batalButton());
      return ctx.wizard.next();
    } catch (err) {
      console.log(err);
      ctx.reply("Error", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      //Jika Batal
      if (ctx.message.text == "batal") {
        if (ctx.session.regist) {
          await ctx.reply("Dibatalkan", removeKeyboardButton());
          home(ctx);
        } else {
          await ctx.reply("Dibatalkan", removeKeyboardButton());
          unreg(ctx);
        }

        return ctx.scene.leave();
      }

      if (!isNumberOnly(ctx)) {
        ctx.reply("Input NIK Hanya Diperbolehkan Menggunakan Angka");
        ctx.reply("NIK :", batalButton());
      } else {
        const conn = await db.connection();
        let nikExist = await conn.query(
          "select count(*) as a from user where nik=?",
          [ctx.message.text]
        );

        conn.release();

        if (nikExist[0].a > 0) {
          ctx.reply("Nik Sudah Terdaftar");
          ctx.reply("NIK :", batalButton());
        } else {
          ctx.wizard.state.nik = ctx.message.text;
          await ctx.reply("Kode Akses Terdiri dari 6 Digit Angka Dan Huruf");
          ctx.reply("Kode Akses : ", batalButton());

          return ctx.wizard.next();
        }
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
      if (ctx.message.text == "batal") {
        if (ctx.session.regist) {
          await ctx.reply("Dibatalkan", removeKeyboardButton());
          home(ctx);
        } else {
          await ctx.reply("Dibatalkan", removeKeyboardButton());
          unreg(ctx);
        }

        return ctx.scene.leave();
      }

      //Validasi nama
      if (ctx.message.text.length < 6 || ctx.message.text.length > 6) {
        ctx.reply("Kode Akses Harus 6 Digit");
        ctx.reply("Kode Akses :", batalButton());
      } else {
        if (!(await checkPass(ctx.message.text))) {
          ctx.reply("Kode Akses Harus Berisi Angka Dan Huruf");
          ctx.reply("Kode Akses :", batalButton());
        } else {
          ctx.wizard.state.kd = ctx.message.text;
          await ctx.deleteMessage();

          const conn = await db.connection();
          let kdExist = await conn.query(
            "select count(*) as a from user where kdakses=?",
            [ctx.message.text]
          );

          if (kdExist[0].a > 0) {
            ctx.reply("Kode Akses Sudah Ada");
            ctx.reply("Kode Akses :", batalButton());
          } else {
            let nik = ctx.wizard.state.nik;
            let id = ctx.update.message.from.id;
            let uname = ctx.update.message.from.username;
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            let pass = await bcrypt.hash(ctx.wizard.state.kd, salt);

            await conn.query(
              "insert into user(id,uname,kdakses,nik) values(?,?,?,?)",
              [id, uname, pass, nik]
            );
            conn.release();

            await ctx.reply("Registrasi Berhasil", removeKeyboardButton());
            home(ctx);
            return ctx.scene.leave();
          }
        }
      }
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      console.log(err);

      home(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = registWizard;
