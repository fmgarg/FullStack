const mongoose = require ('mongoose')

const productosEsquema = new mongoose.Schema ({
                        _id: { type: String },
                        id: {type: Number, require: true},
                        title: {type: String, require: true, max: 100},
                        price: {type: Number, require: true},
                        description: {type: String, require: true, max: 255},
                        category: {type: String, require: true, max: 100},
                        image: {type: String, require: true, max: 255},
                        active: {type: Number, require: true},
                        count: {type: Number, require: true},
                        userId: {type: String, require: true, max: 255},
})

module.exports = mongoose.model('productos', productosEsquema)
