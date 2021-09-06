var express = require('express')
var fs = require('fs');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var tc = require('./models/transaction.js')
var bodyParser = require("body-parser");
var mongoose = require('mongoose')
var app = express();
var db = require('./config/db')
var serv = require('./config/serve')
const cors =require('cors');
var user = require('./models/user')
const enc = require('./config/encryption.js')
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(64, UIDGenerator.BASE62);
var ct = require('./models/confirmedtransaction')
var ctenc = require('./config/transactionenc.js')
var msgenc = require('./controllers/encdecservice.js')
var pubmsg = require('./models/pubmsg.js')
var privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');
var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
var ctprivateKEY  = fs.readFileSync('./keys/transactionprivate.key', 'utf8'); //This is for encrypting transactions only
var ctpublicKEY  = fs.readFileSync('./keys/transactionpublic.key', 'utf8'); //For decrypting transactions only
var token;
var ran;

app.use(cors());
mongoose.Promise = global.Promise; 
app.use(bodyParser.json());

/* 
I will work on everything later, first I want to create a ledger software which can allow me to add lines into it
It should also allow someone else to digitally sign with their password
Each transaction has to be depicted in an orderly fashion

*/

app.listen(process.env.PORT || 5000, process.env.IP, function(req, res) //The Serv.port is from a config file
{
    console.log("SERVER STARTED");
});

app.use(express.static("styles"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect(db.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true}) //Changed this line to link to a database file instead of having everything in one file to provide quick and easy access for further work
    .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


app.get('/login', async function(req, res){
    res.render('login')
})



app.post('/pubmsgencservice', async function(req, res){
    uidgen.generate(async function(err, uidobj){
        if(err){
            console.log(err)
        }
        else{
            var newMsg = new pubmsg({
                EncryptedText: msgenc.encryptionService(req.body.password, req.body.message),
                msgid: uidobj, 
                sender: req.body.sender
            })

            newMsg.save(function(err, obj){
                if(err){
                    console.log(err)
                }
                else{
                    console.log(obj)
                    res.redirect('/msgboard')
                }
            })
        }
    })
    
})

app.post('/pubmsgdecservice', async function(req, res){
    pubmsg.findOne({msgid: req.body.msgid}, function(err, obj){
        if(err){
            console.log(err)
        }
        else{
            var decrypted = msgenc.decryptionService(req.body.password, obj["EncryptedText"])
            res.render('securedecpage', {data: decrypted})
        }
    })
})


app.post('/msgsearch', async function(req, res){
    pubmsg.find({$or: [{sender: req.body.searchitem}, {msgid: req.body.searchitem}]}, function(err, obj){
        if(err){
            console.log(err)
        }
        else{
            console.log(obj)
            res.render('msgsearchresult', {data:obj})
        }
    })
})

app.get('/msgboard', async function(req, res){
    pubmsg.find({}, function(err, obj){
        if(err){
            console.log(err)
        }
        else{
            console.log(obj)
            res.render('msgboard', {data: obj})
        }
    })
})

app.post('/login', async function(req, res){
    user.findOne({username: req.body.username}, function(err, obj){
        if(err){
            console.log(err)
        }
        else{
            console.log("Inside comparison")
            if(bcrypt.compareSync(req.body.password, obj["password"])){
                console.log(obj)
                token = jwt.sign({nickname: obj["DisplayName"], sub: obj["username"]}, privateKEY, enc.signOptions);
                console.log("jwt generated")
                console.log(token)
                jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log(decodedToken)
                        res.render('home', {user: decodedToken})
                    }
                })
                
            }
            else{
                console.log("Password Error")
            }
        }
    })
})

app.post('/register', async function(req, res){
    var newUser = new user({
        DisplayName: req.body.name,
        securityQuestion: req.body.securityQuestion,
        securityAnswer: bcrypt.hashSync(req.body.securityAnswer, 9), 
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 9)
    })

    newUser.save(function(err, obj){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('login')
            console.log(obj)
        }
    })
})

app.get('/register', async function(req, res){
    res.render('register')
})


app.get('/', async function(req, res){
    jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
        if(err){
            console.log(err)
            res.redirect('/login')
        }
        else{
            console.log(decodedToken)
            res.render('home', {user: decodedToken})
        }
    })
    
})

app.get('/transaction', async function(req, res){
    jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
        if(err){
            console.log(err)
            res.redirect('/login')
        }
        else{
            tc.find({}, function(err, obj){
                res.render('trans', {data: obj})
            })
        }

    })

    
})

app.get('/mywallet' ,async function(req, res){
    jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
        if(err){
            console.log(err)
            res.redirect('/login')
        }
        else{
            tc.find({Payer: decodedToken["sub"]}, function(err, obj){
                console.log(obj)
                res.render('wallet', {obj:obj})
            })
        }
    })
})

app.post('/mywallet', async function(req, res){
    jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
        if(err){
            console.log(err)
            res.redirect('/login')
        }
        else{
            tc.updateOne({uid: req.body.uid}, {$set: {verified: true}}, function(err, resultobj){
                tc.findOne({uid: req.body.uid}, function(err, obj){
                    console.log(obj)
                    var newtoke = jwt.sign({Payee: obj["Payee"], Payer:obj["Payer"], Amount: obj["Amount"], Mode:obj["Mode"]}, ctprivateKEY, ctenc.signOptions)
                    console.log(newtoke)
                    jwt.verify(newtoke, ctpublicKEY, ctenc.verifyOptions, function(err, decodedToken2){
                        if(!err){
                        console.log(decodedToken2)
    
                        var newCT = new ct({
                            trdetails: newtoke
                        })
                        newCT.save(function(err, transactionobj){
                            if(err){
                                console.log(err)
                            }
                            else{
                                console.log(transactionobj)
                            }
                        })
                     }
                        else{
                            console.log(err)
                        }
                    })
                })
               
            })
        }
    })
})
  
app.post('/transaction', async function(req, res){
    jwt.verify(token, publicKEY, enc.verifyOptions, function(err, decodedToken){
        if(err){
            console.log(err)
            res.redirect('/login')
        }
        
        else{
            uidgen.generate(async function(err, obj){
                if(err){
                    console.log(err)
                }
                else{
                    console.log(obj)
                    var newTransaction = new tc({
                        Payee: req.body.payee,
                        Payer: req.body.payer,
                        Amount: req.body.Amount,
                        mode: req.body.mode, 
                        description: req.body.description, 
                        verified: false, 
                        uid: obj
                    })
                
                    newTransaction.save(function(err, obj){
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log(obj)
                            res.redirect('/transaction')
                        }
                    })
                }
            });
          
        }
    })

})