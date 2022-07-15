function isNumberOnly(ctx) {
  const regex = /^\d+$/;
  if (ctx.message.text.match(regex)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isNumberOnly: isNumberOnly,
};
