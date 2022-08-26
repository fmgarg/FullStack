const mongoose = require ('mongoose')

const modelCarrito = new mongoose.Schema ({
                        userId: {type: String, require: true, max: 255},
                        itemsCart: {type:[{ 
                            id: {type: Number, require: true},
                            title: {type: String, require: true, max: 100},
                            price: {type: Number, require: true},
                            description: {type: String, require: true, max: 255},
                            count: {type: Number, require: true},
                            image: {type: String, require: true, max: 255},
                            active: {type: Number, require: true},
                        }]}
})

module.exports = mongoose.model('carritos', modelCarrito)