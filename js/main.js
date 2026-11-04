

let intro = document.getElementById("intro");

if (intro) {
    setTimeout(function () {
        intro.classList.add("fuera");
    }, 2600);

    setTimeout(function () {
        intro.remove();
    }, 3200);
}

let monedasPorLata = 10;

let codigosValidos = [];
for (let i = 1; i <= 30; i++) {
    codigosValidos.push("PLAY-" + i);
}

function leerSaldo() {
    let saldo = localStorage.getItem("playcoins");
    if (saldo == null) {
        return 0;
    }
    return Number(saldo);
}

function guardarSaldo(nuevoSaldo) {
    localStorage.setItem("playcoins", nuevoSaldo);
    mostrarSaldo();
}

function mostrarSaldo() {
    let lugares = document.querySelectorAll(".saldo-numero");
    for (let i = 0; i < lugares.length; i++) {
        lugares[i].textContent = leerSaldo();
    }
}

function leerCodigosUsados() {
    let texto = localStorage.getItem("codigosUsados");
    if (texto == null) {
        return [];
    }
    return texto.split(",");
}

function guardarCodigoUsado(codigo) {
    let usados = leerCodigosUsados();
    usados.push(codigo);
    localStorage.setItem("codigosUsados", usados.join(","));
}

mostrarSaldo();

let mensajeCanje = document.getElementById("mensaje-canje");

if (mensajeCanje) {
    let correoCanje = document.getElementById("correo-canje");
    let botonesCanjear = document.querySelectorAll(".boton-canjear");

    function canjearRecompensa(nombre, costo) {
        let correo = correoCanje.value.trim();

        mensajeCanje.style.display = "block";

        if (leerSaldo() < costo) {
            mensajeCanje.className = "mensaje mal";
            mensajeCanje.innerHTML = "<p>No tienes suficientes PlayCoins para reclamar esta recompensa.</p>";
        } else if (correo.indexOf("@") == -1 || correo.indexOf(".") == -1) {
            mensajeCanje.className = "mensaje mal";
            mensajeCanje.innerHTML = "<p>Escribe un correo válido para confirmar el canje.</p>";
        } else {
            guardarSaldo(leerSaldo() - costo);

            mensajeCanje.className = "mensaje bien";
            mensajeCanje.innerHTML = "<h3>¡FELICIDADES! Has solicitado tu recompensa.</h3>" +
                "<p>" + nombre + " (-" + costo + " PlayCoins)</p>" +
                "<p>Tus PlayCoins han sido descontados correctamente. Nos pondremos en contacto contigo a través de tu correo electrónico para informarte sobre tu premio.</p>" +
                "<p>Esto es solo una simulación para la demostración del proyecto.</p>";
        }
    }

    for (let i = 0; i < botonesCanjear.length; i++) {
        botonesCanjear[i].onclick = function () {
            let nombre = botonesCanjear[i].getAttribute("data-nombre");
            let costo = Number(botonesCanjear[i].getAttribute("data-costo"));
            canjearRecompensa(nombre, costo);
        };
    }
}

let codigoLata = document.getElementById("codigo-lata");

if (codigoLata) {
    let mensajeLata = document.getElementById("mensaje-lata");
    let monedaLata = document.getElementById("moneda-lata");

    let codigoDeEstaVisita = sessionStorage.getItem("codigoVisita");

    mensajeLata.style.display = "block";

    if (codigoDeEstaVisita == null) {
        let disponibles = [];
        let usados = leerCodigosUsados();

        for (let i = 0; i < codigosValidos.length; i++) {
            if (usados.indexOf(codigosValidos[i]) == -1) {
                disponibles.push(codigosValidos[i]);
            }
        }

        if (disponibles.length == 0) {
            codigoLata.textContent = "---";
            mensajeLata.className = "mensaje mal";
            mensajeLata.innerHTML = "<p>Ya usaste todos los códigos de lata en este navegador.</p>";
        } else {
            let posicion = Math.floor(Math.random() * disponibles.length);
            let codigo = disponibles[posicion];

            guardarSaldo(leerSaldo() + monedasPorLata);
            guardarCodigoUsado(codigo);
            sessionStorage.setItem("codigoVisita", codigo);

            codigoLata.textContent = codigo;
            mensajeLata.className = "mensaje bien";
            mensajeLata.innerHTML = "<p>Escaneaste tu lata y ganaste " + monedasPorLata + " PlayCoins.</p>";
            monedaLata.classList.add("gira");
        }
    } else {
        codigoLata.textContent = codigoDeEstaVisita;
        mensajeLata.className = "mensaje bien";
        mensajeLata.innerHTML = "<p>Ya reclamaste las monedas de este código.</p>";
    }
} else {
    sessionStorage.removeItem("codigoVisita");
}

