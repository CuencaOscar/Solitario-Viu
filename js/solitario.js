/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
// let numeros = [9, 10, 11, 12];
// Array ed objetos para definir colores
let colores = {
  viu: "naranja",
  cua: "naranja",
  hex: "gris",
  cir: "gris",
};

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// contador_de_movimientos
let movimientos = 0;

// Tapetes
let tapeteInicial = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial = document.getElementById("contador_inicial");
let contSobrantes = document.getElementById("contador_sobrantes");
let contReceptor1 = document.getElementById("contador_receptor1");
let contReceptor2 = document.getElementById("contador_receptor2");
let contReceptor3 = document.getElementById("contador_receptor3");
let contReceptor4 = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0; // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
function resetearJuego() {
  // Reiniciar variables y elementos a su estado inicial
  mazoInicial.splice(0, mazoInicial.length);
  mazoSobrantes.splice(0, mazoSobrantes.length);
  mazoReceptor1.splice(0, mazoReceptor1.length);
  mazoReceptor2.splice(0, mazoReceptor2.length);
  mazoReceptor3.splice(0, mazoReceptor3.length);
  mazoReceptor4.splice(0, mazoReceptor4.length);
  movimientos = 0;
  segundos = 0;
  clearInterval(temporizador);

  // Reiniciar contadores
  setContador(contInicial, 0);
  setContador(contSobrantes, 0);
  setContador(contReceptor1, 0);
  setContador(contReceptor2, 0);
  setContador(contReceptor3, 0);
  setContador(contReceptor4, 0);
  setContador(contMovimientos, 0);
  setContador(contTiempo, "00:00:00");

  // Eliminar todas las cartas de los tapetes
  const tapetes = document.querySelectorAll(".tapete");
  tapetes.forEach((tapete) => {
    const imagenes = tapete.querySelectorAll("img");
    imagenes.forEach((imagen) => imagen.remove());
  });

  // Volver a cargar el juego inicial
  comenzarJuego();
}

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
window.onload = () => {
  comenzarJuego();
};

