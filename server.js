const  fetch = require("node-fetch")

const express = require('express')

const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const handlebars = require('express-handlebars')
const { INSPECT_MAX_BYTES } = require('buffer')
const { timeStamp } = require('console')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectMongo = require ('connect-mongo')
const advanceOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt-nodejs");
const flash = require('connect-flash')
const parseArgs = require ('minimist')
const args = parseArgs(process.argv)
require('dotenv').config()

const cluster = require('cluster')
const numCPUs = require('os').cpus().length
//console.log(`El numero de CPUs es:  ${numCPUs}`)

const options = {default: {puerto: 8080, modo:'FORK'}}

//console.log(parseArgs(['-p', '5000'], options))
//console.log(parseArgs(process.argv.slice(2), options))

const parametros = parseArgs(process.argv.slice(2), options)

//console.log(parametros)

//const port = parametros['puerto'] // es para minimist not work in heruko
const port = process.env.PORT || 8080

const MODO = parametros['modo']

const ENV = 'PROD'

//uso minimist el comando es: node server --puerto NUMERO --modo NOMBRE

const compression = require ('compression')

const log4js = require ('log4js')
log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerFile: { type: 'file', filename: 'info.log' },
    miLoggerFile2: { type: 'file', filename: 'info2.log' }
  }
  ,categories: {
    default: { appenders: ["miLoggerConsole"], level: "trace" },
    consola: { appenders: ["miLoggerConsole"], level: "debug" },
    archivo: { appenders: ["miLoggerFile"], level: "warn" },
    archivo2: { appenders: ["miLoggerFile2"], level: "info" },
    todos: { appenders: ["miLoggerConsole", "miLoggerFile"]
    ,level: "error" }
  }
 })
 


//-------BDD-ECOMMERCE--MONGO--ATLAS------------------

const mongoose = require ('mongoose')

const User = require ('./models/modelUsers')

CRUD()

async function CRUD() {
 try{ 
      //const DB = 'ecommerce'
      const URL = process.env.MGATLAS //`mongodb+srv://ex888gof:2013facu@cluster0.mnmsh.mongodb.net/${DB}?retryWrites=true&w=majority`
      
      let respueta = await mongoose.connect (
              URL
              ,{
                useNewUrlParser: true
               ,useUnifiedTopology: true
              })
              /*,await User.create({
                                username: 'FMG@gmail.com',
                                password: '123456',
                                nombre: 'Francisco',
                                apellido: 'Gonzalez',
                                dni: '28888888',
                                calle: 'Las rosas',
                                altura: '3333',
                                pisoDpto:'-',
                                localidad: 'Las flores',
                                cp:'1000',
                                provincia: 'Aca',
                                telefono: '1140003000'
              })*/
              //,console.log('Base de datos conectada')
              //,console.log( await User.find())
              //,console.log( modelUsers.estimatedDocumentCount())
  } catch (e) {
    console.log(e)
  }
 }

//-----------FIN BDD MONGOOSE-----------------//

//---------------------------------SQLite3----------------------------------------//

const {optionsMSG} = require ('./optionsMSG/sqLite3') 
const { MemoryStore } = require('express-session')
const { isNullOrUndefined } = require('util')
const { CONNREFUSED } = require('dns')
//const { createHash } = require('crypto')
const knexMSG = require ('knex') (optionsMSG);

//----------------esta funcion crea la tabla de mensajes sqLite3------------------

const crearTabla = () =>{ 
  const { createTableMSG } = require('./optionsMSG/createTableMSG')
}

//crearTabla ()


//--------esta funcion devuelve todos los mensajes de la tabla mensajes-----------

async function getAll (){ 
  
  await knexMSG
    .from('MSG')
    .select('*')
    .then((rows) => {                
            messages = rows.map(mensaje => {return mensaje})            
            return messages
            })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      knexMSG.destroy()
    })

}

//------------------PROMESAS CON NODE-FETCH----------------------------//
let productos = []

asyncCall().catch(err => {
  console.log(err);
  });

async function asyncCall() {
  let items = await fetch(`http://localhost:8080/app/productos/landing`
                          ,{
                              method:'GET',
                              //body:null,
                          })
                          .then(res=>res.json());
                              for (var i = 0; i<items.length; i++){
                                productos.push(items[i])
                              };
}
//--------------FIN---PROMESAS-----------------------------//




//-------importando modulos Router---------------
//const productosRouter = require ('./routes/productosRouter')

const randomsRouter = require ('./routes/randomsRouter')

