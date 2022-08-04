const express = require ('express')
const req = require('express/lib/request')

const carritoFB = express.Router ()

const fs = require('fs');

const nombreArchivo = 'carrito.json'

let productosNotParse = fs.readFileSync('./carrito.json', 'utf-8')
//console.log(productosNotParse)
let productos = JSON.parse(productosNotParse)
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
            try {

                if (this.listaProductos !== []) {
                    //console.log(productosParse)
                    return productos;
                } else {
                    throw 'no hay productos para mostrar'
                }

            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

    async save(producto, cartId, userId) {
        try {
            
            let carritoExiste = await items.getByID (userId)

            //console.log(carritoExiste)

            if (carritoExiste.length === 0){
                let cart = {userId, itemsCart : []}
                cart.itemsCart.push(producto)
                //cart ["elementos"] = producto
                //console.log(cart)
                productos.push(cart)
                //console.log(`el nuevo carrito tiene el id ${userId}`)
                
                await fs.writeFile('./carrito.json', JSON.stringify(productos, null, 4), error =>{
                        if(error){
                        } else {
                        console.log("se guardo un nuevo producto.")
                        }
                })
            }else {                
                console.log('este es el else')

                //--------traigo el carrito viejo----------
                const oldCart = await items.getByID (userId)
                //--------creo el carrito actualizado con nuevo productos----------
                const updatedCart = oldCart[0]
                updatedCart.itemsCart.push (producto)
                console.log(updatedCart.itemsCart)
                
                //-----------busco el carrito por userId y le sumo el nuevo item/ producto----------
                const index = productos.findIndex(item => item.userId === userId)
                //console.log(index)
                productos.splice (index, 1,updatedCart )
                //console.log(productos)
                

                //----------escribo el file del carrito con la actualizacion------
                await fs.writeFile('./carrito.json', JSON.stringify(productos, null, 4), error =>{
                    if(error){
                    } else {
                    console.log("se agrego un producto a su carrito")
                    }
                })
                
            }                                                                        
        }
        catch (err) {
            console.log('no se pudo agregar');
        }
    }

    async getByID(userId) {
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
carritoFB.get ('/', async (req, res)=>{
    let products = await items.getAll()
    res.json(products)
})

// PTO "A" y "D" es para crear un carrito, crear el cartId, y para agregar productos al carrito por su ID de producto.
carritoFB.post('/', async (req, res)=>{
  //console.log(req.body)

  userId = JSON.parse(req.query.user)

  cartId = {}
  cartId ['cartId'] = userId
  //console.log(cartId)

  let newProduct = await items.save (req.body, cartId, userId)
  //productos.push(req.body)
  res.json({mensaje: 'Se creo un carrito'})
})


// PTO "B" vacia un carrito y lo elimina por cartId
carritoFB.delete ('/:cartId', async (req, res)=>{
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
carritoFB.get ('/:cartId/productos', async (req, res)=>{
    userId = JSON.parse(req.params.cartId)
    //console.log(number)
    let product = await items.getByID(userId)
    res.json(product)
})

// PTO "E" aca la ruta a implementar es :cartId/productos/:id  Elimina un producto por idCart & ID de producto
carritoFB.delete ("/:cartId/productos/:prodId", async (req, res)=>{
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
module.exports = carritoFB