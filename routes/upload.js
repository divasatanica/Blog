const express = require('express');
const router = express.Router();
const multi = require('multiparty');
const fs = require('fs');

/* GET users listing. */
router.post('/image/', (req, res) => {
  let form = new multi.Form();
  saveFiles(req);
  function saveFiles(req){
    let response = [];
    form.parse(req, (err, fields, files) => {
      let fileArr = files.files;
      if(!fileArr){
        return response;
      }
      for(let i = 0;i < fileArr.length;i ++) {
        let file = fileArr[i];
        let pathInfo = ((path) => {
          let oriPath = path.split('\\').join('/');
          let filename = path.split('\\').pop();
          let destPath = "./public/upload/img";
          return {
            "filename": filename,
            "destPath": destPath,
            "oriPath": oriPath
          };
        })(file.path);
        if(!fs.existsSync(pathInfo.destPath)){
          fs.mkdir(pathInfo.destPath, () => {
            console.log(`The Content ${pathInfo.destPath} Has Been Created!`);
          });
        }
        let destPath = `${pathInfo.destPath}/${pathInfo.filename}`;
        fs.writeFileSync(destPath, fs.readFileSync(pathInfo.oriPath));
        let url = `http://localhost:3000/upload/img/${pathInfo.filename}`;
        response.push({
          "url": url,
          "originalName": file.originalFilename
        });
        fs.unlinkSync(pathInfo.oriPath);
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.send(response); 
    });
  }
});

module.exports = router;