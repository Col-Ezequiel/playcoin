

let intro = document.getElementById("intro");

if (intro) {
    setTimeout(function () {
        intro.classList.add("fuera");
    }, 2600);

    setTimeout(function () {
        intro.remove();
    }, 3200);
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
