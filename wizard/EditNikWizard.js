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

const editNikWizard = new WizardScene(
  "edit",
  (ctx) => {
    try {
      ctx.reply("NIK Baru : ", batalButton());
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

        if (nikExist[0].a > 0) {
          await ctx.reply("Nik Sudah Terdaftar");
          ctx.reply("NIK :", batalButton());
        } else {
          ctx.wizard.state.nik = ctx.message.text;
          ctx.reply("Kode Akses : ", batalButton());

          return ctx.wizard.next();
        }
      }
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      console.log(err);

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

        const conn = await db.connection();

        let nik = ctx.wizard.state.nik;
        let id = ctx.update.message.from.id;

        await conn.query("update user set nik=? where id=?", [nik, id]);
        conn.release();
        await ctx.reply("Edit Nik Berhasil", removeKeyboardButton());
        home(ctx);
        return ctx.scene.leave();
      }
    } catch (err) {
      ctx.reply("Error", removeKeyboardButton());
      console.log(err);

      home(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = editNikWizard;
