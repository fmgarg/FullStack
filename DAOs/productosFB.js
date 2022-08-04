const express = require ('express')
const req = require('express/lib/request');
const res = require('express/lib/response');

const productosFB = express.Router ()

const fs = require('fs');

let productos = []

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
        const db = admin.firestore()
        const query = await db.collection ('productos')
            try {
                    const queryTodos = await query.get()
                    const response = await queryTodos.docs.map((doc)=> ({
                        id: doc.id,
                        title: doc.data().title,
                    }))
                    return response

            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }

    async save(producto) {
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

            const db = admin.firestore()
            const query = await db.collection ('productos')

            let doc = query.doc(`${newId}`)
            await doc.create (producto)
            console.log(`el nuevo objeto fue guardado con el id ${newId}`)
            }else{
                //----genero el nuevo id y guardo el producto
            let newId = maxId + 1

            const db = admin.firestore()
            const query = await db.collection ('productos')

            let doc = query.doc(`${newId}`)
            await doc.create (producto)
            console.log(`el nuevo objeto fue guardado con el id ${newId}`)
            }
        }
        catch (err) {
            console.log('no se pudo agregar');
        }
    }

    async getByID(ID) {
        try {
            const db = admin.firestore()
            const query = await db.collection ('productos')
            
            const doc = query.doc(`${ID}`)
            const item = await doc.get()
            const response = item.data()
             return response
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async deleteByID(ID) {
        try {
            const db = admin.firestore()
            const query = await db.collection ('productos')
            const doc = query.doc(`${ID}`)
            const item = await doc.delete()
            console.log("se borro el producto", item)
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async putByID(ID, news) {
        try {

            const db = admin.firestore()
            const query = await db.collection ('productos')
            
            const doc = query.doc(`${ID}`)
            const oldItem = await doc.get()
            const response = await oldItem.data()
            //console.log(response)

            if (response === undefined) { 
                console.log('el producto no existe')
                return ('el producto no existe')
            }else{
                //console.log(`aca se actualizara el producto del id:${ID}`)
                
                let title = news['title']
                let price = news['price']
                let description = news['description']
                let stock = news['stock']

                //console.log(news)
                let item = await doc.update({
                    title: title,
                    price: price,
                    description: description,
                    stock: stock
                })
                
                return ('el producto fue actualizado')

            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    /*async deleteAll() { 
        this.listaProductos = [];
        //aca hago algo
        });
        
    }*/

}

const items = new Contenedor ('productos.json');

/*----------FIREBASE-----------*/

var admin = require("firebase-admin");

var serviceAccount = require ('../basenodejs-b6ec8-firebase-adminsdk-pleil-3ab9bdd6b3.json') ;
//const firebaseConfig = require ('./basenodejs-b6ec8-firebase-adminsdk-pleil-3ab9bdd6b3.json') 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://basenodejs-b6ec8-default-rtdb.firebaseio.com"
});


//--------creacion de las rutas------------------------

//Pto "A" esta ruta permite listar todos los productos 
productosFB.get ('/', async (req, res)=>{
    let products = await items.getAll()
    res.json(products)
})

//Pto "A" esta ruta permite listar un producto por ID 
productosFB.get ('/:ID', async (req, res)=>{
    number = req.params.ID
    //console.log(number)
    let product = await items.getByID(number)
    res.json(product)
})

//Pto "B" ADM esta ruta permite incorporar un producto al listado de productos, asignando un ID de producto y timeStamp
productosFB.post('/',
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
        res.json({mensaje: 'se agrego correctamente '})
        }
)

//Pto "C" ADM esta ruta es para actualizar un producto por su ID
productosFB.put ('/:ID',
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
productosFB.delete ("/:ID", 
    function (req, res, next) {
        if (req.query.admin == 2){
            console.log('se conecto un admin')
            next ()
        } else {
            res.send ({ error: 'acceso no autorizado'})
        }

    },
    async (req, res)=>{
    number = req.params.ID
    //console.log(number)
    let products = await items.deleteByID(number)
    //console.log(product)
    res.json({mensaje: 'se elimino correctamente'})
})

//exportando el modulo
module.exports = productosFB