const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const { TELEGRAM } = require("./config");

const {
  afterProsesMessage,
  belumTerdaftarMessage,
} = require("./Library/Message");
const { mainMenuButton, registButton } = require("./Library/Button");

const { getDateNow } = require("./Function/Date");

const slipWizard = require("./Wizard/SlipWizard");
const registWizard = require("./Wizard/RegistWizard");
const editNikWizard = require("./Wizard/EditNikWizard");

const db = require("./Library/db");

const bot = new Telegraf(TELEGRAM.Token);
bot.use(session());

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log(bot_informations.username + " Ready");
});

bot.use((ctx, next) => {
  if (ctx.message && typeof ctx.message.text !== "undefined") {
    ctx.message.text = ctx.message.text.toLowerCase();
  }

  try {
    const type = ctx.updateType;
    const subTypes =
      ctx.updateSubTypes.length == 0 ? "Action" : ctx.updateSubTypes[0];
    const dateTime = getDateNow(true, "-");
    const chat_from = `(UserID: ${ctx.from.id}) (Username : ${ctx.from.username})`;
    console.log(ctx.from);
    console.log(
      `Chat from ${chat_from} (Type : ${type}) (SubType : ${subTypes}) (Response Time: ${dateTime})`
    );
  } catch (e) {
    console.log(e);
  }

  return next(ctx);
});

const stage = new Stage([registWizard, editNikWizard, slipWizard]);
bot.use(stage.middleware());

bot.start(async (ctx) => {
  const conn = await db.connection();
  let userExist = await conn.query(
    "select count(*) as a from user where id=?",
    [ctx.from.id]
  );

  conn.release();

  let startID = ctx.update.message.message_id;

  if (userExist[0].a == 0) {
    if (ctx.from.username == undefined || ctx.from.username == null) {
      await ctx.reply(
        "Username Telegram ada belum dibuat, silahkan masuk ke pengaturan telegram dan buat username telegram anda"
      );
      let msg = belumTerdaftarMessage(ctx);
      await bot.telegram.sendMessage(ctx.chat.id, msg, registButton());
      ctx.deleteMessage(startID);
    } else {
      ctx.session.regist = false;
      let msg = "<b>Registrasi</b>";
      await ctx.replyWithHTML(msg);
      await ctx.deleteMessage(startID);

      ctx.scene.enter("regist");
    }
  } else {
    let msg = `Hallo ${ctx.from.first_name}, Selamat datang di Layanan Bot Kepegawaian RS.Rahman Rahim. \n\nMenu :`;
    await bot.telegram.sendMessage(ctx.chat.id, msg, mainMenuButton());
    ctx.deleteMessage(startID);
  }
});

bot.action("m1", async (ctx) => {
  const conn = await db.connection();
  let nikLama = await conn.query("select * from user where id=?", [
    ctx.from.id,
  ]);

  await ctx.deleteMessage();

  ctx.session.kd = nikLama[0].kdakses;
  ctx.session.nik = nikLama[0].nik;

  let msg = "<b>Silahkan Isi Form Berikut</b>";
  await ctx.replyWithHTML(msg);
  ctx.scene.enter("slip");
});

bot.action("m2", async (ctx) => {
  const conn = await db.connection();
  let userExist = await conn.query(
    "select count(*) as a from user where id=?",
    [ctx.from.id]
  );

  conn.release();

  if (userExist[0].a == 0) {
    if (ctx.from.username == undefined || ctx.from.username == null) {
      await ctx.reply(
        "Username Telegram ada belum dibuat, silahkan masuk ke pengaturan telegram dan buat username telegram anda"
      );
      let msg = belumTerdaftarMessage(ctx);
      bot.telegram.sendMessage(ctx.chat.id, msg, registButton());
    } else {
      ctx.session.regist = false;
      let msg = "<b>Registrasi</b>";
      await ctx.replyWithHTML(msg);
      ctx.scene.enter("regist");
    }
  } else {
    await ctx.reply("Anda Sudah Teregistrasi");
    let msg = afterProsesMessage(ctx);
    bot.telegram.sendMessage(ctx.chat.id, msg, mainMenuButton());
  }
});

bot.command("edit", async (ctx) => {
  const conn = await db.connection();
  let userExist = await conn.query(
    "select count(*) as a from user where id=?",
    [ctx.from.id]
  );

  if (userExist[0].a == 0) {
    ctx.session.regist = false;
    let msg = belumTerdaftarMessage(ctx);
    bot.telegram.sendMessage(ctx.chat.id, msg, registButton());
  } else {
    ctx.session.regist = true;

    let msg = "<b>Edit Nik</b>";

    let nikLama = await conn.query("select * from user where id=?", [
      ctx.from.id,
    ]);

    ctx.session.kd = nikLama[0].kdakses;

    await ctx.replyWithHTML(msg);

    await ctx.reply("NIK Lama :" + nikLama[0].nik);

    conn.release();

    ctx.scene.enter("edit");
  }
});

bot.startPolling();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.catch(async (err, ctx) => {
  console.log("Ooops", err);
  await ctx.reply("Mohon Maaf Bot Error");
  ctx.reply("Silahkan Clear Histori/Bersihkan Riwayat Lalu Start Bot Kembali");
});
