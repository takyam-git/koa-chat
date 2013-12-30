"use strict";
(function ($, _, io) {
  var socket = io.connect('http://localhost:3000')
    , templates = {
      row: _.template('<div class="row"><div class="col-md-8"><%- message %></div><div class="col-md-4"><%- posted_at %></div></div>')
    }
    , is_connected = false
    , $label_online = null
    , $label_offline = null
    , $form = null
    , $input = null
    , $rows = null;

  //DOMの取得とか
  $(function () {
    $label_online = $('#label-online');
    $label_offline = $('#label-offline');
    $form = $('#form');
    $input = $('#input');
    $rows = $('#rows');

    $form.on('submit', form_submitted);

    change_status();
  });

  //接続状態のステータスラベルのオンライン・オフラインを切り替える
  var change_status = function () {
    if ($label_online && $label_offline) {
      if (is_connected) {
        $label_online.show();
        $label_offline.hide();
      } else {
        $label_online.hide();
        $label_offline.show();
      }
    }
  };

  //メッセージの送信
  var form_submitted = function (event) {
    event.preventDefault();
    socket.emit('message', $input.val());
    $input.val('');
  };

  //socket.io接続時
  socket.on('connect', function () {
    is_connected = true;
    change_status();
  });

  //socket.io切断時
  socket.on('disconnect', function () {
    is_connected = false;
    change_status();
  });

  //新しいメッセージ受信時
  socket.on('new message', function (data) {
    $rows.append(templates.row({message: data.message, posted_at: data.posted_at}));
  });


})(jQuery, _, io);