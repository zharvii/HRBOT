const fs = require("fs");

const dir = "D://Slip";

function searchFolder(folder, callback) {
  fs.readdir(dir, (err, files) => {
    var exist = false;

    files.forEach((file) => {
      if (file.toString() == folder) {
        exist = true;
        return;
      }
    });

    callback(exist, err);
  });
}

function searchFile(periode, nik, callback) {
  fs.readdir(dir + "//" + periode, (err, files) => {
    var fileName = "kosong";

    files.forEach((file) => {
      let s = file.split("-");
      if (s[1] == nik) {
        fileName = file;
        return;
      }
    });

    callback(fileName, err);
  });
}

module.exports = {
  searchFile: searchFile,
  searchFolder: searchFolder,
};
