const express = require ('express')
const req = require('express/lib/request')

const carritoMg = express.Router ()

const fs = require('fs');

const mongoose = require ('mongoose')
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
            const modelCarrito = require ('../models/modelCarrito')

            const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                    let bddConnect = await mongoose.connect (URL, {
                        useNewUrlParser: true, 
                        useUnifiedTopology: true
                        })
            try {
                let response = await modelCarrito.find()
                return response
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

    async save(cartItem, cartId, userId) {
            const mongoose = require ('mongoose')
            const modelCarrito = require ('../models/modelCarrito')

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
                    let response = await modelCarrito.insertMany(cart)
                    return response

                }else {                
                    //console.log('el CART existe se agregan los items')
                    //console.log(cartItem)

                    let id = cartItem['id']
                    let title = cartItem['title']
                    let price = cartItem['price']
                    let description = cartItem['description']
                    let count = cartItem['count']
                    let image = cartItem['image']
                    let active = cartItem['active']


                    let response = await modelCarrito.updateOne({userId: userId},{
                        $push:{
                                itemsCart:{
                                            $each:[{
                                                id:id,
                                                title:title,
                                                price:price,
                                                description:description,
                                                count:count,
                                                image:image,
                                                active:active}]
                                          }
                                }})
                    return ('se agrego un producto')
                }                                                                        
        }
        catch (err) {
            console.log('no se pudo agregar');
        }
    }

    async getByID(userId) {
        const mongoose = require ('mongoose')
        const modelCarrito = require ('../models/modelCarrito')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

            try {
                let products = await items.getAll()
                //console.log(products)
                let buscarProductoXId = products.filter(elem => elem.userId == userId);
                //console.log(buscarProductoXId)
                if (buscarProductoXId == null){                
                    console.log('el producto no existe');
                }else{
                    //console.log(buscarProductoXId);
                    return (buscarProductoXId)
                }
            } catch (error) {
                console.error(`Error: ${error}`);
            }
    }

    async deleteByID(ID, cartId, userId) {
        const mongoose = require ('mongoose')
        const modelCarrito = require ('../models/modelCarrito')

        const URL = process.env.MGATLAS//'mongodb://127.0.0.1:27017/ecommerce'
                let bddConnect = await mongoose.connect (URL, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                    })

        try {
            let cart = await items.getByID(cartId)
            
            //aca deconstruyo el carrito para poder trabajar sobre los productos
            let articulos = cart[0]
            let articulosArr = articulos.itemsCart
            //console.log(articulosArr)


            const itemToDel = articulosArr.filter ((item) => item.id == ID);
            //console.log(itemToDel)

            if (itemToDel.length === 0) { 
                console.log('no se ubico el producto a eliminar')
            }else{
                console.log('aca se eliminara el producto del carrito')
                
                //aca elimino el item del carrito
                const resultado = articulosArr.filter ((item) => item.id !== ID)
                //console.log(resultado)

                //aca reconstruyo el carrito
                const updatedCart = {userId, itemsCart : resultado}
                //updatedCart.itemsCart.push(resultado)
                console.log(updatedCart)

                //aca busco el indice del carrito a actualizar
                const index = productos.findIndex(item => item.userId === userId)
                //console.log(index)

                //aca reemplazo el carrito old por el updated
                productos.splice (index, 1,updatedCart )
                console.log(productos)

                //aca escribo el cartcontainer con la nueva info
                await fs.writeFile('./carrito.json', JSON.stringify(productos, null, 4), error =>{
                        if(error){
                        } else {
                        console.log("carrito actualizado.")
                        }
                })
                

                return resultado
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async deleteCartByID(cartId, userId) {
        const mongoose = require ('mongoose')
        const modelCarrito = require ('../models/modelCarrito')

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
        const modelCarrito = require ('../models/modelCarrito')

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
        const modelCarrito = require ('../models/modelCarrito')

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
carritoMg.get ('/', async (req, res)=>{    

    if(req.session.cookie.maxAge>=1){
        let userLoggedId = req.session.passport.user
        //console.log('estoy en ./carrito')
        res.redirect(`carrito/${userLoggedId}`)
    }else{
        res.redirect('/login')
    }
})

carritoMg.get('/:userID', async (req, res)=>{

    userId = req.params.userID
    //console.log(userId)
    let itemsCart = await items.getByID(userId)
    let artsCart = itemsCart[0].itemsCart
    console.log(artsCart)
    let uno = JSON.stringify(artsCart)
    console.log(uno)
    let dos = JSON.parse(uno)
    console.log(dos)

    
    //res.json(product)
    res.render('cart',{suggestedChamps: dos, listExists: true})
})

// PTO "A" y "D" es para crear un carrito, crear el cartId, y para agregar productos al carrito por su ID de producto.
carritoMg.post('/', async (req, res)=>{

  userId = req.session.passport.user
  cartItem = req.body
  cartId = {}
  cartId ['cartId'] = req.session.passport.user

  let newProduct = await items.save (cartItem, cartId, userId)
  res.json({mensaje: 'Se creo un carrito'})
})


// PTO "B" vacia un carrito y lo elimina por cartId
carritoMg.delete ('/:cartId', async (req, res)=>{
    cartId = JSON.parse(req.params.cartId)
    //console.log(cartId)
    userId = JSON.parse(req.params.cartId)
    //console.log(userId)

    let product = await items.deleteCartByID(cartId, userId)
    //console.log(products)
    //res.json(products)

    res.json(product)
})


// PTO "C" esta ruta lista todos los productos de un id de carrito  
carritoMg.get ('/:cartId/' // '/:cartId/productos'
    , async (req, res)=>{
    userId = JSON.parse(req.params.cartId)
    //console.log(number)
    let product = await items.getByID(userId)
    res.json(product)
})

// PTO "E" aca la ruta a implementar es :cartId/productos/:id  Elimina un producto por idCart & ID de producto
carritoMg.delete ("/:cartId/productos/:prodId", async (req, res)=>{
    cartId = JSON.parse(req.params.cartId)
    prodId = JSON.parse(req.params.prodId)
    userId = JSON.parse(req.params.cartId)
    //console.log(number)
    let products = await items.deleteByID(prodId, cartId, userId)
    //console.log(product)
    res.json(products)
})

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
module.exports = carritoMg