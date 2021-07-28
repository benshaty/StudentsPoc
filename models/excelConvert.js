const XLSX = require('xlsx');
const fs = require('fs').promises;

async function getJsonFromExcel(fileBuffer) {
    console.log(fileBuffer.path);
    try {
        // read file
        let workbook = XLSX.readFile(fileBuffer.path);

        // read first sheet (identified by first of SheetNames)
        let sheet = workbook.Sheets[workbook.SheetNames[0]];

        // convert to JSON
        let json = XLSX.utils.sheet_to_json(sheet);

        // write to console the resualt
        console.log(json);

        // delete the file
        (async () => {
            try {
              await fs.unlink(fileBuffer.path);
            } catch (e) {
              // file doesn't exist, no permissions, etc..
              // full list of possible errors is here 
              // http://man7.org/linux/man-pages/man2/unlink.2.html#ERRORS
              console.log(e);
            }
          })();
        //return the json
        return json;
    } catch (err) {
        console.log(err);
    }
    
}

module.exports = {
    "getJsonFromExcel" : getJsonFromExcel
}