/**VARIABLES PARA LA REACCION DEL HTML*/

const openNav = document.querySelector(".button-open");
const closeNav = document.querySelector(".button-close");
const navbar = document.querySelector(".navbar");

const enlaces = document.querySelectorAll(".enlace");

const carrito = [];


openNav.addEventListener("click", () => {
  navbar.classList.add("active");
});
closeNav.addEventListener("click", () => {
  navbar.classList.remove("active");
});

function pestanaActual() {
  let aux = localStorage.getItem("pestanaActual");
  if (aux) {
    enlaces.forEach((item) => {
      if (item.textContent === aux) {
        item.classList.add("actual");
      }
    });
  }
}
pestanaActual();
enlaces.forEach((item) => {
  item.addEventListener("click", () => {
    enlaces.forEach((item) => item.classList.remove("actual"));
    item.classList.add("actual");
    localStorage.setItem("pestanaActual", `${item.textContent}`);
    //es porque por cada seleccion que hagamos se cierra
    if (navbar.classList.contains("active")) {
      navbar.classList.remove("active");
    }
  });
});
//* SCRIPT PARA TRABAJAR Y EL HTML */
const divProductos = document.querySelector(".productos-items");
const divProductosCarrito = document.querySelector(".productos-items-carrito");
let numberProductos = document.querySelector(".cart-number");
let priceProducts = document.querySelector(".cart-info__price");
const form = document.querySelector(".frm-busqueda");

function recuperarCarrito() {
  let aux = JSON.parse(localStorage.getItem("carritoDeCompras"));
  if (aux) {
    carrito.splice(0, carrito.length);
    carrito.push(...aux);
    numberProductos.textContent = carrito.length;
    priceProducts.textContent = carrito
      .reduce((acc, item) => {
        return (acc += item.price);
      }, 0)
      .toFixed(2);

    cargarCardsCarrito(carrito);
  }
}
//Esto se realiza primero por ser asincrono
recuperarCarrito();

function getData() {
  return fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => json);
}

function cargarCards(array) {
  const stringProductos = array.reduce((acc, item) => {
    {
      /* <p>${item.description.slice(0,200)}</p> */
    }
    return (acc += `<div class="productos-items__item item">
          <img src=${item.image} alt="" >
          <div class="item-info">
    <h4>${item.title}</h4>
   
    <div>
        <span>Price: $.${item.price}</span>
        <span>Category:${item.category}</span>
    </div>
    </div>
    <button class="btn-comprar" id="item-${item.id}">Agregar</button>

        </div>`);
  }, "");
  //siempre debemos validar las etiquetas contenedoras que estan en diferentes html
  if (divProductos) {
    divProductos.innerHTML = stringProductos;
  }
}
function cargarCardsCarrito(array) {
  const stringProductos = array.reduce((acc, item) => {
    /* <p>${item.description.slice(0,200)}</p> */

    return (acc += `<div class="productos-items__item item">
          <img src=${item.image} alt="" >
          <div class="item-info">
    <h4>${item.title}</h4>
   
    <div>
        <span>Price: $.${item.price}</span>
        <span>Caterory:${item.category}</span>
    </div>
    </div>
    <button class="btn-eliminar item-carrito-${item.id}"><i class="fa-solid fa-trash"></i></button>

        </div>`);
  }, "");
  //solo porque este js es compratido tengo que validar si existe la etiqueta
  if (divProductosCarrito) {
    divProductosCarrito.innerHTML = stringProductos;
  } else console.log("NO EXISTE");

  /*   <button class="btn-eliminar" id="item-carrito-${item.id}">Eliminar</button>
   */
}
function agregarCarrito(array) {
  const botonesAgregar = document.querySelectorAll(".btn-comprar");
  botonesAgregar.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productoElegido = array.find(
        (item) => item.id == e.currentTarget.id.slice(5)
      );

      carrito.push(productoElegido);

      Swal.fire("Agregado!", "Click para continuar!", "success");

      //cargamos a localStorage, luego actualizamos el numero de productos en el car
      localStorage.setItem("carritoDeCompras", JSON.stringify(carrito));
      numberProductos.textContent = carrito.length;
      priceProducts.textContent = carrito
        .reduce((acc, item) => {
          return (acc += item.price);
        }, 0)
        .toFixed(2);
      //cargarCardsCarrito(carrito); //me dara error por ser para otro html
    });
  });
  //eliminarDelCarrito();
}
function eliminarDelCarrito() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productoElegido = carrito.find(
        /*  (item) => item.id == e.currentTarget.id.slice(13) */
        (item) => {
          return item.id == e.currentTarget.classList[1].slice(13);
        }
      );

      //posicion,numeroEliminar,agregar// como viene del storage no tiene la misma direccion

      Swal.fire({
        title: "Seguro que desea eliminarlo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          //==========================================================
          carrito.splice(carrito.indexOf(productoElegido), 1);

          //cargamos a localStorage, luego actualizamos el numero de productos en el car
          localStorage.setItem("carritoDeCompras", JSON.stringify(carrito));
          numberProductos.textContent = carrito.length;
          priceProducts.textContent = carrito
            .reduce((acc, item) => {
              return (acc += item.price);
            }, 0)
            .toFixed(2);

          //el problema es cuando quiero volver a cargar el contenido de la card
          //window.location.href = window.location.href;
          //==========================================================
          Swal.fire("Eliminado!", "Su producto fue eliminado", "success")
          .then(result=>{
            if(result.isConfirmed){
              window.location.href = window.location.href;
            }
          })
        }
      });
    });
  });
}
function realizarBusqueda(json) {
  form.addEventListener("input", (e) => {
    e.preventDefault();
    const input = document.querySelector("#busqueda").value.toLowerCase();
    const aux = json.filter((item) => {
      return item.title.toLowerCase().startsWith(input);
    });
    //cargame las tarjetas de la busqueda
    cargarCards(aux);
    console.log(aux);
    //============================
    //llamo a la misma funcion pero ahora filtro dentro de carrito y auxiliar toma otro valor
    //como auxiliar toma otro valor vuelve a cargar el div, y escucha si quiero elimiar
    if (localStorage.getItem("pestanaActual") === "Carrito") {
      //aux toma los valores con los filtros del carrito
      realizarBusqueda(carrito);
      cargarCardsCarrito(aux);
      eliminarDelCarrito();
      console.log(aux);
    }
    //=============================

    //ahora necesito que dentro de esta busqueda me escuche al nuevo container
    //buscas en este arreglo y lo agregas
    agregarCarrito(aux);
  });
}
async function showData() {
  const json = await getData();
  cargarCards(json);
  //console.log(json);
  //para los botones
  realizarBusqueda(json);
  //buscas en este arreglo y lo agregas
  agregarCarrito(json);
  eliminarDelCarrito();
}

//En conclusion todas las interacciones que se haran sera a traves de la asincronia
showData();
