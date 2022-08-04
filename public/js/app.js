
const URL = '/app/productos/landing'

fetch (URL) 

    .then (response => response.json ())

    .then ( data => {

                    for (const article of data) {

                            $('#contenedor-lista-productos').append(
                                `
                                    <div class="card">
                                        <img class="card-img-top" src="${article.image}" alt="se esperaba una imagen" />
                                        <div class="card-body p-4">
                                                <div class="text-center">
                                                    <h3 class="fw-bolder"> ${article.title}</h3>
                                                    <div class="star d-flex justify-content-center small text-warning mb-2">
                                                        <div class="bi-star-fill"></div>
                                                        <div class="bi-star-fill"></div>
                                                    </div>
                                                        <h4>PRECIO: $ ${article.price}.-</h4>
                                                        <h5>(Stock disponible ${article.count} unidades)</h5>
                                                </div>
                                                <div class="card-text description">
                                                    <p class="text-justify">${article.description}</p>
                                                </div>
                                        </div>
                                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                            <div class="text-center">      
                                                <button id="btn-${article.id}" class="btn btn-outline-dark mt-auto" onclick="location.href = '/app/productos/${article.id}'">   
                                                    detalle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `
                            )

                            let count = 1
                                
                                $(`#select-count-${article.id}`).change(( event ) => {
                                    count = +event.target.value
                                })

                                //console.log(count)
                                
                                //$(`#btn-${article.id}`).on('click', () => { })

                                
                        
                    }

                    
                    class ItemCarrito {
                        constructor (id, title, price, stock, cantidad, article) {
                            this.id = id
                            this.title = title
                            this.price = price
                            this.stock = stock
                            this.cantidad = cantidad
                            this.article = article
                        }
                    }
                    
                    //lista del carrito
                    let carrito = JSON.parse(localStorage.getItem('carrito')) || []


                    //metodo para agregar los itemCarrito al carrito
                    const addItemCarrito = (article) => {
                        const itemCarrito = carrito.find( itemCarrito => itemCarrito.id === article.id)
                        
                          
                        if (itemCarrito) {
                            console.log(carrito)
                            itemCarrito['cantidad'] = article.cantidad
                            itemCarrito['price'] = article.price
                            console.log('el producto ya existe en su carrito')
                    
                        } else {
                            
                            carrito.push(article)
                            console.log(carrito)
                        }
                       
                                
                        localStorage.setItem('carrito', JSON.stringify(carrito))  
                        
                        renderCarrito ()
                    }
                    
                    //metodo para hallar un itemCarrito por id
                    const findOne = (id) => {

                        const itemCarrito = carrito.find( itemCarrito => itemCarrito.id === id)
                    
                        if (!itemCarrito) {
                            throw new Error(`No existe el itemCarrito de id #${id}`)
                        }
                    
                        return itemCarrito
                    
                    }

                    //Metodo para eliminar un itemCarrito

                    const remove = (id) => {

                        const itemCarrito = findOne(id)
                        const index = carrito.indexOf(itemCarrito)
                        carrito.splice( index, 1)
                        localStorage.empty
                        localStorage.setItem('carrito', JSON.stringify(carrito))

                        
                    
                    }
                    

                    //Metodo para agregar 
                    const renderCarrito = () => {
                        $('#contenedor-carrito').empty()
                        for (let itemCarrito of carrito) {
                            $('#contenedor-carrito').append (
                            `
                            <tr>
                                <th scope="row" class="table__ID">${itemCarrito.id}</th>
                                <td id="table-producto"> ${itemCarrito.title}</td>
                                    <img src="" alt="">
                                    <td id="table-stock"> ${itemCarrito.stock}</td>
                                <td id="table-cantidad-${itemCarrito.id}">${itemCarrito.cantidad}</td>
                                <td id="table-precio-">${itemCarrito.price}</td>
                                <td><button id="btnDel${itemCarrito.id}" class="btn btnDel btn-outline-dark btn-danger">X</button></td>
                            </tr>
                            `
                            )
                            
                            //Metodo para obtener elementos del DOM
                            let btnDel = document.getElementsByClassName ("btnDel");
                            
                            $(`#btnDel${itemCarrito.id}`).on('click', () => {
                                console.log (itemCarrito.id)
                                remove(itemCarrito.id)
                                
                                document.location.reload()
                                console.log('producto eliminado')
                            })
    
                        }

                        carritoTotal ()
                        
                    }

                    function carritoTotal () {
                        
                        let Total = 0;
                        const itemCartTotal = document.querySelector ('#totalPrice')
                        carrito.forEach((itemCarrito) => {
                            const precio = itemCarrito.price
                            Total = Total += precio*itemCarrito.cantidad                        
                        });

                       
                        
                        $('#totalPrice').empty().append (`
                                                         <p class="borrar">$${Total}</p>
                                                         `)

                    }


                    renderCarrito ()

    
    })