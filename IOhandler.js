/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov 4 2021
 * Author: Sejin Oh
 *
 */

const { resolve } = require("path");
const unzipper = require("unzipper"),
fsc = require("fs"),
fs = require("fs").promises,
PNG = require("pngjs").PNG,
path = require("path");

function checkExists(grayscaled) {
  return new Promise((resolve, reject) => {
    fs.access(grayscaled)
    .then(() => resolve())
    .catch(() => {
      fs.mkdir(grayscaled) 
        .then(() => resolve())
        .catch((err) => reject(err))
    }
  )}
)};

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return fsc
    .createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }))
    .promise();
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
// if you see "this" then don't use arrow function
const readDir = (dir) => {
  return new Promise((resolve, reject) => { 
    fs.readdir(dir)
      .then((files) => {
        const pngArr = [];
        for (const png of files) {
          if (path.extname(png) === (".png")) {
            pngArr.push(png);
          }
        }
        resolve(pngArr);
      })
      .catch((err) => reject(err));
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */


const grayScale = (pathIn, pathOut) => {
  fsc
    .createReadStream(pathIn) // in.png
    .pipe(new PNG())
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          let gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
          
          this.data[idx] = this.data[idx + 1] = this.data[idx + 2] = gray
        

        }
      }

      this.pack().pipe(fsc.createWriteStream(pathOut));
    })
    .on("error", (_, err) => {
      console.log(err);
    });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
  checkExists
};