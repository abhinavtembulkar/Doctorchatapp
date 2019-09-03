const express = require('express')
const app = express()
const hbs = require('hbs')

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const { MongoClient } = require('mongodb')
const uri = "mongodb+srv://abhi:7Murderousmaths@cluster0-mwaqt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

var curr_user
var PORT = process.env.PORT || 8000

app.use(express.static(__dirname+'/views'))
app.set('view engine','hbs')

app.get('/',(req,res)=>{
    console.log('Cover')
    res.render('cover.hbs',{
        show : true
    })
})

app.get('/signup',(req,res)=>{
    console.log('Signup')
    res.sendFile(__dirname+'/views/signup.html')
})

app.get('/login',(req,res)=>{
    console.log('Login')
    res.render('login.hbs')
})

app.get('/choose',(req,res)=>{
    console.log('choose docs')
    res.render('choose.hbs',{
        doc1 : true,
        doc2 : true,
        doc3 : true,
        doc4 : true,
        name1 : 'M.K. sharma',
        name2 : 'R.K. bansal',
        name3 : 'A.K. sharma',
        name4 : 'S.K. sharma',
        prof1 : 'child specialist',
        prof2 : 'Gastroentrologist',
        prof3 : 'general physician',
        prof4 : 'dentrologist',
        deg1 : 'MBBS',
        deg2 : 'FRS',
        deg3 : 'MD',
        deg4 : 'MBBS',
        spl1 : 'child problems',
        spl2 : 'Stomach',
        spl3 : 'genral health',
        spl4 : 'skin',
    })
})

app.get('/start',(req,res)=>{
    console.log('CHAT')
    res.render('start.hbs')
})

app.get('/exit',(req,res)=>{
    console.log('medicines')
    res.render('exit.hbs',{
        med1 : true,
        med2 : true,
        med3 : true,
        med4 : true,
        med5 : true,
        med6 : true,

        desc1 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',
        desc2 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',
        desc3 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',
        desc4 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',
        desc5 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',
        desc6 : 'Crocin is a carotenoid chemical compound that is found in the flowers crocus and gardenia.[1] Crocin is the chemical primarily responsible for the color of saffron.',

        name1 : 'crocin',
        name2 : 'crocin',
        name3 : 'crocin',
        name4 : 'crocin',
        name5 : 'crocin',
        name6 : 'crocin',
    })
})

app.get('/pays',(req,res)=>{
    console.log('PAYMENT')
    res.sendFile(__dirname+'/views/payment.html')
})

//<----------------------------------------------->//

app.use(express.urlencoded({ extended:true }))

app.post('/signup',(req,res)=>{
    console.log('tyty',req.body)
    console.log('fname',req.body.firstName)
    console.log('lname',req.body.lastName)
    console.log('uname',req.body.username)
    console.log('email',req.body.email)
    console.log('pass',req.body.password)
    console.log('addrs',req.body.address)
    console.log('contr',req.body.country)
    console.log('state',req.body.state)
    console.log('postal',req.body.postal)

    createDb(req.body,'users')

    res.render('cover.hbs',{
        show : false
    })
})

app.post('/login',(req,res)=>{
    console.log('username',req.body.user)
    console.log('password',req.body.pass)

    checkDb(req.body,'users')
    .then((curr)=>{
        console.log('SUCCESSFUL',curr)
        curr_user=curr
        res.redirect('/choose')
    })
    .catch(()=>{
        console.log('FAILURE')
        res.send(`<html>
            <body>
                <h1>Enter correct user details !<h1>
                <h2>or</h2>
                <h3>signup for the website -> </h3>
                <h4><a href='/'>HERE</a></h4>
            </body>
        </html>`)
    })
})

app.get('/chosey',(req,res)=>{
    console.log('doctor %s chosen',req.query.doc)

    checkDb(req.query.doc,'docs')
    .then((msg)=>{
        console.log(msg)
        console.log('%s doc online',msg[0].doc)
    
        res.render('start.hbs',{
            name : curr_user,
            doc : msg[0].doc,
            docname : msg[0].name,
            docdetail : msg[0].detail,
            Name : `<button id='note' style='display:none' value='${curr_user}'>${curr_user}</button>`,
            link : `<button id='linksrc' style='display:none' value='${msg[0].detail}'>none</button>`,
        })
    })
    .catch((err)=>{
        console.log('ERROOR',err)
    })
})

//<----------------------------------------------->//

io.on('connection',(socket)=>{
    console.log('connected')

    socket.on('senddata',(data)=>{
        console.log(data)

        userp.then(db => {
            const chats = db.collection('Chats')

            const chatcursor = chats.find().sort({ _id:1 }).toArray()
            chatcursor.then((ch)=>{
                console.log(ch)
                socket.emit('chata',ch)
            }).catch(err => console.log(err))
            
        })
    })

    socket.on('newuser',(data)=>{
        console.log("new ",data)
        
        userp.then(db => {
            const chats = db.collection('Chats')
            
            console.log(data.name)
            const cursor = chats.find({
                name:data.name
            }).toArray()
            
            cursor.then((arr)=>{
                if(arr.length > 0)
                {
                    console.log(arr)
                    console.log(arr[0]._id)
                    //console.log(ObjectId(arr[0]._id).getTimestamp().toString())

                    let date = arr[0]._id.getTimestamp()
                    console.log(date)

                    let date2 = new Date( parseInt(arr[0]._id.toString().substring(0,8)))
                    console.log(date2)
                }
            })

            console.log(cursor)

            chats.insertOne({
                name:data.name,
                chat:data.chat
            }).then(()=>console.log('inserted',Date()))
            .catch(err => console.log('ERROR'))
        })
        
        socket.broadcast.emit('newmsg',data)
    })

    socket.on('clear',(data)=>{
        console.log('clearing :')
    })
})

//<------------------------------------------>//

const setDb = dbName =>
    client.connect()
        .then(()=>client.db(dbName))
        .catch(err => console.log('ERROR',err))

var userp = setDb('userDB')

const createDb = (list,colls) =>{
    userp.then(db => {
        const coll = db.collection(colls)

        coll.insertOne(list)
        console.log('db is working')
    }).catch(err => console.log('ERROR',err))
}

const checkDb = (list,colls) =>{
    
    let truth = new Promise((Resolve,Reject)=>{
        userp.then(db => {
            const users = db.collection(colls)

            if(colls == 'users'){
            const cursor = users.find({
                username : list.user,
                password : list.pass
            }).toArray()

            cursor.then((arr) => {
                console.log(arr)
                if(arr.length>0)
                {
                    console.log('FOUND!')
                    Resolve(arr[0].username)
                }
                else {
                    console.log('not found')
                    Reject()
                }
            })}

            if(colls == 'docs'){
                const cursor = users.find({
                    doc : ''+list
                }).toArray()
    
                cursor.then((arr) => {
                    console.log(arr)
                    if(arr.length>0)
                    {
                        console.log('FOUND!')
                        Resolve(arr)
                    }
                    else {
                        console.log('not found')
                        Reject('DOC NOT FOUND $$$$')
                    }
                })
            }
        })
    })
    //ASYNC problem in "truth" here solve it!
    return truth
}

//<-------------------------------------------->//

server.listen(PORT,()=>{
    console.log('runninn on %s',PORT)
})