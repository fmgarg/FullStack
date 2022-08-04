const express = require ('express')

const productosMg = express.Router ()

const fs = require('fs');

const nombreArchivo = 'productos.json'

let productos = []



//console.log(productos)

const newObjeto = {
    "title":"Pez Globo",                                                                                                                          
    "price": 345.67,                                                                                                                                     
    "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"                                   
}

class Contenedor {
       
    constructor ( productos, newObjeto){
        this.listaProductos = productos
        this.objeto = newObjeto
        };

    async getAll() {

        const mongoose = require ('mongoose')
        const modelProducto = require ('../models/productoEsquema')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
                //console.log('base de datos conectada')

            try {
                
                let response = await modelProducto.find()
                //productos.push(response)
                return response

                /*
                if (this.listaProductos !== []) {
                    //console.log(productosParse)
                    return productos;
                } else {
                    throw 'no hay productos para mostrar'
                }*/

            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

    async save(producto) {
        const mongoose = require ('mongoose')
        const modelProducto = require ('../models/productoEsquema')

        const URL = process.env.MGATLAS //'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
                console.log('base de datos conectada')

        try {
            //----traigo todos los productos, genero un array con los id, lo parseo y busco el valor maximo
            let products = await items.getAll()
            let productsIds = products.map(id => id.id)
            let ids = productsIds.map(id => +id)
            //console.log(ids)
            let maxId = Math.max(...ids)

            if(ids.length === 0){
            //----genero el nuevo id y guardo el producto
            let newId = 1

            let mercancia = producto

            mercancia ["id"] = newId

            let response = await modelProducto.insertMany(mercancia)
            return response

                
            //console.log(`NO habia productos entonces ${producto} fue guardado con el id ${newId}`)
            }else{
                //----genero el nuevo id y lo inserto en producto = mercancia
                let newId = maxId + 1

                let mercancia = producto

                mercancia ["id"] = newId

                let response = await modelProducto.insertMany(mercancia)
                return response

                //console.log(mercancia)
                
            //console.log(`Habia productos entonces ${mercancia} fue guardado con el id ${newId}`)
            }
           

        }
        catch (err) {
            console.log('no se pudo agregar');
        }
    }

    async getByID(ID) {
        const mongoose = require ('mongoose')
        const modelProducto = require ('../models/productoEsquema')

        const URL = process.env.MGATLAS //'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
                console.log('base de datos conectada')
        try {

            let response = await modelProducto.find({id: ID})
            return response 
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async deleteByID(ID) {
        const mongoose = require ('mongoose')
        const modelProducto = require ('../models/productoEsquema')

        const URL = process.env.MGATLAS //'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
                console.log('base de datos conectada')

        try {

            let response = await modelProducto.deleteOne({id: ID})
            return response 
            
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async putByID(ID, news) {
        const mongoose = require ('mongoose')
        const modelProducto = require ('../models/productoEsquema')

        const URL = process.env.MGATLAS //'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
                console.log('base de datos conectada')

        try {
            let response = await modelProducto.find({id: ID})
            console.log(response)

            if (response === undefined) { 
                console.log('el producto no existe')
                return ('el producto no existe')
            }else{
                //console.log(`aca se actualizara el producto del id:${ID}`)
                
                let title = news['title']
                let price = news['price']
                let description = news['description']
                let stock = news['stock']

                let item = await modelProducto.updateOne({id: ID}, {
                    $set:
                    {title: title,
                    price: price,
                    description: description,
                    stock: stock}
                })
                //console.log ('el producto fue actualizado')
                return ('el producto fue actualizado')
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }


    /*async deleteAll() { 
        this.listaProductos = [];
        await fs.writeFile('./productos.json', JSON.stringify(this.listaProductos, null, 4), error =>{
            if(error){
            } else {
            console.log("Se eliminaron todos los productos del contenedor.")
            }
        });    
    }*/

}

const items = new Contenedor ('productos.json');


//---------------------------------------------------------creacion de las rutas--------------------------------------------------------------------------

//Pto "A" esta ruta permite listar todos los productos 
productosMg.get ('/', async (req, res)=>{
    let products = await items.getAll()
    fakeApi = ()=> products
    //console.log(req.session.cookie.maxAge)
    if(req.session.cookie.maxAge>=1){
        res.render('home')//, {suggestedChamps: fakeApi(), listExists: true})
    }else{
        res.redirect('/login')
    }
})

productosMg.get ('/landing', async (req, res)=>{
    let products = await items.getAll()
    
    res.send(products)
})

//Pto "A" esta ruta permite listar un producto por ID 
productosMg.get ('/:ID'

                        ,async function (req, res, next) {
                                                                    
                            if (req.session.passport==undefined)
                            {
                            
                            res.redirect('/login')
                            
                            } else {
                            

                            /*const id = req.session.passport['user']

                            const user = await User.findById (id)
                                
                            const userLogin = {user:{}}
                            userLogin['user']= user.nombre
                            userAdmin.push(userLogin)*/

                            next ()
                            
                            }
                        }

                        , async (req, res)=>{
                            number = JSON.parse(req.params.ID)
                            //console.log(number)
                            let product = await items.getByID(number)
                            //aca modifico el objeto de mongo para poder trabajarlo y renderizarlo con hbs
                            let prod = JSON.stringify(product[0])
                            let prodParse = JSON.parse(prod)
                            //console.log(prodParse.id)
                            //aca renderizo el hbs Item con el partial itemDetail
                            res.render("item.hbs",{item: prodParse, listExists: true})
})

//Pto "B" ADM esta ruta permite incorporar un producto al listado de productos, asignando un ID de producto y timeStamp
productosMg.post('/',
        function (req, res, next) {
            if (req.query.admin == 2){
                console.log('se conecto un admin')
                next ()
            } else {
                res.send ({ error: 'acceso no autorizado'})
            }

        },
        async (req, res)=>{
        console.log(req.body)
        let newProduct = await items.save (req.body)
        //productos.push(req.body)
        res.json(newProduct)
        }
)

//Pto "C" ADM esta ruta es para actualizar un producto por su ID
productosMg.put ('/:ID',
    function (req, res, next) {
        if (req.query.admin == 2){
            console.log('se conecto un admin')
            next ()
        } else {
            res.send ({ error: 'acceso no autorizado'})
        }

    },
    async (req, res)=>{
        //console.log(req.body)
        let news = req.body
        //number = JSON.parse(req.params.ID)
        //console.log(number)
        let putProduct = await items.putByID(req.params.ID, news)
        res.json ({ putProduct})
})

//Pto "D" ADM esta ruta es para eliminar un producto por su ID
productosMg.delete ("/:ID", 
    function (req, res, next) {
        if (req.query.admin == 2){
            console.log('se conecto un admin')
            next ()
        } else {
            res.send ({ error: 'acceso no autorizado'})
        }

    },
    async (req, res)=>{
    number = JSON.parse(req.params.ID)
    //console.log(number)
    let products = await items.deleteByID(number)
    //console.log(product)
    res.json(products)
})

//exportando el modulo
module.exports = productosMg