const productosMg = require ('./DAOs/productosMg')
const carritoMg = require ('./DAOs/carritoMg')

//---------------------------------SOCKETS-----------------------//
const fs = require('fs');
const { response } = require('express')
const res = require("express/lib/response")
const { resolve } = require("path")
const { json } = require("express/lib/response")

const userAdmin = []
let messages = []

io.on('connection', (socket) => {
      //console.log('socket connection')
      socket.emit('socketUser', userAdmin)
      socket.emit('messages', messages)
      socket.emit('socketProductos', productos)
      socket.on('notificacion', (data) => {
                console.log(data)
      
                })

      socket.on('new-message', async (mensaje) => { 
        //---aca recibo el mensaje nuevo de addMessage/socket.emit y lo inserto en la BDD
                  const {optionsMSG} = require ('./optionsMSG/sqLite3') 
                  const knexMSG = require ('knex') (optionsMSG);
                  let insertNewMSGonBDD = await knexMSG('MSG')
                                                .insert(mensaje)
                                                .then(() => {
                                                  console.log('newMessage insert')
                                                })
                                                .catch((err) => {
                                                  console.log(err)
                                                  throw err
                                                })
                                                .finally(() => {
                                                  knexMSG.destroy()
                                                })
                
                await messages.push(mensaje)
                io.sockets.emit('messages', messages)
      })

      socket.on('nuevo-producto', (newProduct) => {
        //---aca recibo el product nuevo de addProduct/socket.emit y lo inserto en la BDD
                productos.push(newProduct)
                io.sockets.emit('socketProductos', productos)
                }
      )

})



//----------------------APP---------------------------------//

