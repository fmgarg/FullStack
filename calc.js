let rtdo = 0

process.on('message', (cant)=>{
    console.log(cant)
    const rtdo = cant * 10
    process.send(`funciona ${rtdo}`)
})