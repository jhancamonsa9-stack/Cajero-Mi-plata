// ==========================================
// SISTEMA BANCARIO "MI PLATA"
// ==========================================

// Variable para guardar el usuario que inició sesión
let usuarioActual = null;


// ==========================================
// FUNCIÓN PARA OBTENER LOS USUARIOS
// ==========================================

function obtenerUsuarios() {

    let usuarios = localStorage.getItem("usuarios");

    if (usuarios == null) {
        return [];
    }

    return JSON.parse(usuarios);
}


// ==========================================
// FUNCIÓN PARA GUARDAR LOS USUARIOS
// ==========================================

function guardarUsuarios(usuarios) {

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}


// ==========================================
// REGISTRAR USUARIO
// ==========================================

function registrar() {

    let usuarios = obtenerUsuarios();

    let nombre = prompt("Ingrese el nombre de usuario:");

    if (nombre == null || nombre == "") {
        alert("El nombre de usuario es obligatorio.");
        return;
    }

    // Verificar si el usuario ya existe
    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].nombre == nombre) {
            alert("El usuario ya se encuentra registrado.");
            return;
        }
    }

    let clave = prompt("Ingrese la clave:");

    if (clave == null || clave == "") {
        alert("La clave es obligatoria.");
        return;
    }

    let saldo = Number(prompt("Ingrese el saldo inicial:"));

    if (isNaN(saldo) || saldo < 0) {
        alert("El saldo inicial debe ser un número válido.");
        return;
    }

    let nuevoUsuario = {
        nombre: nombre,
        clave: clave,
        saldo: saldo,
        movimientos: [],
        bloqueado: false,
        intentos: 0
    };

    usuarios.push(nuevoUsuario);

    guardarUsuarios(usuarios);

    alert("Usuario registrado correctamente.");
}


// ==========================================
// INICIAR SESIÓN
// ==========================================

function iniciarSesion() {

    let usuarios = obtenerUsuarios();

    if (usuarios.length == 0) {
        alert("No existen usuarios registrados.");
        return false;
    }

    let nombre = prompt("Ingrese su usuario:");

    let usuarioEncontrado = null;

    // Buscar usuario
    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].nombre == nombre) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado == null) {
        alert("El usuario no existe.");
        return false;
    }

    // Verificar si la cuenta está bloqueada
    if (usuarioEncontrado.bloqueado == true) {
        alert("Cuenta bloqueada por 24 horas.... comunícate con tu banco...");
        return false;
    }

    let intentos = 0;
    let ingresoCorrecto = false;

    while (intentos < 3) {

        let clave = prompt("Ingrese su clave:");

        if (usuarioEncontrado.clave == clave) {

            ingresoCorrecto = true;
            usuarioEncontrado.intentos = 0;

           
            alert("¡¡Inicio de sesión exitoso!! \nBienvenid@ " + usuarioEncontrado.nombre);
           

            break;

        } else {

            intentos++;

            alert("Clave incorrecta. \nIntentos restantes: " + (3 - intentos));

        }
    }

    // Si falló los tres intentos
    if (ingresoCorrecto == false) {

        usuarioEncontrado.bloqueado = true;
        usuarioEncontrado.intentos = 3;

        guardarUsuarios(usuarios);

        
        alert("Cuenta bloqueada por 24 horas...... \nComunícate con tu banco.....");

        return false;
    }

    guardarUsuarios(usuarios);

    usuarioActual = usuarioEncontrado;

    return true;
}


// ==========================================
// RETIRAR DINERO
// ==========================================

function retirarDinero() {

    let usuarios = obtenerUsuarios();

    let monto = Number(prompt("Ingrese el monto que desea retirar:"));

    if (isNaN(monto) || monto <= 0) {

        alert("El monto debe ser un número positivo.");
        return;
    }

    if (monto > usuarioActual.saldo) {

        alert("No puede retirar más dinero del saldo disponible. \nSaldo actual: $" + usuarioActual.saldo);

        return;
    }

    usuarioActual.saldo = usuarioActual.saldo - monto;

    let movimiento = {
        fecha: new Date().toLocaleString(),
        tipo: "Retiro",
        monto: monto
    };

    usuarioActual.movimientos.push(movimiento);

    // Actualizar usuario
    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].nombre == usuarioActual.nombre) {

            usuarios[i] = usuarioActual;
            break;
        }
    }

    guardarUsuarios(usuarios);

    
    alert("Retiro realizado correctamente!! \nMonto retirado: $" + monto + "\nNuevo saldo: $" + usuarioActual.saldo);
}


