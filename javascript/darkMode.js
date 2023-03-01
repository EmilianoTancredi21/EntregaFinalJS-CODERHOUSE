let btnDark = document.getElementById("botonDarkMode");
let btnLight = document.getElementById("botonLightMode");
//Capturo la info del modo oscuro con una variable

let cambioFondo = localStorage.getItem("fondoDark")

//Creamos una condicional para verificar el valor de la clave

if(cambioFondo == "true"){
    document.body.classList.add("darkMode")
}

btnDark.addEventListener("click", () =>{
    document.body.classList.add("darkMode")
    //Le agregamos localstorage
    localStorage.setItem("fondoDark", true)
})

//Quito el fondo oscuro

btnLight.addEventListener("click", () => {
    document.body.classList.remove("darkMode")
    localStorage.setItem("fondoDark", false)
})