// Desarrollo del comienzo de juego
function comenzarJuego() {
  /* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < numeros.length; j++) {
      let img_carta = document.createElement("img");
      img_carta.id = "carta";
      img_carta.src =
        "../imagenes/baraja/" + numeros[j] + "-" + palos[i] + ".png";
      img_carta.setAttribute("data-palo", palos[i]);
      img_carta.setAttribute("data-numero", numeros[j]);
      img_carta.setAttribute("data-color", colores[palos[i]]);
      img_carta.setAttribute("data-tapete", "receptor");
      mazoInicial.push(img_carta);
    }
  }

  // Barajar y dejar mazoInicial en tapete inicial
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  barajar(mazoInicial);
  cargarTapeteInicial(mazoInicial);

  // Puesta a cero de contadores de mazos
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  setContador(contInicial, mazoInicial.length);
  setContador(contSobrantes, 0);
  setContador(contReceptor1, 0);
  setContador(contReceptor2, 0);
  setContador(contReceptor3, 0);
  setContador(contReceptor4, 0);
  setContador(contMovimientos, 0);

  // Arrancar el conteo de tiempo
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  arrancarTiempo();
} // comenzarJuego

/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancarTiempo() {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  if (temporizador) clearInterval(temporizador);
  let hms = function () {
    let seg = Math.trunc(segundos % 60);
    let min = Math.trunc((segundos % 3600) / 60);
    let hor = Math.trunc((segundos % 86400) / 3600);
    let tiempo =
      (hor < 10 ? "0" + hor : "" + hor) +
      ":" +
      (min < 10 ? "0" + min : "" + min) +
      ":" +
      (seg < 10 ? "0" + seg : "" + seg);
    setContador(contTiempo, tiempo);
    segundos++;
    contTiempo.textContent = tiempo;
    if (mazoInicial.length === 0 && mazoSobrantes.length === 0) {
      clearInterval(temporizador);
      modalVictoria();
    }
  };
  segundos = 0;
  hms(); // Primera visualización 00:00:00
  temporizador = setInterval(hms, 1000);
} // arrancarTiempo

/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/
function barajar(mazo) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
} // barajar

/**
 	En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargarTapeteInicial(mazo) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  for (let i = 0; i < mazo.length; i++) {
    const desplazamiento = paso * i;
    mazo[i].style.position = "absolute";
    mazo[i].style.width = "65px";
    mazo[i].style.top = desplazamiento + "px";
    mazo[i].style.left = desplazamiento + "px";
    mazo[i].style.setProperty("transform", "translate(0)");
    mazo[i].setAttribute("data-tapete", "receptor");
    mazo[i].id = "carta-" + (i + 1);
    mazo[i].draggable = i === mazo.length - 1;
    tapeteInicial.appendChild(mazo[i]);
  }
} // cargarTapeteInicial

/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function incContador(contador) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  valor = contador++;
  setContador(contador, valor);
} // incContador

/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/
  contador--;
} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
  /*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
  contador.textContent = valor;
} // setContador

tapeteInicial.ondragstart = function (e) {
  e.dataTransfer.setData("text/plain/numero", e.target.dataset["numero"]);
  e.dataTransfer.setData("text/plain/palo", e.target.dataset["palo"]);
  e.dataTransfer.setData("text/plain/color", e.target.dataset["color"]);
  e.dataTransfer.setData("text/plain/tapete", e.target.dataset["tapete"]);
  e.dataTransfer.setData("text/plain/id", e.target.id);
};

tapeteSobrantes.ondragstart = function (e) {
  e.dataTransfer.setData("text/plain/numero", e.target.dataset["numero"]);
  e.dataTransfer.setData("text/plain/palo", e.target.dataset["palo"]);
  e.dataTransfer.setData("text/plain/color", e.target.dataset["color"]);
  e.dataTransfer.setData("text/plain/tapete", e.target.dataset["tapete"]);
  e.dataTransfer.setData("text/plain/id", e.target.id);
};

tapeteInicial.ondrag = function (e) {
  e.preventDefault();
};

tapeteInicial.ondragend = function (e) {
  e.preventDefault();
};

tapeteSobrantes.ondrag = function (e) {
  e.preventDefault();
};

tapeteSobrantes.ondragend = function (e) {
  e.preventDefault();
};

const elementos = [
  tapeteSobrantes,
  tapeteReceptor1,
  tapeteReceptor2,
  tapeteReceptor3,
  tapeteReceptor4,
];

function asignarDragEnter(evento) {
  elementos.forEach((elemento) => {
    elemento.ondragenter = evento;
    elemento.ondragover = evento;
    elemento.ondragleave = evento;
  });
}

asignarDragEnter(function (e) {
  e.preventDefault();
});

function manejarOndrop(e, tapete, mazo, cont) {
  e.preventDefault();
  let carta_id = e.dataTransfer.getData("text/plain/id");
  let numero = e.dataTransfer.getData("text/plain/numero");
  let palo = e.dataTransfer.getData("text/plain/palo");
  let tipo_tapete = e.dataTransfer.getData("text/plain/tapete");
  let color = e.dataTransfer.getData("text/plain/color");
  if (tapete.id.includes("receptor")) {
    if (mazo.length == 0 && numero == "12") {
      moverCarta(tapete, mazo, carta_id, cont, tipo_tapete);
    } else {
      if (mazo.length !== 0) {
        if (
          parseInt(mazo[mazo.length - 1].getAttribute("data-numero")) ===
            parseInt(numero) + 1 &&
          mazo[mazo.length - 1].getAttribute("data-color") !== color
        ) {
          moverCarta(tapete, mazo, carta_id, cont, tipo_tapete);
          mazo[mazo.length - 1].setAttribute("data-tapete", "receptor");
        }
      }
    }
  } else {
    if (tipo_tapete !== "sobrantes" && tipo_tapete !== "") {
      moverCarta(tapete, mazo, carta_id, cont, tipo_tapete);
      mazo[mazo.length - 1].setAttribute("data-tapete", "sobrantes");
    }
  }
}

function moverCarta(tapete, mazo, carta_id, cont, tipo_tapete) {
  movimientos++;
  let carta = document.getElementById(carta_id);
  carta.style.display = "absolute";
  carta.style.top = "50%";
  carta.style.left = "50%";
  carta.style.transform = "translate(-50%, -50%)";
  tapete.appendChild(carta);
  if (tipo_tapete === "sobrantes") {
    mazoSobrantes.pop();
    mazo.push(carta);
    setContador(contSobrantes, mazoSobrantes.length);
    setContador(cont, mazo.length);
  } else {
    mazoInicial.pop();
    setContador(contInicial, mazoInicial.length);
    mazo.push(carta);
    setContador(cont, mazo.length);
  }
  if (mazoInicial.length >= 1) {
    document.getElementById("carta-" + mazoInicial.length).draggable = true;
  } else {
    mazoInicial = mazoSobrantes.slice();
    mazoSobrantes.splice(0, mazoSobrantes.length);
    setContador(contInicial, mazoInicial.length);
    setContador(contSobrantes, mazoSobrantes.length);
    barajar(mazoInicial);
    cargarTapeteInicial(mazoInicial);
    mazo[mazo.length - 1].setAttribute("data-tapete", "receptor");
  }
  setContador(contMovimientos, movimientos);
}

const tapetesReceptores = [
  { tapete: tapeteSobrantes, mazo: mazoSobrantes, contador: contSobrantes },
  { tapete: tapeteReceptor1, mazo: mazoReceptor1, contador: contReceptor1 },
  { tapete: tapeteReceptor2, mazo: mazoReceptor2, contador: contReceptor2 },
  { tapete: tapeteReceptor3, mazo: mazoReceptor3, contador: contReceptor3 },
  { tapete: tapeteReceptor4, mazo: mazoReceptor4, contador: contReceptor4 },
];

for (let i = 0; i < tapetesReceptores.length; i++) {
  const tapeteReceptor = tapetesReceptores[i];
  tapeteReceptor.tapete.ondrop = function (e) {
    manejarOndrop(
      e,
      tapeteReceptor.tapete,
      tapeteReceptor.mazo,
      tapeteReceptor.contador
    );
  };
}

function modalVictoria() {
  const section = document.querySelector("section");
  const closeBtn = document.querySelector(".close-btn");
  const greatBtn = document.querySelector(".great-btn");
  const mensaje = document.getElementById("informacion");
  const iconoSpan = document.getElementById("icono");
  mensaje.innerHTML = `¡Felicitaciones! Has ganado el juego en "<strong>${contTiempo.textContent}</strong>" con "<strong>${contMovimientos.textContent}</strong>" movimientos.`;
  iconoSpan.textContent = "😃";
  iconoSpan.style.fontSize = "30px";
  section.classList.add("active");
  closeBtn.addEventListener("click", () => section.classList.remove("active"));
  greatBtn.addEventListener("click", () => {
    section.classList.remove("active");
    resetearJuego();
  });
}

document.getElementById("reset").onclick = resetearJuego;
