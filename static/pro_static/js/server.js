var http = require('http');
var server = http.createServer().listen(4256);
var io = require('socket.io').listen(server);
var express = require('express');
var app = express();
var appServer = http.Server(app);
var mongo = require('mongojs');
var db = mongo('serveme', ['jobs', 'bids','users', 'category', 'subcategory', 'associatedTechnician', 'userDetails']);
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectId = require('mongojs').ObjectID;
var moment = require("moment");
var sha256 = require("sha256");
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var apns = require("apns"), options, connection, notification;
var cron = require('node-cron');
var mkdirp = require('mkdirp');
 

// var smtpTransport = require('nodemailer-smtp-transport');
// var apn = require('apn'); 
// var gcm = require('node-gcm-service');
// var FCM = require('fcm-push');
// var FCM = require('fcm-push-notif');

//================================== websocket listner ========================//
io.on('connection', function (socket) {
    socket.tid = [];
    socket.on('job_post', function (data) {
        socket.join(data.uid);
    });
    socket.on('bid_post', function (data) {
        socket.join(data.jobid);
    });
});
//=============================== websocket listner end ==============================//
app.use(cors());
app.use(bodyParser.json());
appServer.listen(4257);
var secret = "HAZE MAZE SLIME LAD HOLD CLAMMY";

var unless = function(path, middleware) {
    return function(req, res, next) {
        
        if (path[0] === req.path) {
            return next();
        } else if(path[1] === req.path){
            return next();
        }else if(path[2] === req.path){
            return next();           
        }else if(path[3] === req.path){
            return next();           
        }else if(path[4] === req.path.slice(0,7)){
            return next();           
        }else {
            return middleware(req, res, next);
        }
    };
};

var app_lookup = function(req, res, next){
    var token = req.headers.token;
    // console.log(req.body.userid);
    // console.log("old : "+token);
    // var originalDecoded = jwt.decode(token, {complete: true});
    // console.log(originalDecoded)
    // var status;
    jwt.verify(token, secret, function(err, decoded){
        if(err){
            if(err.name == "TokenExpiredError"){
                // token = jwt.sign({
                //         data: {"username":username, "type":type}
                //     }, secret,{
                //         expiresIn: 60
                //     });
            }
            res.json({"status":"5", "error":err})
        }else{
            console.log(decoded);
            next();
        }
    });
}

