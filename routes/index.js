var express = require('express');
var async=require('async');
var crypto=require('crypto');
var router = express.Router();
var Picture = require('../models/picture.js');
var User=require('../models/user.js');
var Gift = require('../models/gift.js');
var Admin = require('../models/admin.js');
var nodemailer = require('nodemailer');
var Theme=require('../models/theme.js');




module.exports=function(app,passport){
   
    app.get('/vote/pictures/:picture_id',function(req,res){
        Picture.findById(req.params.picture_id, function(err, picture) {
            if (err) throw err;
            var flag=false;
            console.log(picture.voted.length);
                var i=picture.voted.length;

                while(i--)
                {
                    var picture_voted_string=picture.voted[i].toString();
                    var user_id_string=req.user._id.toString();
                    
                    if(picture_voted_string==user_id_string)
                    {
                        flag=true;
                        break;
                        
                    }
                    else {flag=false;}
                }
                console.log(flag);
            if(flag==false)
            {
                picture.votes=picture.votes+1;
                picture.voted.push(req.user);
                picture.save(function(err) {
                    if (err) throw err;
                    console.log('Picture successfully updated!');


                });

                var obj=picture.user;
                User.findById(obj,function(err,user){
                    if(err)
                        res.send(err)
                    user.credits.total=user.credits.total+5;
                    user.credits.available=user.credits.total-user.credits.used;
                    user.save(function(err){
                        if(err) throw err;
                    })
                    console.log("user updated");

                })
                res.send(flag);
        
            }
            else{

                res.send(flag);
                console.log("User has already upvoted!")}
        });
        
    }); 
 app.get('/downvote/pictures/:picture_id',function(req,res){
            Picture.findById(req.params.picture_id, function(err, picture) {
            if (err) throw err;
            var flag=false;
            console.log(picture.downvoted.length);
           var i=picture.downvoted.length;

                while(i--)
                {
                    var picture_voted_string=picture.downvoted[i].toString();
                    var user_id_string=req.user._id.toString();
                    
                    if(picture_voted_string==user_id_string)
                    {
                        flag=true;
                        break;
                        
                    }
                    else {flag=false;}
                }
            
            console.log(flag);
            
            if(flag==false)
            {
                picture.votes=picture.votes-1;
                picture.downvoted.push(req.user);
                picture.save(function(err) {
                    if (err) throw err;
                    console.log('Picture successfully updated!');


                });

                var obj=picture.user;
                User.findById(obj,function(err,user){
                    if(err)
                        res.send(err)
                    user.credits.total=user.credits.total-5;
                    user.credits.available=user.credits.total-user.credits.used;
                    user.save(function(err){
                        if(err) throw err;
                    })
                    console.log("user updated");

                })
                
        
            }
            else{
                res.send(flag);
                console.log("User has already downvoted");}
        });
        
    }); 

    app.get('/credits/loss/:gift_id',function(req,res){
        var flag;
        Gift.findById(req.params.gift_id, function(err, gift) {
            if (err) throw err;
                    User.findById(req.user,function(err,user){
                        if(err)
                            res.send(err)
                        if((user.credits.available>=gift.credit))
                        {
                            flag=true;
                            gift.c_users.push(user);
                            gift.save();
                            console.log(gift);
                            user.credits.available=user.credits.available-gift.credit;
                            user.credits.used=user.credits.used+gift.credit;
                            user.credits.total=user.credits.available+user.credits.used;
                            user.save(function(err){
                                if(err) throw err;

                            });
                            var smtpTransport = nodemailer.createTransport("SMTP",{
                               service: "Gmail",  // sets automatically host, port and connection security settings
                               auth: {
                                   user: "imagehubbvm@gmail.com",
                                   pass: "imagehubpassword"
                               }
                            });

                            smtpTransport.sendMail({  //email options
                               from: "ImageHub <imagehubbvm@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                               to: user.local.email, // receiver
                               subject: "Reward from ImageHub", // subject
                               text: "Congratulations!",
                                html: "Embedded image: <img src='cid:unique@kreata.ee' />",
                                attachments: [{
                                    filename: gift.path,
                                    filePath: "c:/users/Yamini Gupta/Desktop/imagehub_code/public/images/"+gift.path,
                                    cid: "unique@kreata.ee" //same cid value as in the html img src
                                }] // body
                            }, function(error, response){  //callback
                               if(error){
                                   console.log(error);
                               }else{
                                   console.log("Message sent: " + response.message);
                               }
                               
                               smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                            });
                        user.gifts.push(gift);
                        console.log(user.credits.available);
                        res.send(flag);
                    }
                    else{
                        flag=false;
                        console.log("You do not have enough credits to claim this reward");

                         res.send(flag);
                    }

                });
                    
        
        });
    }); 

  
/*
    app.post('/comments/pictures/:picture_id/', function(req, res) {
        Picture.update({ "_id": req.params.picture_id },
    {$push: { "comments": 'abcde' }},
    function(err, numAffected) {
      if(err) {//handle error}
        console.log("Error");
}      else { 
        //do something depending on the number of documents affected
        console.log("Comment added");
      }});
    });



    
*/ 
 
	app.get('/api/pictures', function(req, res) {

        // use mongoose to get all todos in the database
        Picture.find(function(err, pictures) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(pictures); // return all todos in JSON format
        });
    });
    app.get('/search/pictures', function(req, res) {

        // use mongoose to get all todos in the database
        Picture.find(function(err, pictures) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(pictures); // return all todos in JSON format
        });
    });

    app.get('/search/user', function(req, res) {

        // use mongoose to get all todos in the database
        User.find(function(err, users) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(users); // return all todos in JSON format
        });
    });



    app.get('/apisd/giftsid', function(req, res) {

        // use mongoose to get all todos in the database
        Gift.find(function(err, gifts) {



            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(gifts); // return all todos in JSON format
        });
    });

    app.get('/apiuser/pictures', function(req, res) {

        // use mongoose to get all todos in the database
        Picture.find({

            user:req.user
        },function(err, pictures) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(pictures); // return all todos in JSON format
        });
    });
    app.delete('/api/pictures/:picture_id', function(req, res) {
        Picture.remove({
            _id : req.params.picture_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Picture.find({
                user:req.user
            },function(err, pictures) {
                if (err)
                    res.send(err)
                res.json(pictures);
            });
        
        });
    });

        app.delete('/apis/voucher/:gift_id', function(req, res) {
      Gift.remove({
            _id : req.params.gift_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Gift.find({
                user:req.user
            },function(err, gifts) {
                if (err)
                    res.send(err)
                res.json(gifts);
            });
        });
    });


    
 /*   app.post('/search', function(req, res) {
        User.find({

            local.username:req.body.category;
        },function(err, user) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(user); // return all todos in JSON format
        });
    });
*/
    app.get('/edit', isLoggedIn, function(req, res) {
        res.render('edit.ejs', {
            user : req.user 
        });
    });
  
    
	app.get('/', function(req, res, next) {
  		res.render('index.ejs');
	});
     app.get('/dmca', function(req, res, next) {
        res.render('dmca.ejs');
    });
    app.get('/about', function(req, res, next) {
        res.render('aboutus.ejs');
    });
    app.get('/pictureactivite', function(req, res, next) {
        res.render('pictureactive.ejs');
    });
     app.get('/theme_activite', function(req, res, next) {
        res.render('themeactivite.ejs');
    });
    app.get('/search', isLoggedIn, function(req, res) {
        res.render('search.ejs', {
            user : req.user 
        });
    });
     app.get('/admin-themeline', function(req, res, next) {
        res.render('admin-themeline.ejs');
    });

 	app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/giftactivite', function(req, res,next) {
        res.render('giftactivite.ejs'); 
    });

    app.get('/signup', function(req, res) {

        
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/admin-login', function(req, res) {
        res.render('admin-login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/admin-signup', function(req, res) {

        
        res.render('admin-signup.ejs', { message: req.flash('signupMessage') });
    });


    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {

            message:req.flash('errorMessage'),
            user : req.user 
        });
    });
   
    app.route('/admin-profile')
    .get(function(req, res) {

        res.render('admin-profile.ejs',{});

        if (req.session.state) {
            res.json({state: req.session.state});
        }

    });
    app.get('/api/theme',isLoggedIn, function(req, res) {
        var now=new Date();
        var jsonDate=now.toJSON();
        console.log(now);
        console.log(jsonDate);
        Theme.findOne({

            Start:{$lte:jsonDate},
            End:{$gt:jsonDate}
        },function(err, theme) {
            if (err)
                res.send(err)
            console.log(theme.Name);
            res.json(theme);
        });    
    });

       app.get('/apiuser/theme',isLoggedIn, function(req, res) {
        Theme.find(function(err, themes) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(themes); // return all todos in JSON format
        });
       
    });

     app.get('/apiuser/gifts',isLoggedIn, function(req, res) {
        Gift.find({


        },  function(err, gifts) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(gifts); // return all todos in JSON format
        });
       
    });




    app.get('/themeline', isLoggedIn, function(req, res) {
        res.render('themeline.ejs', {
            user : req.user 
        });
    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');

    });
    app.get('/forgot', function(req, res) {
        res.render('forgot', {
        user: req.user
        });
    });
    app.get('/browser',isLoggedIn,function(req,res){
        res.render('browser.ejs',{
            message:req.flash('errorMessage'),
            user:req.user
        });
    });
    app.get('/edit',isLoggedIn,function(req,res){
        res.render('edit',{
            user:req.user
        });
    });

    app.post('/addtheme',function(req,res){
        var newTheme=new Theme();
                newTheme.Name=req.body.themename;
                newTheme.Start=req.body.starttime;
                newTheme.End=req.body.endtime;
                

                newTheme.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newTheme);
                        });
                res.redirect('/admin-profile');
            
    })

    app.post('/profile',function(req,res){
        var flag=true;
        console.log(req.body.hashval);
        console.log(flag);
        Picture.find({

            hashval:req.body.hashval
        },function(err, pictures) {
            if (err)
                res.send(err)

            if (pictures.length<1) flag=true; 
            else flag=false;
            
            if(flag==true)
            {
                var newPicture=new Picture();
                newPicture.path=req.body.uploadfile;
                newPicture.votes=0;
                newPicture.caption=req.body.caption;
                newPicture.user=req.user;
                newPicture.hashval=req.body.hashval;
                newPicture.theme=req.body.themeselect;

                newPicture.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newPicture);
                        });

                Theme.findOne({
                    Name:req.body.themeselect

                    },function(err, theme) {
                        if (err)
                            res.send(err)
                        console.log(newPicture._id);
                        theme.picture.push(newPicture);

                        theme.save(function(err) {
                            if (err) throw err;
                            console.log('Theme successfully updated!');
                        });

                });

                res.redirect('/profile');
            }
             else{
                req.flash('errorMessage','Picture already uploaded');
                return res.redirect('/profile');
            }
        
            console.log(flag);// return all todos in JSON format
        });
       
    })
    app.post('/admin-profile',function(req,res){
        var flag=true;
        console.log(req.body.hashval);
        console.log(flag);
        Gift.find({

            hashval:req.body.hashval
        },function(err, gifts) {
            if (err)
                res.send(err)

            if (gifts.length<1) flag=true; 
            else flag=false;
            
            if(flag==true)
            {
                var newPicture=new Gift();
                newPicture.path=req.body.uploadfile;
                newPicture.votes=0;
                newPicture.caption=req.body.caption;
                newPicture.user=req.user;
                newPicture.hashval=req.body.hashval;

                newPicture.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newPicture);
                        });

                res.redirect('/giftactivite');
            }
            else res.redirect('/giftactivite');
            console.log(flag);// return all todos in JSON format
        });
       
    })




    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));
    app.post('/admin-signup', passport.authenticate('admin-local-signup', {
        successRedirect : '/admin-profile',
        failureRedirect : '/admin-signup', 
        failureFlash : true 
    }));
    app.post('/admin-login', passport.authenticate('admin-local-login', {
        successRedirect : '/admin-profile', 
        failureRedirect : '/admin-login', 
        failureFlash : true 
    }));

      //forgot password

    app.post('/forgot', function(req, res, next) {
        async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
                user: '!!! YOUR SENDGRID USERNAME !!!',
                pass: '!!! YOUR SENDGRID PASSWORD !!!'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
        });
    });

//Request new password-----via email link

    app.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user
            });
        });
    });
    


    app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

};


function isLoggedIn(req, res, next) {
 
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}





