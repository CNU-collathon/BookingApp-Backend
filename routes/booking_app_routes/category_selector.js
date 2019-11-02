var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {

  // MongoDB에 요청해 json 형태로 데이터를 가져와
  // 그 데이터를 바로 전송

  categoryDatas = ;
  var data = []
    categoryDatas.forEach(function(object){
      data.push({
        name : 'Dummy',
        color: '#1abc9c'
      });
    });

  // 클라이언트에 데이터를 json으로 쏨
  res.json(data);

});

module.exports = router;
