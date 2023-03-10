//Capturo los elementos del Html
let divJuegos = document.getElementById("juegos");
let carritoCompra = document.getElementById("botonCarrito");
let offcanvasRender = document.getElementById("offcanvasBody")

//Carrito de productos vacio, para luego llenarlo

let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];

//Funcion asincrona
//Creamos el div para mostrar las cards en el Html
const traerProductos = async() => {
    const response = await fetch("productos.json");
    const data = await response.json();
    
    for (let juego of data){
        let nuevoJuegoDiv = document.createElement("div")
    nuevoJuegoDiv.className = "col-12 col-md-6 col-lg-4 col-xl-2 my-3"
    nuevoJuegoDiv.innerHTML = `
        <div id="${juego.id}" class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 390px;"src="img/${juego.imagen}" alt="${juego.titulo} de ${juego.genero}">
            <div class="card-body">
                <h4 class="card-title">${juego.titulo}</h4>
                <p>Genero: ${juego.genero}</p>
                <p class="">Precio: $${juego.precio}</p>
                <div class="d-grid gap-2">
                <button id="agregarBtn${juego.id}" class="btn btn-warning fs-5 fw-bolder text-dark">Agregar al carrito</button>
                </div>
            </div>
        </div> 
        `

        divJuegos.append(nuevoJuegoDiv);
        
        //Agregamos los productos al carrito mediante un boton de añadir
        let agregarBtn = document.getElementById(`${juego.id}`)
        
        agregarBtn.addEventListener("click", () =>{
            carritoProductos.push({
                id : juego.id,
                imagen : juego.imagen,
                titulo : juego.titulo,
                genero : juego.genero,
                precio : juego.precio
            })
            //Agrego Toastify como método de notificación.
            Toastify({
                text: `El producto ${juego.titulo} ha sido agregado correctamente! 🐉`,
                duration: 1500,
                newWindow: false,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#F14500",
                  color: "#fff",
                },
              }).showToast();

              guardarProductos()
        })

    }

    //Guardamos los productos en el LocalStorage
    const guardarProductos = () => {
        carritoProductos.length > 0 && localStorage.setItem("carrito", JSON.stringify(carritoProductos))
      };
}

traerProductos();



//offcanvas de carrito

const mostrarCarrito = () => {
    offcanvasBody.innerHTML = "";
    carritoProductos.forEach((juego) => {
        let carritoContent = document.createElement("div")
        carritoContent.innerHTML = `
        <img src="img/${juego.imagen}">
        <h3>${juego.titulo}</h3>
        <p>$${juego.precio}</p>
        <button class="btnEliminar" id="btnEliminar">Eliminar</button>
        <hr>` 
        offcanvasBody.append(carritoContent) 


            let eliminarP = carritoContent.querySelector(".btnEliminar")

            eliminarP.addEventListener("click", () => {
                eliminarProducto(juego.id)
                Toastify({
                    text: `El producto ${juego.titulo} ha sido eliminado del carrito.`,
                    duration: 2000,
                    newWindow: false,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                      background: "red",
                      color: "white",
                    },
                  }).showToast();
            })

            
            
    })
        //calculamos el total de los productos usando Reduce
        const total = carritoProductos.reduce((acc, elemento) => acc + elemento.precio, 0);
    
        const totalCompra = document.createElement("div")
        totalCompra.className = "compraTotal"
        totalCompra.innerHTML = `Total a pagar: $${total}`
        offcanvasBody.append(totalCompra)
        
    
        const actions = document.createElement("div")
        actions.className = "botones"
        actions.innerHTML = `<div class="d-grid gap-2 d-md-block">
        <button id="finalizar" class="btn btn-primary" type="button">Comprar</button>
      </div>`
        offcanvasBody.append(actions)
    
        let compra = document.getElementById("finalizar")
        compra.addEventListener("click", (finalizarCompra) )
    
}

carritoCompra.addEventListener("click", (mostrarCarrito))

//Eliminamos un producto, quitándolo también del LocalStorage
const eliminarProducto = (id) => {
    const foundId = carritoProductos.find((data) => data.id === id);
  
    carritoProductos = carritoProductos.filter((carritoId) => {
      return carritoId !== foundId;
    });
    
    localStorage.setItem("carrito", JSON.stringify(carritoProductos))
    mostrarCarrito();
  };



  //finalizamos la compra

  function finalizarCompra(totalCompra)  {
    if(carritoProductos.length === 0){
        Swal.fire({
            title: 'No hay nada en su carrito',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          })          
    }else
    Swal.fire({
        title: '¿Desea finalizar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then( (result)=> {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Compra realizada',
                    icon: 'success',
                    confirmButtonColor: '#317f43',
                    text: `Gracias por su compra, esperamos que vuelva! `,
                    })
                carritoProductos = []
                localStorage.removeItem("carrito")    
                offcanvasBody.innerHTML = `<h2>Muchas gracias por tu compra! :D</h2>`;
            }else{
                Swal.fire({
                    title: 'Compra no efectuada',
                    icon: 'info',
                    text: `Compra no efectuada, tus productos seguiran en el carrito`,
                    confirmButtonColor: 'goldenrod',
                    timer:3500
                })
            }
    })

}