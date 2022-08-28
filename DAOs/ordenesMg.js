const express = require ('express')
const req = require('express/lib/request')

const ordenesMg = express.Router ()

const fs = require('fs');

const mongoose = require ('mongoose');
const modelCarrito = require('../models/modelCarrito');
const modelOrden = require('../models/modelOrden');
const User = require ('../models/modelUsers')

const nombreArchivo = 'carrito.json'

let productosNotParse = fs.readFileSync('./carrito.json', 'utf-8')

let productos = JSON.parse(productosNotParse)



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
            const modelOrden = require ('../models/modelOrden')

            const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                    let bddConnect = await mongoose.connect (URL, {
                        useNewUrlParser: true, 
                        useUnifiedTopology: true
                        })
            try {
                let response = await modelOrden.find()
                return response
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

    async save(cartItem, cartId, userId) {
            const mongoose = require ('mongoose')
            const modelOrden = require ('../models/modelOrden')

            const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                    let bddConnect = await mongoose.connect (URL, {
                        useNewUrlParser: true, 
                        useUnifiedTopology: true
                        })
            try {
                
                let carritoExiste = await items.getByID (userId)

                if (carritoExiste.length === 0){
                    let cart = {userId, itemsCart : []}
                    cart.itemsCart.push(cartItem)
                    let response = await modelOrden.insertMany(cart)
                    return response

                }else {                
                    //console.log('el CART existe se agregan los items')
                    console.log(cartItem)

                    let id = cartItem['id']
                    let title = cartItem['title']
                    let price = cartItem['price']
                    let description = cartItem['description']
                    let count = cartItem['count']
                    let image = cartItem['image']
                    let active = cartItem['active']
                    let cartUserId = cartItem['cartUserId'] 


                    let response = await modelOrden.updateOne({userId: userId},{
                        $push:{
                                itemsCart:{
                                            $each:[{
                                                id:id,
                                                title:title,
                                                price:price,
                                                description:description,
                                                count:count,
                                                image:image,
                                                active:active,
                                                cartUserId:cartUserId}]
                                          }
                                }})
                    return ('se agrego un producto')
                }                                                                        
        }
        catch (err) {
            console.log('no se pudo agregar');
        }
    }

    async getCartByID(userId) {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')
        const modelCarrito = require ('../models/modelCarrito')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

            try {
                console.log('estoy en try de getByCartId')
                let busqueda = await modelCarrito.findOne({userId:userId})
                let busquedaString = JSON.stringify(busqueda)
                let busquedaParse = JSON.parse(busquedaString)
                //console.log(busquedaParse)
                return (busquedaParse) 
            } catch (error) {
                console.error(`Error: ${error}`);
            }
    }

    async getOrderByID(userId) {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')
        const modelCarrito = require ('../models/modelCarrito')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

            try {
                console.log('estoy en try de getOrderById')
                let busqueda = await modelOrden.findOne({userId:userId})
                let busquedaString = JSON.stringify(busqueda)
                let busquedaParse = JSON.parse(busquedaString)
                //console.log(busquedaParse)
                return (busquedaParse) 
            } catch (error) {
                console.error(`Error: ${error}`);
            }
    }

    async deleteByID(cartUserId, id) {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

        try {
                const resultado = await modelOrden.updateOne ({ userId: cartUserId },{
                    $pull:{
                        itemsCart:{id:id}
                        }    
                }) 
                return resultado
        
        }catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async deleteCartByID(cartId, userId) {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
        try {

            //aca busco el indice del carrito a eliminar
            const index = productos.findIndex(item => item.userId === userId)
            console.log(index)
            

            if (index.length === 0) { 
                console.log('no se ubico el carrito a eliminar')
            }else{
                console.log('aca se eliminara el carrito del cartContainer')

                
                //aca elimino el carrito por su index
                productos.splice (index, 1)
                //console.log(productos)
                

                
                //aca escribo el cartcontainer con la nueva info
                await fs.writeFile('./carrito.json', JSON.stringify(productos, null, 4), error =>{
                        if(error){
                        } else {
                        console.log("contenedor de carritos actualizado.")
                        }
                })
                

                return productos
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async putByID(ID, newPrice) {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })
        try {
            let products = await items.getAll()
            //console.log(products)
            const encontrado = products.filter ((item) => item.id == ID);
            //console.log(encontrado)
            if (encontrado.length === 0) { 
                console.log('el producto no existe')
            }else{
                const respuesta = {}
                //console.log(respuesta)
                respuesta.anterior = encontrado
                //console.log(respuesta.anterior)
                
                //const indexElem = encontrado.findIndex(elem => elem === "price")
                //console.log (indexElem)
                let newProp = newPrice['price']
                //console.log(newProp)

                respuesta.actualizada = newPrice
                //console.log(respuesta.actualizada)

                const producto = await items.getByID (ID)
                const indexObjeto = products.indexOf(producto)
                productos.splice(indexObjeto, 1, newPrice)
                return respuesta




                /*const resultado = productos.filter ((item) => item.id !== ID)
                       // console.log('producto eliminado')
                        const producto = await items.getByID (ID)
                        const index = products.indexOf(producto)
                        productos.splice (index, 1)
                 return resultado
                 */
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async deleteAll() {
        const mongoose = require ('mongoose')
        const modelOrden = require ('../models/modelOrden')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

        this.listaProductos = [];
        await fs.writeFile('./carrito.json', JSON.stringify(this.listaProductos, null, 4), error =>{
            if(error){
            } else {
            console.log("Se eliminaron todos los productos del contenedor.")
            }
        });
        
    }

}

const items = new Contenedor ('carrito.json');


//---------------------------------------------------------creacion de las rutas--------------------------------------------------------------------------

//esta ruta lista todos los carritos PTO0

ordenesMg.get ('/', async (req, res)=>{    
    console.log('estoy en ./orden/save')
    const mongoose = require ('mongoose')
    const modelOrden = require ('../models/modelOrden')
    const modelCarrito = require ('../models/modelCarrito')


    const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
            let bddConnect = await mongoose.connect (URL, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
                })


    if(req.session.cookie.maxAge>=1){

        let userLoggedId = req.session.passport.user

        let itemsCart = await items.getCartByID(userLoggedId)
        console.log(itemsCart)
        console.log('se guarda newOrder antes de ir al render')
        let newOrder = await modelOrden.insertMany(itemsCart)
        let delOldCart = await modelCarrito.deleteOne({userId: userLoggedId})
        
        
        
        res.redirect(`orden/${userLoggedId}`)
    }else{
        res.redirect('/login')
    }
})

ordenesMg.get('/:userID', async (req, res)=>{

    userId = req.params.userID
    console.log('estoy en ./orden/:userId')
    let itemsOrder = await items.getOrderByID(userId)
    //res.send('aca se ve la orden del user')
    res.render('order',{myOrden: itemsOrder.itemsCart, listExists: true})
})

/*
// PTO "A" y "D" es para crear un carrito, crear el cartId, y para agregar productos al carrito por su ID de producto.
ordenesMg.post('/', async (req, res)=>{

  userId = req.session.passport.user
  cartItem = req.body
  cartItem['cartUserId'] = userId
  //console.log('aca se crea el item del cart')
  //console.log(cartItem)
  cartId = {}
  cartId ['cartId'] = req.session.passport.user

  let newProduct = await items.save (cartItem, cartId, userId)
  res.redirect('/carrito')//res.json({mensaje: 'Se creo un carrito'})
})*/

/*
// PTO "E" aca la ruta a implementar es :cartId/productos/:id  Elimina un producto por idCart & ID de producto
ordenesMg.post('/:cartUserId/item/:id', async (req, res)=>{
    console.log('esta ruta eliminara items del userCart')

    //console.log(req.params)

    let cartUserId = req.params.cartUserId
    //console.log(cartUserId)
    let id = req.params.id

    let products = await items.deleteByID(cartUserId, id)
    //console.log(product)
    res.redirect('/carrito')
})*/

/*
// PTO "B" vacia un carrito y lo elimina por cartId
ordenesMg.delete ('/:cartId', async (req, res)=>{
    cartId = JSON.parse(req.params.cartId)
    //console.log(cartId)
    userId = JSON.parse(req.params.cartId)
    //console.log(userId)

    let product = await items.deleteCartByID(cartId, userId)
    //console.log(products)
    //res.json(products)

    res.json(product)
})*/

/*
// PTO "C" esta ruta lista todos los productos de un id de carrito  
ordenesMg.get ('/:cartId/' // '/:cartId/productos'
    , async (req, res)=>{
    userId = JSON.parse(req.params.cartId)
    //console.log(number)
    let product = await items.getByID(userId)
    res.json(product)
})*/

/*
// ------------ruta no implementada-----------
carritoRouter.put ('/:ID', async (req, res)=>{
    //console.log(req.body)
    let newPrice = req.body
    //number = JSON.parse(req.params.ID)
    //console.log(number)
    let putProduct = await items.putByID(req.params.ID, newPrice)
    res.json(putProduct)
})
*/

//exportando el modulo
module.exports = ordenesMg