if (MODO === 'CLUSTER' && cluster.isPrimary) {
            console.log(`num CPUs es: ${numCPUs}`)
            console.log(`PID MASTER ${process.pid}`)

            for (let i = 0; i< numCPUs; i++){
                cluster.fork()
            }
            cluster.on('exit', (worker, code, signal)=>{
                console.log(`
                  Worker
                  ${worker.process.pid}
                  died
                  ${new Date().toLocaleString()}`
                )
                cluster.fork()
            })

} else {
          
        httpServer.listen(port, () =>{ 
                                      getAll()
                                     // ,asyncCall()
                                    //  , getAllProducts()
                                      ; console.log(`servidor levantado puerto:${port}`)
                                    })


          /*
        //metodo para enviar y recibir peticiones json
        const router = express.Router()
        */

        //usar app delante de use hace que sea general y que toda la app pueda procesar JSON y siempre debe ir antes del router con la peticion**
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json())

        //se define la ruta de los archivos estaticos que seran servidos desde la ruta/public, IF nginx proxy desactivar!!
        app.use(express.static('./public'))

        //------------------------------HANDLEBARS-----------------------//

        app.engine(
            '.hbs',
            handlebars.engine({
                      extname: '.hbs',
                      defaultLayout: 'main.hbs',
                      layoutsDir: './views/layouts'
            })
          )
          
        app.set('view engine', '.hbs')
        app.set('views', './views')
        //------------------------COMPRESSION-----------------------//
        app.use(compression())

        //--------------------------LOGIN--CON---SESSION y PASSPORT---------------------------//
        app.use(cookieParser())

        //----METODO DE SAVE SESSION a nivel de la aplicacion y TIEMPO (ttl)/ cookie maxAge
        app.use(
          session({
            store: connectMongo.create ({
                  mongoUrl: process.env.MGATLAS //'mongodb+srv://ex888gof:2013facu@cluster0.mnmsh.mongodb.net/ecommerce?retryWrites=true&w=majority'
                  ,ttl: 600
                  ,autoRemove: 'disabled'
                  ,mongoOptions: advanceOptions
            })
            ,secret: 'secreto'
            ,resave: true
            ,saveUninitialized: true
            ,cookie: { maxAge: 600000 }
          })
        )

        //----PASSPORT---------------------------------

        app.use(flash())

        app.use(passport.initialize())
        app.use(passport.session())

        passport.use('login'
                    ,new LocalStrategy({
                      usernameField: 'username',
                      passwordField: 'password',
                      passReqToCallback: true
                      },
                            async  (req, username, password, done) => {
                                    //console.log('entro a signin/ login')

                                    const userExist = await User.findOne({username: username})

                                    if(!userExist){
                                      return done(null, false, req.flash('signinMessage', 'No se ubica el Usuario'))
                                    }
                                    if(!userExist.comparePassword(password)){
                                      return done(null, false, req.flash('signinMessage', 'Password incorrecta'))
                                    }
                                    done(null, userExist)
                            }
                    )

        )

        passport.use('register',  new LocalStrategy({ //---FALTA EL MANEJO DE ERRORES Y DUPLICADOS!!!----//
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
          },
                  async  (req, username, password, done) => {

                          const userExist = await User.findOne({username: username})

                          if(userExist){
                            return done(null, false, req.flash('signupMessage', 'El usuario ya existe')) //01:31 agregar ruta que captura msgs con var global y luego if al login.hbs
                          }else{

                          const newUser = new User ()
                          newUser.username= username,
                          newUser.password= encryptPassword(password),
                          newUser.nombre= req.body.nombre,
                          newUser.apellido= req.body.apellido,
                          newUser.dni= req.body.dni,
                          newUser.calle= req.body.calle,
                          newUser.altura= req.body.altura,
                          newUser.pisoDpto= req.body.pisoDpto,
                          newUser.localidad= req.body.localidad,
                          newUser.cp= req.body.cp,
                          newUser.provincia= req.body.provincia,
                          newUser.telefono= req.body.telefono

                          await newUser.save()
                          done(null, newUser)
                          }
                  }
        )
        )

        function encryptPassword (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
        }

        passport.serializeUser((user, done) => {
          done(null, user.id)
        })

        passport.deserializeUser(async (id, done) => {
          const user = await User.findById (id)
          done(null, user)
        })

        //---------------RUTAS -------------------------
        app.use('/randoms',randomsRouter);

        app.use('/app/carrito'
                              ,async function (req, res, next) {
                                              
                                if (req.session.passport==undefined)
                                {
                                  
                                  res.redirect('/login')
                                
                                } else {

                                  next ()
                                
                                }
                              }
            , carritoMg);
        
        app.use('/app/productos', productosMg);

        app.get('/login', (req, res, next) => {
          req.logOut(function(err){
            if (err) {return next (err);}
            res.render('login')
          })
        })

        app.post('/login'
                        ,passport.authenticate('login', {
                          
                          successRedirect: '/home',
                          failureRedirect: '/login-error',
                          
                        })
                        /*,async (req, res) => {
                          const {user} = req.body
                          if (!user) {
                              return res.redirect('/')
                          }
                              req.session.user = user
                              const userLogin = {user:{}}
                              userLogin['user']= user
                              userAdmin.push(userLogin)
                              res.redirect('/home')
                        }*/
        )

        app.get('/register', (req, res) => {
          res.render('register')
        })

        app.get('/login-error', (req, res)=>{
          res.render('login-error')
        }
        )
        app.post(
          '/register',
          passport.authenticate('register', {
            successRedirect: '/login',
            failureRedirect: '/login-error',
            passReqToCallback: true
          })
        )

        app.use('/home'
                      ,async function (req, res, next) {
                        
                        if (req.session.passport==undefined)
                        {
                          
                          res.redirect('/login')
                        
                        } else {
                          

                          const id = req.session.passport['user']

                          const user = await User.findById (id)
                            
                          const userLogin = {user:{}}
                          userLogin['user']= user.nombre
                          userAdmin.push(userLogin)
                          next ()
                        
                        }
                      }
                      ,productosMg
        )


        //----METODO LOGOUT que destruye la sesion--------
        app.get('/logout', (req, res, next) => {

            req.logOut(function(err){
              if (err) {return next (err);}
              res.redirect('/login')
            })

            /*req.session.destroy((err) => {
            if (!err) {
                      res.redirect('logout.html')
            }else{ 
                      res.send({ status: 'logout Error', error: err })
            }
            })*/
        })

        //-----METODO para ver las cookies-----------------
        app.get('/cookies', (req, res) =>{
          res.send(req.cookies)
        })

        //----------------FIN SESSION---------------------------------------------

        app.get('/info'
          //,compression()
          ,async function (req, res){

          const objeto = {
            datos: {
              Argumentos: process.argv,
              SO: process.platform,
              NodeJSversion: process.version,
              TotalUsagedRAM: process.memoryUsage(),
              PathDeEjecucion: process.cwd(),
              IDprocess: process.pid,
              nCPUs: numCPUs,
            }
          }
          

            res.send({objeto})
        }
        )

        /*-----Respuesta a rutas no implementadas-----*/
        app.get('*', function(req, res){
          //res.sendFile(__dirname+’/public/error.html’);
          res.send('ruta no implementada')
          })

// OJO aca termina el IF//
}