let fotoGrande = document.getElementById("foto-grande");
let fotosPequenas = document.querySelectorAll(".mini");

if (fotoGrande) {
    for (let i = 0; i < fotosPequenas.length; i++) {
        fotosPequenas[i].onclick = function () {
            fotoGrande.src = fotosPequenas[i].src;
        };
    }
}

let formulario = document.getElementById("formulario");

if (formulario) {

    let precioLata = 8000;

    let productoSelect = document.getElementById("producto-select");
    let presentacion = document.getElementById("presentacion");
    let cantidad = document.getElementById("cantidad");
    let total = document.getElementById("total");
    let fotoPedido = document.getElementById("foto-pedido");
    let botonMas = document.getElementById("mas");
    let botonMenos = document.getElementById("menos");
    let errores = document.getElementById("errores");
    let resumen = document.getElementById("resumen");

    function calcularTotal() {
        let latasPorPresentacion = Number(presentacion.value);
        let cantidadPedida = Number(cantidad.value);

        let valor = precioLata * latasPorPresentacion * cantidadPedida;

        if (latasPorPresentacion == 6) {
            valor = valor * 0.85;
        }

        total.textContent = "$" + valor.toLocaleString("es-CO");

        fotoPedido.src = "documentos/img/lata-" + productoSelect.value + ".png";
    }

    productoSelect.onchange = calcularTotal;
    presentacion.onchange = calcularTotal;
    cantidad.oninput = calcularTotal;

    botonMas.onclick = function () {
        if (Number(cantidad.value) < 99) {
            cantidad.value = Number(cantidad.value) + 1;
            calcularTotal();
        }
    };

    botonMenos.onclick = function () {
        if (Number(cantidad.value) > 1) {
            cantidad.value = Number(cantidad.value) - 1;
            calcularTotal();
        }
    };

    let direccionWeb = window.location.search;
    let productos = ["hydratate", "protein", "refresh", "energy"];

    for (let i = 0; i < productos.length; i++) {
        if (direccionWeb == "?producto=" + productos[i]) {
            productoSelect.value = productos[i];
        }
    }

    calcularTotal();

    formulario.onsubmit = function (evento) {
        evento.preventDefault();

        let nombre = document.getElementById("nombre").value.trim();
        let correo = document.getElementById("correo").value.trim();
        let telefono = document.getElementById("telefono").value.trim();
        let direccion = document.getElementById("direccion").value.trim();
        let cantidadPedida = Number(cantidad.value);

        let mensaje = "";

        if (nombre.length < 3) {
            mensaje = "El nombre debe tener al menos 3 letras.";
        } else if (correo.indexOf("@") == -1 || correo.indexOf(".") == -1) {
            mensaje = "Escribe un correo válido.";
        } else if (isNaN(telefono) || telefono.length < 7 || telefono.length > 10) {
            mensaje = "El teléfono debe tener entre 7 y 10 números.";
        } else if (direccion.length < 5) {
            mensaje = "Escribe tu dirección.";
        } else if (cantidadPedida < 1 || cantidadPedida > 99) {
            mensaje = "La cantidad debe estar entre 1 y 99.";
        }

        errores.textContent = mensaje;

        if (mensaje == "") {
            let nombreProducto = productoSelect.options[productoSelect.selectedIndex].text;
            let nombrePresentacion = presentacion.options[presentacion.selectedIndex].text;

            resumen.style.display = "block";
            resumen.innerHTML = "<h3>¡Pedido recibido, " + nombre + "!</h3>" +
                "<p>" + cantidadPedida + " x " + nombreProducto + " (" + nombrePresentacion + ")</p>" +
                "<p>Total: " + total.textContent + "</p>" +
                "<p>Te escribiremos a " + correo + "</p>";

            formulario.reset();
            calcularTotal();
        } else {
            resumen.style.display = "none";
        }
    };
}
