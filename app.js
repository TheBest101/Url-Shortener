const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl.js')

app.use(bodyParser.json());
app.use(cors());
//process.env.MONGOLAB_URI || 'mongodb://localhost/shortUrls'
mongoose.connect('mongodb://HelloWorld:TheBest101@ds149491.mlab.com:49491/url-shortening-alexander');


app.get('/new/:urlToShorten(*)', (req, res) => {
  //ES5 version = var urlToShorten = req.params.urlToShorten
  var { urlToShorten } = req.params
  console.log(urlToShorten);
  var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.#?&//=]*)?/gi;
  if(regex.test(urlToShorten)===true){
    var short = Math.floor(Math.random()*100000).toString();
    console.log(short);
    var data = new shortUrl(
      {
        originalUrl: urlToShorten,
        shortUrl: short
      }
    );
    console.log(data);
    data.save(err=>{
      if(err){
        return res.send('Error saving to database');
      }
    });
    return res.json({data})
  }else{
    return res.json({
      originalUrl: urlToShorten,
      shortUrl: null,
      error: true
    })
  }
}); //(*) for resolve http issue

app.get('/url/:urlToFoward', (req, res)=>{
  var shorterUrl = req.params.urlToFoward;
  shortUrl.findOne({'shortUrl': shorterUrl}, function(err, data){
    var re = new RegExp("^(http|https)://", "i");
    var strToCheck = data.originalUrl;
    if(re.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    }else{
      res.redirect(301, "http://" + data.originalUrl);
    }
  })
})

//frontEnd
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3000, () => { //process.env.PORT for heroku
  console.log('Working'); //ES6 version
});
