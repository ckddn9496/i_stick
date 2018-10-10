const express = require('express');
const mysql = require('mysql');
// const bodyParser = require('body-parser');  //  for post (req.body.*)

var app = express();
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '111111',
  database: 'i_stick'
});

conn.connect(); //  database 접속
app.use(express.urlencoded({ extended: false }))
// var jsonParser = bodyParser.json()
app.use(express.json());
// parse various different custom JSON types as JSON
// app.use(bodyParser.json())
// app.use(bodyParser.json({ type: 'application/*+json' }))
// parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))
//  app.post에서 req.body 체크해보기



//   from login page
// {id,pw,type}
app.post('/login', (req, res) => {
  console.log('/login');
  const inputData = req.body;
  console.log(inputData);
  var sql = '';
  if (inputData.type === 0) {  //  user
    sql = 'SELECT * FROM user WHERE id=?';
  } else if (inputData.type === 1) {  //  parent
    sql = 'SELECT * FROM parent WHERE id=?';
  }
  console.log(sql);
  conn.query(sql, inputData.id, function(err, datas, fields) {
    console.log(datas);
    // console.log(fields);
    if (err) {
      console.log('Error!');
      res.send('Error!');
    } else if (datas[0] == null) {
      console.log('unknown ID');
      res.send('unknown ID');
    } else if (inputData.pw === datas[0].pw){
      let info = {
        no: datas[0].no,
        id: datas[0].id
      };
      res.json(info);
    } else {
      console.log('wrong Password');
      res.send('wrong Password');
    }
  });
});

//  id check
app.post('/check/id', function(req, res) {  //  id, type
  console.log('/check/id');
  const inputData = req.body;
  console.log(inputData);
  var sql = '';
  if (inputData.type === 0) {  //  user
    sql = 'SELECT * FROM user WHERE id=?';
  } else if (inputData.type === 1) {  //  parent
    sql = 'SELECT * FROM parent WHERE id=?';
  }
  conn.query(sql, inputData.id, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data[0]);
      res.send(data[0]);
    }
  });
});

app.post('/register', function(req, res) {  //  id pw name mobile type
  console.log('/register');
  //  register data from android and INSERT in Database
  const inputData = req.body;
  console.log(inputData);
  var sql = '';
  if (inputData.type === 0) {  //  user
    sql = 'INSERT INTO user (id, pw, name, mobile) VALUES (?,?,?,?);';
  } else if (inputData.type === 1) {  //  parent
    sql = 'INSERT INTO parent (id, pw, name, mobile) VALUES (?,?,?,?);';
  }
  conn.query(sql, [inputData.id, inputData.pw, inputData.name, inputData.mobile], function(err, data) {
    if (err) {
      console.log(err);
      res.send('failed the ID creation...')
    } else {
      console.log(data[0]);
      res.send(inputData.id);
    }
  });
});

//  implement
//  user mode
//  user login -> client(user) send location periodically
app.post('/user/navigate', function(req, res) { //  길찾기 모드
  //  get data from user's application

});

// user main : send current location to Server 1008
app.post('/user', function(req, res) {
  console.log('/user');
  const inputData = req.body; //  longitude, latitude
  var uno = inputData.no;
  var longitude = inputData.longitude;
  var latitude = inputData.latitude;
  var sql = 'INSERT INTO user_location (no, longitude, latitude) VALUES (?, ?, ?)'
  // INSERT INTO user_location (no, longitude, latitude) VALUES ('2',13,13);
  // 2018-10-08 23:30:59 |  2 |        13 |       13
  conn.query(sql, [uno, longitude, latitude], function(err, datas, fields) {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.send('OK');  //  저장후 안전하게 완료되었다고 응답.
    }
  });
});

// parent mode
// parent login -> client(parent)
// can request registing the user using user's id, pw
// ParentActivity에서 '내 정보 수정' 버튼 클릭시 이동, 비밀번호 수정
app.post('/parent/edit', function(req, res) {
  /*  form : id, recent pw, new pw (비밀번호 확인은 android 책임)*/
  console.log('/parent/edit');
  const inputData = req.body; //  id, oldpw, newpw
  console.log(inputData); //  data check
  var id = inputData.id;
  var oldpw = inputData.oldpw;
  var newpw = inputData.newpw;
  /*  oldpw가 일치하면 UPDATE, 일치하지 않으면 send error msg */
  var sql = 'SELECT pw FROM parent WHERE id=?'
  conn.query(sql, inputData.id, function(err, pw) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {  //  id 는 무조건 존재한다. query 의 결과는 하나가 나옴
      if (pw[0].pw != oldpw) { //  비밀번호 불일치
        console.log('Wrong Password');
        res.send('Wrong Password');
      } else {  //  비밀번호 일치 -> 변경
        var sql = 'UPDATE parent SET pw=? WHERE id=?'
        conn.query(sql, [newpw, id], function(err, results) {
          if (err) {
            console.log(err);
            res.send('Error');
          } else {
            console.log(results);
            console.log('change completed!!');
            res.send('OK');
          }
        })
      }
    }
  });
}); //  내 정보 수정


//  ParentActiviy에서 getUserInfo함수 호출, 서버로 부터 해당 no의 parent가 관리하는 user의 정보를 받아와 List에 담는다.
app.post('/parent', function(req, res) {  //  /parent 1008
  console.log('/parent');
  const inputData = req.body;  //  pno, id 받아오기
  console.log(inputData);
  //  ParnetActivity : getUserList(String pid) = 담당하는 user의 목록 불러오기
  var sql = 'SELECT * FROM rpu WHERE pno=?'
  conn.query(sql, inputData.pno, function(err, results, fields) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {  //  results : RowDataPacket형태
      var num = results.length;
      if (num === 0) {
        res.send('no registed user...');  //  맡고있는 user가 없을때
      } else {  //  있을 때
        var sql = 'SELECT * FROM user WHERE ';
        for (var i = 0; i < num; i++){
          sql = sql + 'no=\'' + results[i].uno + '\'';
          if (i+1 != num)
            sql = sql + ' or ';
        }
        console.log(sql);
        conn.query(sql, function(err, userInfo, fields) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            console.log(userInfo);  //  JSONArray
            res.send(userInfo);
          }
        });
      }
    }
  });
});



app.listen(5555, () => {  //  portNum
  console.log('Example app listening on port 5555!');
});