var mailsend = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user:'transightdocs@gmail.com',
        pass:'ewgl kvhi qsbm gxry'
    }
});
var query = require('querystring');
var sendsms  = function(title, body, mob_no){
    console.log("1111111111111111" + mob_no)
    var path = "/bms/soap/Messenger.asmx/SendSmsXml?xml=<?xml%20version=%271.0%27%20encoding=%27UTF-8%27?>";
    console.log("2222222222222")
    // console.log(path)
    path += "<request>";
    path += "<bulk_msg>";
    path += "<customer_id>";
    path += "791";
    path += "</customer_id>";
    path += "<user_id>";
    path += "QIICSMS";
    path += "</user_id>";
    path += "<password>";
    path += "123456";
    path += "</password>";
    path += "<validity_period%20status=%27y%27>";
    path += "<day>2</day><hours>3</hours><mins>10</mins>";
    path += "</validity_period>";
    path += "<delivery_report>0</delivery_report>";
    path += "<message>";
    path += "<title>";
    path += title;
    path += "</title>";
    path += "<lang_id>0</lang_id>";
    path += "<body>";
    path += "<![CDATA[";
    path += body;
    path += ".QIIC]]>";
    // path += "]]>";
    path += "</body>";
    path += "<values>";
    path += "<msg_id>1</msg_id>";
    path += "<mobile_no>";
    path += mob_no;
    path += "</mobile_no>";
    path += "</values>";
    path += "</message>";
    path += "</bulk_msg>";
    path += "</request>";
    console.log(path);
    var options = {
        hostname: 'messaging.qtel.qa',
        path: path,
        method: 'GET',
        agent: false,
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Content-Length': JSON.stringify(data_pckt).length
        // }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(encoding = 'utf8');                 // send data to django app
    req.end();  
};

app.use(
    unless(
        [
            '/general/api/v1/login/', 
            '/general/api/v1/signup/', 
            '/general/api/v1/check_nationalid/',
            '/general/api/v1/check_username/',
            '/media/'
        ], app_lookup
    )
);

var customer = require('./customer.js')(app, moment, multer, db, ObjectId, mailsend, path, fs, sendsms, mkdirp);
var provider = require('./provider.js')(app, moment, db, ObjectId, multer, mkdirp);
var technician = require('./technician.js')(app, moment, db, ObjectId);
var sadmin = require('./sadmin.js')(app, moment, multer, db, ObjectId, path, fs, mkdirp);
var general = require('./general.js')(app, moment, multer, db, ObjectId, sha256, jwt, secret, path, fs, mkdirp);

cron.schedule('1 0 0 * * *', function(){
    var date = moment().subtract(1, 'days');
    var new_date = moment(date).format("DD-MM-YYYY");
    new_date = moment(new_date, "DD-MM-YYYY HH:mm:ss").toDate();
    
    db.jobs.update({"expirydate": new_date, "status": "0"},
    {$set: {"status": "8"}},
    {multi: true},
    function(err){
        if(err){
            console.log("error "+err);
        }else{
            console.log("success ");
        }
    });
});


// app.post('/sendgcm/', function (req, res){
//     var serverKey = 'AIzaSyBYhdgtXvU4NDXTiNTrj5jjQVhlBjHSjqY';
//     var fcm = new FCM(serverKey);
//     var message = {
//         to: 'cvnbM7tQMeM:APA91bFs-YrWgN0yhJjKUeIxCl4BVf8_o5jih2TkciQDn1GzkVA4ab9_wi6IOhQ7_POZh49tGE3OsGN3mQDLgdNR90OEW8zpqgEVflsQxWPencRWt0gnkYghdpKafmkl5w2Az-WBYian', // required fill with device token or topics
//         // collapse_key: 'your_collapse_key', 
//         data: {
//             "user": 'Something'
//         },
//         // notification: {
//         //     title: 'Notification',
//         //     body: 'Check notification'
//         // }
//     };

// // callback style
//     // fcm.send(message, function(err, response){
//     //     if (err) {
//     //         console.log("Something has gone wrong!");
//     //     } else {
//     //         console.log("Successfully sent with response: ", response);
//     //     }
//     // });

// // //promise style
//     fcm.send(message)
//         .then(function(response){
//             console.log("Successfully sent with response: ", response);
//             res.json("success")
//         })
//         .catch(function(err){
//             console.log("Something has gone wrong!");
//             console.error(err);
//         })
// });


// function fcm_data_notification(reg_id){
//     var serverKey = 'AIzaSyBYhdgtXvU4NDXTiNTrj5jjQVhlBjHSjqY';
//     var fcm = new FCM(serverKey);
//     var message = {
//         to: 'cvnbM7tQMeM:APA91bFs-YrWgN0yhJjKUeIxCl4BVf8_o5jih2TkciQDn1GzkVA4ab9_wi6IOhQ7_POZh49tGE3OsGN3mQDLgdNR90OEW8zpqgEVflsQxWPencRWt0gnkYghdpKafmkl5w2Az-WBYian', // required fill with device token or topics
//         // to:reg_id,
//         // collapse_key: 'your_collapse_key', 
//         data: {
//             "user": 'Something'
//         }
//     };

// // //promise style
//     fcm.send(message)
//         .then(function(response){
//             console.log("Successfully sent with response: ", response);
//             res.json("success")
//         })
//         .catch(function(err){
//             console.log("Something has gone wrong!");
//             console.error(err);
//         })
// }

// function fcm_notify_notification(reg_id){
//     var serverKey = 'AIzaSyBYhdgtXvU4NDXTiNTrj5jjQVhlBjHSjqY';
//     var fcm = new FCM(serverKey);
//     var message = {
//         to: 'cvnbM7tQMeM:APA91bFs-YrWgN0yhJjKUeIxCl4BVf8_o5jih2TkciQDn1GzkVA4ab9_wi6IOhQ7_POZh49tGE3OsGN3mQDLgdNR90OEW8zpqgEVflsQxWPencRWt0gnkYghdpKafmkl5w2Az-WBYian', // required fill with device token or topics
//         // to:reg_id,
//         // collapse_key: 'your_collapse_key', 
//         notification: {
//             title: 'Notification',
//             body: 'Check notification'
//         }
//     };

// // //promise style
//     fcm.send(message)
//         .then(function(response){
//             console.log("Successfully sent with response: ", response);
//             res.json("success")
//         })
//         .catch(function(err){
//             console.log("Something has gone wrong!");
//             console.error(err);
//         })
// }




