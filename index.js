"use strict"

var koa = require('koa')
  , app = koa()
  , common = require('koa-common')
  , route = require('koa-route')
  , serve = require('koa-static')
  , views = require('co-views')
  , render = views(__dirname + '/views', {map: {html: 'swig'}})
  , moment = require('moment');

app.use(common.favicon());
app.use(serve(__dirname + '/public', {defer: true}));
app.use(route.get('/', function*() {
  this.body = yield render('index');
}));

//appの定義が終わったあとにcallbackしないとちゃんと動かないよ。たぶん。
var server = require('http').Server(app.callback())
  , io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
    //送信者を含む全員に送信する
    io.sockets.emit('new message', {
      message: message,
      posted_at: moment().format('YYYY/MM/DD HH:mm:ss')
    });
  });
});

server.listen(3000);