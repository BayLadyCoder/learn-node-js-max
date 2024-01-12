const fs = require('fs');

exports.deleteFile = (filePath) => {
  // https://nodejs.org/api/fs.html#fsunlinkpath-callback
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
