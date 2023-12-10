const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require("fs")
const path = require('path')
const app = express()
// const {rimraf} = require('rimraf')
// var uploadsDir = __dirname + "/public/uploads";
// setInterval(() => {
//     fs.readdir(uploadsDir, function (err, files) {
//         files.forEach(function (file, index) {
//             fs.stat(path.join(uploadsDir, file), function(err, stat) {
//                 var endTime, now;
//                 if (err) {
//                     return console.error(err);
//                 }
//                 now = new Date().getTime();
//                 endTime = new Date(stat.ctime).getTime() + 60000;
//                 if(now > endTime) {
//                     return rimraf(path.join(uploadsDir, file), function (err) {
//                         if (err) {
//                             return console.error(err);
//                         }
//                         console.log("successfully deleted");
//                     });
//                 }
//             });
//         });
//     });
// },2000);
app.use(express.static(path.join(__dirname + "public/uploads")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    },
});
const upload = multer({storage:storage}).single('file')
app.set('view engine', 'ejs')
app.get('/', (req, res)=>{
    res.render('index')
})
app.post("/uploadfile",(req,res)=>{
    upload(req,res,(err)=>{
        if (err){
            console.log(err)
        }
        else{
            console.log(req.file.path)
            res.json({
                path:req.file.filename
            })
        }
    })
})
app.get('/files/:id', (req, res)=>{
    console.log(req.params.id)
    res.render('displayfile',{path:req.params.id})
})
app.get("/download", (req, res)=>{
    var pathoutput = req.query.path;
    console.log(pathoutput);
    var fullpath = path.join(__dirname,pathoutput);
    res.download(fullpath,(err)=>{
        if(err){
            res.send(err);
        }
    });
});
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("App is listening on port 5000")
});