// ==========================================
// CONSIGNAR DINERO
// ==========================================

function consignarDinero() {

    let usuarios = obtenerUsuarios();

    let monto = Number(prompt("Ingrese el monto que desea consignar:"));

    if (isNaN(monto) || monto <= 0) {

        alert("El monto debe ser un número positivo.");
        return;
    }

    usuarioActual.saldo = usuarioActual.saldo + monto;

    let movimiento = {
        fecha: new Date().toLocaleString(),
        tipo: "Consignación",
        monto: monto
    };

    usuarioActual.movimientos.push(movimiento);

    // Actualizar usuario
    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].nombre == usuarioActual.nombre) {

            usuarios[i] = usuarioActual;
            break;
        }
    }

    guardarUsuarios(usuarios);


    alert("Consignación realizada correctamente!! \nMonto consignado: $" + monto + "\nNuevo saldo: $" + usuarioActual.saldo);
    
}


// ==========================================
// CONSULTAR SALDO
// ==========================================

function consultarSaldo() {

    alert("Usuario: " + usuarioActual.nombre +"\nSaldo actual: $" + usuarioActual.saldo);
}


// ==========================================
// CONSULTAR MOVIMIENTOS
// ==========================================

function consultarMovimientos() {
    if (usuarioActual.movimientos.length == 0) {
        alert("No existen movimientos.");
        return;
    }

    let lista = "---- HISTORIAL DE MOVIMIENTOS ----\n\n";

    for (let i = 0; i < usuarioActual.movimientos.length; i++) {
        lista = lista +
            (i + 1) + ". " +
            "Fecha: " + usuarioActual.movimientos[i].fecha + "\n" +
            "   Tipo: " + usuarioActual.movimientos[i].tipo + "\n" +
            "   Monto: $" + usuarioActual.movimientos[i].monto + "\n\n";
    }

    alert(lista);
}
// ==========================================
// MENÚ PRINCIPAL
// ==========================================

function menuPrincipal() {

    let opcion = 0;

    while (opcion != 5) {

        opcion = Number(prompt(
            "===== MI PLATA =====\n" +
            "Bienvenid@ " + usuarioActual.nombre + "\n\n" +
            "1. Retirar dinero\n" +
            "2. Consultar saldo\n" +
            "3. Consignar dinero\n" +
            "4. Consultar movimientos\n" +
            "5. Salir\n\n" +
            "Elija una opción:"
        ));

        switch (opcion) {

            case 1:
                retirarDinero();
                break;

            case 2:
                consultarSaldo();
                break;

            case 3:
                consignarDinero();
                break;

            case 4:
                consultarMovimientos();
                break;

            case 5:
                alert("Gracias por utilizar Mi Plata.");
                usuarioActual = null;
                break;

            default:
                alert("Opción no válida.");
        }
    }
}


// ==========================================
// MENÚ INICIAL
// ==========================================

function menuInicial() {

    let opcion = 0;

    while (opcion != 3) {

        opcion = Number(prompt(
            "===== SISTEMA BANCARIO MI PLATA =====\n\n" +
            "1. Iniciar sesión\n" +
            "2. Registrar usuario\n" +
            "3. Salir\n\n" +
            "Elija una opción:"
        ));

        switch (opcion) {

            case 1:

                if (iniciarSesion() == true) {
                    menuPrincipal();
                }

                break;

            case 2:
                registrar();
                break;

            case 3:
                alert("Gracias por utilizar Mi Plata.");
                break;

            default:
                alert("Opción no válida.");
        }
    }
}


// ==========================================
// INICIAR PROGRAMA
// ==========================================

menuInicial();