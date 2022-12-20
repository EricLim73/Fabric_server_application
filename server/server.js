const express = require('express');
const app = express();
const { db } = require('./firebase.js'); // firebase.js 임포트
const crypto = require("crypto"); // 해시 함수를 위해, npm install crypto --save로 crypto 설치 필요

var path = require('path');
var sdk = require('./sdk.js');

var http = require('http');
var bodyParser = require('body-parser');
 

app.use(express.json());
let cors = require('cors');
const { send } = require('./sdk.js');
app.use(cors());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./controller.js')(app);
app.use(express.static(path.join(__dirname, '../app')));

var port = 9090;
var HOST = 'localhost';

app.listen(port,function(){
  console.log(`Live on port: http://${HOST}:${port}`);
});
 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../app/main.html'));
});

app.get('/request', function (req, res) {
  res.sendFile(path.join(__dirname, '../app/request.html'));
});


app.post('/dataAdd', async (req, res) => {
  // 데이터의 추가
  const { userUID, name, phone, sex, birth, address, LRName, relation, LRPhone, agencyName } = req.body;
    
    const dataSample = {
      // json 형식으로 데이터 제작
      성명: name,
      연락처: phone,
      성별: sex,
      생년월일: birth,
      주소: address,
      법정대리인_성명: LRName,
      법정대리인_연락처: LRPhone,
      기증자와의_관계: relation,
      기관명칭: agencyName,
    };
    const dataSampleJSON = JSON.stringify(dataSample);

    const hashedDataSample = crypto
    .createHash("sha512")
    .update(dataSampleJSON)
    .digest("base64");
  console.log(hashedDataSample); // 해쉬 결과 1 

  await db
  .collection('people')
  .doc(userUID)
  .set({
    hashData: hashedDataSample,
  });

  res.status(200).send()

});

// 인체유래물 저장
app.get('/materialAdd', async (req, res) => {
  // 데이터의 추가
  //const {User_UID} = req.body;
  var User_UID = req.query.UID;
  var Material = req.query.Material;
  var medicalRecord = req.query.medicalRecord
  
  await db
    .collection('material')
    .doc(User_UID) // 나중에 이 부분을 user의 UID로 바꿀 것
    .set({
      // 대괄호를 사용, 데이터를 집어넣는다
      UID: User_UID,
      인체유래물: Material,
      임상정보: medicalRecord
    });
    
    const dataSample = {
      // json 형식으로 데이터 제작
      UID: User_UID,
      인체유래물: Material,
      임상정보: medicalRecord,
    };

    const dataSampleJSON = JSON.stringify(dataSample);
    const hashedDataSample = crypto // 만든 데이터를 crypto를 이용, sha512 방식으로 암호화(해시)
    .createHash("sha512")
    .update(dataSampleJSON)
    .digest("base64");
  console.log(hashedDataSample); // 해쉬 결과 1 
  res.status(200).send("해당 기증자의 인체유래물 정보를 성공적으로 저장하였습니다.")
});


app.post('/QueryPartial', (req, res) => {
  let {uid} = req.body;
  console.log(uid);
  let args = [uid];
  sdk.send(false, 'queryPartial', args, res);
  
});

app.post('/withDrawn', (req, res) => {
  let {index, userDataInfoArray} = req.body; 
  for(let x of userDataInfoArray){
    if (x.idx === index){
      let args = [x.Record.User_UID, x.Record.TimeStamp, x.Record.Institute]
      console.log('withDra11111',args);
      sdk.send(true, 'withDraw', args, res)
      break;      
    }
  }
});

app.post('/Accept', (req, res) => {
  let {index, userDataInfoArray} = req.body; 
  for(let x of userDataInfoArray){
    if (x.idx === index){
      let args = [x.Record.User_UID, x.Record.TimeStamp, x.Record.Institute] 
      sdk.send(true, 'accept', args, res)
      break;      
    }
  }
  
});

app.post('/Reject', (req, res) => {
  let {index, userDataInfoArray} = req.body; 
  for(let x of userDataInfoArray){
    if (x.idx === index){
      let args = [x.Record.User_UID, x.Record.TimeStamp, x.Record.Institute] 
      sdk.send(true, 'reject', args, res)
      break;      
    }
  }
});


app.post('/Expire', (req, res) => {
  let {expiredReq} = req.body; 
  let args = [expiredReq.User_UID,expiredReq.TimeStamp,expiredReq.Institute]; 
  sdk.send(true, 'expire', args, res);

});

app.post('/requesting', (req, res) => {
  var requester = req.query.requester;
  var uid = req.query.uid;
  var institute = req.query.institute;
  var usage = req.query.usage;
  let args = [requester, uid, usage, institute];
 
  sdk.send(true, 'expire', args, res);

});