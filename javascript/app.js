let divJuegos = document.getElementById("juegos");
let carritoCompra = document.getElementById("botonCarrito");
let offcanvasRender = document.getElementById("offcanvasBody");

let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];

const traerProductos = async () => {
  const response = await fetch("productos.json");
  const data = await response.json();

  for (let juego of data) {
    let nuevoJuegoDiv = document.createElement("div");
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
        `;

    divJuegos.append(nuevoJuegoDiv);

    let agregarBtn = document.getElementById(`${juego.id}`);

    agregarBtn.addEventListener("click", () => {
      const productoExistente = carritoProductos.find(
        (producto) => producto.id === juego.id
      );

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carritoProductos.push({
          id: juego.id,
          imagen: juego.imagen,
          titulo: juego.titulo,
          genero: juego.genero,
          precio: juego.precio,
          cantidad: 1,
        });
      }

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

      guardarProductos();
    });
  }

  const guardarProductos = () => {
    carritoProductos.length > 0 &&
      localStorage.setItem("carrito", JSON.stringify(carritoProductos));
  };
};

traerProductos();

// document.addEventListener("DOMContentLoaded", () => {
//   const searchInput = document.getElementById("searchInput");

//   searchInput.addEventListener("input", () => {
//     const searchText = searchInput.value.toLowerCase();
//     const juegos = document.querySelectorAll(".card");

//     juegos.forEach((juego) => {
//       const titulo = juego
//         .querySelector(".card-title")
//         .textContent.toLowerCase();
//       if (titulo.includes(searchText)) {
//         juego.style.display = "grid";
//         juego.style.justifyContent = "center";
//         juego.style.alignContent = "center";
//       } else {
//         juego.style.display = "none"; // Ocultar elementos no coincidentes
//       }
//     });

//     // Reorganizar el orden de los elementos en el contenedor
//     const divJuegos = document.getElementById("juegos");
//     Array.from(juegos)
//       .sort((a, b) => {
//         if (a.style.display === "none" && b.style.display !== "none") return 1;
//         if (a.style.display !== "none" && b.style.display === "none") return -1;
//         return 0;
//       })
//       .forEach((juego) => divJuegos.appendChild(juego));
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const noResultMessage = document.getElementById("noResultMessage"); // Agrega el elemento donde mostrar el mensaje

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const juegos = document.querySelectorAll(".card");

    let resultadosEncontrados = 0; // Variable para contar los resultados

    juegos.forEach((juego) => {
      const titulo = juego
        .querySelector(".card-title")
        .textContent.toLowerCase();
      if (titulo.includes(searchText)) {
        juego.style.display = "grid";
        juego.style.justifyContent = "center";
        juego.style.alignContent = "center";
        resultadosEncontrados++;
      } else {
        juego.style.display = "none"; // Ocultar elementos no coincidentes
      }
    });

    if (resultadosEncontrados === 0) {
      noResultMessage.style.display = "block"; // Muestra el mensaje si no hay resultados
    } else {
      noResultMessage.style.display = "none"; // Oculta el mensaje si hay resultados
    }

    // Reorganizar el orden de los elementos en el contenedor
    const divJuegos = document.getElementById("juegos");
    Array.from(juegos)
      .sort((a, b) => {
        if (a.style.display === "none" && b.style.display !== "none") return 1;
        if (a.style.display !== "none" && b.style.display === "none") return -1;
        return 0;
      })
      .forEach((juego) => divJuegos.appendChild(juego));
  });
});

const mostrarCarrito = () => {
  offcanvasBody.innerHTML = "";
  offcanvasBody.className = "bodyContainer";
  if (carritoProductos.length === 0) {
    offcanvasBody.innerHTML = "<h2>El carrito está vacío</h2> <p>⛩🐉</p>";
  } else {
    carritoProductos.forEach((juego) => {
      let carritoContent = document.createElement("div");
      carritoContent.className = "contenedorCarrito";
      carritoContent.innerHTML = `
        <img src="img/${juego.imagen}">
        <h3 class="title-game">${juego.titulo}</h3>
        <p>Valor: $${juego.precio}</p>
        <p>Cantidad: ${juego.cantidad}</p>
        <button class="btnEliminar btn btn-primary" id="btnEliminar">Eliminar</button>
        <hr>
        `;
      offcanvasBody.append(carritoContent);

      let eliminarP = carritoContent.querySelector(".btnEliminar");

      eliminarP.addEventListener("click", () => {
        eliminarProducto(juego.id);
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
      });
    });

    const total = carritoProductos.reduce(
      (acc, elemento) => acc + elemento.precio * elemento.cantidad,
      0
    );

    const totalCompra = document.createElement("div");
    totalCompra.className = "compraTotal";
    totalCompra.innerHTML = `Total a pagar: $${total}`;
    offcanvasBody.append(totalCompra);

    const actions = document.createElement("div");
    actions.className = "botones";
    actions.innerHTML = `<div class="d-grid gap-2 d-md-block">
        <button id="finalizar" class="btn btn-primary" type="button">Comprar</button>
      </div>`;
    offcanvasBody.append(actions);

    let compra = document.getElementById("finalizar");
    compra.addEventListener("click", finalizarCompra);
  }
};

carritoCompra.addEventListener("click", mostrarCarrito);

const eliminarProducto = (id) => {
  const foundId = carritoProductos.find((data) => data.id === id);

  carritoProductos = carritoProductos.filter((carritoId) => {
    return carritoId !== foundId;
  });

  localStorage.setItem("carrito", JSON.stringify(carritoProductos));
  mostrarCarrito();
};

function finalizarCompra(totalCompra) {
  if (carritoProductos.length === 0) {
    Swal.fire({
      title: "No hay nada en su carrito",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    });
  } else
    Swal.fire({
      title: "¿Desea finalizar la compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "green",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Compra realizada",
          icon: "success",
          confirmButtonColor: "#317f43",
          text: `Gracias por su compra, esperamos que vuelva! `,
        });
        carritoProductos = [];
        localStorage.removeItem("carrito");
        offcanvasBody.innerHTML = `<h2>Muchas gracias por tu compra!</h2>`;
      } else {
        Swal.fire({
          title: "Compra no efectuada",
          icon: "info",
          text: `Compra no efectuada, tus productos seguiran en el carrito`,
          confirmButtonColor: "goldenrod",
          timer: 3500,
        });
      }
    });
}
