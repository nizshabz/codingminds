
module.exports =function(app, moment, multer, db, ObjectId, path, fs, mkdirp){
    var CategoryImageStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
        var dest = './media/category';
        mkdirp(dest, function (err) {
                if (err) callback(err, dest);
                else callback(null, dest);
        });
    },
        filename: function (req, file, callback) {
            var name_array = file.originalname.split(".")
            var image_name = name_array[0].replace(/ /g,"-")+Date.now()+'.'+name_array[1]
            callback(null, image_name);
        }
    });
    var CategoryImageUpload = multer({ storage : CategoryImageStorage}).single('image');

    app.post('/sadmin/api/v1/create_category/', function(req, res){
        var data;
        CategoryImageUpload(req,res,function(err) {
            if(err) {
                res.json({"status":"0","error":err});
            }else{
                data = req.body;
                data['image'] = '/' + req.file.path;
                db.category.save(data, function (err, saved) {
                    if (err || !saved) {
                        status = "0";
                        console.log('not saved');
                        res.json({"status": status, "error":err});
                    } else {
                        status = "1";
                        console.log("saved");
                        res.json({"status": status, "error":"", "categoryid": saved._id});
                    }
                });
            }
        });
    });

    app.post('/sadmin/api/v1/update_category/', function(req, res){
        var data;
        CategoryImageUpload(req,res,function(err) {
            if(err) {
                res.json({"status":"0","error":err});
            }else{
                db.category.findOne({_id:ObjectId(req.body.categoryid)},
                {
                    _id:0,
                    image:1
                },function(err, doc){
                    if(doc){
                        if(doc.image != ""){
                            fs.unlink('.'+doc.image);
                        }
                    }
                    db.category.update(
                        {_id:ObjectId(req.body.categoryid)},
                        {$set:
                            {
                                name:req.body.name,
                                description:req.body.description,
                                image:'/' + req.file.path
                            }
                        },function(err){
                            if(err){
                                res.json({"status":"0", "error":err})
                            }else{
                                res.json({"status":"1", "error":""})
                            }
                        }
                    )
                });
            }
        });
    });

    app.get('/sadmin/api/v1/category_details/:category', function(req, res){
        var category = req.params.category;
        db.category.findOne(
            {_id:ObjectId(category)},
            function(err, doc){
                if(err){
                    res.json({"status":"0", "error":err})
                }
                else{
                    res.json({"status":"0", "error":"", "data":doc})
                }
            }
        );
    });

    app.post('/sadmin/api/v1/create_subcategory/', function(req, res){
        var data;
        CategoryImageUpload(req,res,function(err) {
            if(err) {
                res.json({"status":"0","error":err});
            }else{
                data = req.body;
                data['image'] = '/' + req.file.path;
                db.subcategory.save(data, function (err, saved) {
                    if (err || !saved) {
                        status = "0";
                        console.log('not saved');
                        res.json({"status": status, "error":err});
                    } else {
                        status = "1";
                        console.log("saved");
                        res.json({"status": status, "error":"", "subcategoryid": saved._id});
                    }
                });
            }
        });
    });

    app.post('/sadmin/api/v1/update_subcategory/', function(req, res){
        var data;
        CategoryImageUpload(req,res,function(err) {
            if(err) {
                res.json({"status":"0","error":err});
            }else{
                db.subcategory.findOne({_id:ObjectId(req.body.subcategory)},
                {
                    _id:0,
                    image:1
                },function(err, doc){
                    if(doc){
                        if(doc.image != ""){
                            fs.unlink('.'+doc.image);
                        }
                    }
                    db.subcategory.update(
                        {_id:ObjectId(req.body.subcategory)},
                        {$set:
                            {
                                category:req.body.category,
                                name:req.body.name,
                                description:req.body.description,
                                image:'/' + req.file.path
                            }
                        },function(err){
                            if(err){
                                res.json({"status":"0", "error":err})
                            }else{
                                res.json({"status":"1", "error":""})
                            }
                        }
                    )
                });
            }
        });
    });

    app.get('/sadmin/api/v1/subcategory_details/:category', function(req, res){
        var category = req.params.category;
        db.subcategory.findOne(
            {_id:ObjectId(category)},
            function(err, doc){
                if(err){
                    res.json({"status":"0", "error":err})
                }
                else{
                    res.json({"status":"0", "error":"", "data":doc})
                }
            }
        );
    });

    
    app.post('/sadmin/api/v1/user_list/', function(req, res){
        var page = parseInt(req.body.page);
        var lmt = parseInt(req.body.limit);
        var group = req.body.group;
        var user_array = [];
        db.users.find(
            {
                group:group,
            },
            {
                first_name:1,
                nationalid:1,
                phone:1,
                image:1,
                subscription:1
            }).skip(page > 0 ? ((page - 1) * lmt) : 0).limit(lmt).forEach(function (err, docs) {
            if(err){
                console.log("Error: "+err);
            }else if(!docs){

                res.json({"status":"1", "error":"", "users": user_array});
            }else{
                user_array.push(docs);
            }
        });
    });

    app.put('/sadmin/v1/setsubscription/:userid', function(req, res){

        var user_id = req.params.userid;
        var data = req.body;
        db.users.update({_id: ObjectId(user_id)},
        {$set: {subscription: data.status}},
        function(err){
            if(err){
                res.json({"status": "0", "error": err});
            }else{
                res.json({"status": "1", "error": ""});
            }
        });
    });

    app.post('/sadmin/v1/jobs/', function (req, res) {
        var data = req.body;
        var status = data.status;
        var page = data.page;
        var lmt = parseInt(data.limit);
        var jobs = [];
        db.jobs.find({status: status},
            {
                title: 1,
                description: 1,
                location: 1,
                emergency:1,
                location_address:1,
                scheduledtime: 1,
                convenienttime: 1,
                images:1,
                customer:1,
            }).skip(page > 0 ? ((page - 1) * lmt) : 0).limit(lmt).forEach(function (err, docs) {
            if (err) {
                console.log(err);
                res.json({"status": "0", "error":err});
            }
            if (!docs) {
                if (jobs.length > 0) {
                    res.json({"status": "1", "error":"", "jobs": jobs});
                } else {
                    res.json({"status": "2", "error":""});
                }
            } else {
                docs.convenienttime = moment(docs.convenienttime).format("DD-MM-YYYY HH:mm:ss");
                docs.scheduledtime = moment(docs.scheduledtime).format("DD-MM-YYYY HH:mm:ss");
                jobs.push(docs);
            }
        });
    });
    
}