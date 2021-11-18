/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: November 4 2021
 * Author: Sejin Oh
 *
 */

const IOhandler = require("./IOhandler"),
  fs = require("fs").promises,
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;


IOhandler.checkExists(pathProcessed) 
.then(() => IOhandler.unzip(zipFilePath, pathUnzipped))
.then(() => IOhandler.readDir(pathUnzipped))
.then((pngArr) => {
  for (const pic of pngArr)
  IOhandler.grayScale(`${pathUnzipped}/${pic}`, `${pathProcessed}/NEW${pic}`)
})
.catch((err) => console.log(err));

