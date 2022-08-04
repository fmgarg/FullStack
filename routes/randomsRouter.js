const express = require ('express')

const req = require('express/lib/request')
const { redirect } = require('express/lib/response')

const randomsRouter = express.Router ()

const {fork} = require ('child_process')

const forked = fork('./calc.js')

randomsRouter.get ('/', async (req, res)=>{
    
    

    if(req.query.cant == undefined){
        
        let cant = 5
        await forked.send(cant)
        forked.on ('message', (rtdo)=>{
            console.log('aca sin parametros')
            res.send(`el calculo da como resultado: ${rtdo}`)
        })
        
    }else{
        let cant = parseInt(req.query.cant)
        await forked.send(cant)
        forked.on ('message', (rtdo)=>{
            console.log(`aca con parametros${req.query.cant}`)
            res.send(`el calculo da como resultado: ${rtdo}`)
        })
    }
    
    //number = JSON.parse(req.query.cant)
    //console.log(`aca por la cantidad ${number}`)

})

//exportando el modulo
module.exports = randomsRouter;

