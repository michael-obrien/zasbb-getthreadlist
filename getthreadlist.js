'use strict';

var timeConvert = require('./time-convert');

var threadList = {
  title: [],
  postids: [],
  id: [],
  lastpost: [],
  author: [],
  parentid: []
};

var seneca = require('seneca')();

seneca.listen(10105); //requests from Hapi REST
seneca.client(10101); //requests to Directory Services

var userLevel = 6; //0 Public, //3 User, //6 Admin

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

seneca.add({role: "get",cmd: "threadlist"}, function( msg, respond) {

  seneca.act({role:"list",cmd:"threads",id:msg.id},function(err, result) {
    if (err) {
      //handleme
    }
    var sorted = sortByKey(result.listing, 'lastpostwhen');

    threadList.title = [];
    threadList.postids = [];
    threadList.id = [];
    threadList.lastpost = [];
    threadList.author = [];
    threadList.parentid = [];
    //console.log(sorted[0].lastpostwhen);
    sorted.forEach(function (item) {
      threadList.title.push(item.title);
      threadList.postids.push(item.postids);
      threadList.id.push(item.id);
      threadList.lastpost.push(timeConvert(item.lastpostwhen));
      threadList.author.push(item.author);
      threadList.parentid.push(item.parentid);
    });

    console.log(sorted);
    respond ( null, threadList);
  });
});
