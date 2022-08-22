const socket = io.connect()

socket.on('mi mensaje', (data) => {
  alert(data)
  socket.emit('notificacion', 'mensaje recibido con exito')
})

let hora = new Date ()

function renderMSG(data) {
  const html = data
    .map((elem, index) => {
      return `
            <div class="container">
                  <ul class="list-inline">
                        <li class="list-inline-item"><strong class="text-primary">Author: ${elem.author}</strong><p class="text-warning">${elem.timeStamp}</p></li>
                        <li class="list-inline-item font-italic text-success"><em>${elem.text}</em></li> 
                  </ul>
            </div>
            `
    })
    .join(' ')
  document.getElementById('mensajes').innerHTML = html
}

socket.on('messages', function (data) {
  renderMSG(data)
})

function addMessage(e) {
  const mensaje = {
    author: document.getElementById('username').value,
    text: document.getElementById('texto').value,
    timeStamp: hora.toString(),
  }
  socket.emit('new-message', mensaje)
  return false
}

function renderProductos(data) {
  const html = data
    .map((article, index) => {
      return `
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
                  <button id="btn-${article.id}" class="btn btn-outline-dark mt-auto" onclick="location.href = '/productos/${article.id}'">   
                      detalle
                  </button>
              </div>
          </div>
      </div>
      `
    })
    .join(' ')
  document.getElementById('tabla-productosSocket').innerHTML = html
}

socket.on('socketProductos', function (data) {
  renderProductos(data)
})

function addProduct(e) {
  const newProduct = {
    title: document.getElementById('title').value,
    price: document.getElementById('price').value,
    image: document.getElementById('image').value,
    timeStamp: hora.toString(),
  }
  socket.emit('nuevo-producto', newProduct)
  return false
}

socket.on('socketUser', function (data) {
  renderUser(data)
})

function renderUser(data) {
  const html = data
    .map((elem, index) => {
      return `
            <a class="btn btn-outline-dark"  type="submit" href="/home">
                <h9>User: ${elem.user}</h9>
                <p class="badge bg-dark text-white ms-1 rounded-pill" id="totalPrice" ></p>
            </a>
            `
    })
    .join(' ')
  document.getElementById('tabla-user').innerHTML = html
}