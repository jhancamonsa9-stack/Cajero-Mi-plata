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
        console.log("El nombre de usuario es obligatorio.");
        return;
    }

    // Verificar si el usuario ya existe
    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].nombre == nombre) {
            console.log("El usuario ya se encuentra registrado.");
            return;
        }
    }

    let clave = prompt("Ingrese la clave:");

    if (clave == null || clave == "") {
        console.log("La clave es obligatoria.");
        return;
    }

    let saldo = Number(prompt("Ingrese el saldo inicial:"));

    if (isNaN(saldo) || saldo < 0) {
        console.log("El saldo inicial debe ser un número válido.");
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

    console.log("================================");
    console.log("Usuario registrado correctamente.");
    console.log("================================");
}


// ==========================================
// INICIAR SESIÓN
// ==========================================

function iniciarSesion() {

    let usuarios = obtenerUsuarios();

    if (usuarios.length == 0) {
        console.log("No existen usuarios registrados.");
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
        console.log("El usuario no existe.");
        return false;
    }

    // Verificar si la cuenta está bloqueada
    if (usuarioEncontrado.bloqueado == true) {
        console.log("Cuenta bloqueada por 24 horas, comunícate con tu banco");
        return false;
    }

    let intentos = 0;
    let ingresoCorrecto = false;

    while (intentos < 3) {

        let clave = prompt("Ingrese su clave:");

        if (usuarioEncontrado.clave == clave) {

            ingresoCorrecto = true;
            usuarioEncontrado.intentos = 0;

            console.log("================================");
            console.log("Inicio de sesión exitoso.");
            console.log("Bienvenido " + usuarioEncontrado.nombre);
            console.log("================================");

            break;

        } else {

            intentos++;

            console.log("Clave incorrecta.");
            console.log("Intento " + intentos + " de 3.");

        }
    }

    // Si falló los tres intentos
    if (ingresoCorrecto == false) {

        usuarioEncontrado.bloqueado = true;
        usuarioEncontrado.intentos = 3;

        guardarUsuarios(usuarios);

        console.log("================================");
        console.log("Cuenta bloqueada por 24 horas,");
        console.log("comunícate con tu banco");
        console.log("================================");

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

        console.log("El monto debe ser un número positivo.");
        return;
    }

    if (monto > usuarioActual.saldo) {

        console.log("No puede retirar más dinero del saldo disponible.");
        console.log("Saldo actual: $" + usuarioActual.saldo);

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

    console.log("================================");
    console.log("Retiro realizado correctamente.");
    console.log("Monto retirado: $" + monto);
    console.log("Nuevo saldo: $" + usuarioActual.saldo);
    console.log("================================");
}


// ==========================================
// CONSIGNAR DINERO
// ==========================================

function consignarDinero() {

    let usuarios = obtenerUsuarios();

    let monto = Number(prompt("Ingrese el monto que desea consignar:"));

    if (isNaN(monto) || monto <= 0) {

        console.log("El monto debe ser un número positivo.");
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

    console.log("================================");
    console.log("Consignación realizada correctamente.");
    console.log("Monto consignado: $" + monto);
    console.log("Nuevo saldo: $" + usuarioActual.saldo);
    console.log("================================");
}


// ==========================================
// CONSULTAR SALDO
// ==========================================

function consultarSaldo() {

    console.log("================================");
    console.log("Usuario: " + usuarioActual.nombre);
    console.log("Saldo actual: $" + usuarioActual.saldo);
    console.log("================================");
}


// ==========================================
// CONSULTAR MOVIMIENTOS
// ==========================================

function consultarMovimientos() {

    console.log("================================");
    console.log("HISTORIAL DE MOVIMIENTOS");
    console.log("================================");

    if (usuarioActual.movimientos.length == 0) {

        console.log("No existen movimientos.");

        return;
    }

    for (let i = 0; i < usuarioActual.movimientos.length; i++) {

        console.log("-------------------------------");
        console.log("Fecha: " + usuarioActual.movimientos[i].fecha);
        console.log("Tipo: " + usuarioActual.movimientos[i].tipo);
        console.log("Monto: $" + usuarioActual.movimientos[i].monto);
    }

    console.log("-------------------------------");
}


// ==========================================
// MENÚ PRINCIPAL
// ==========================================

function menuPrincipal() {

    let opcion = 0;

    while (opcion != 5) {

        opcion = Number(prompt(
            "===== MI PLATA =====\n" +
            "Bienvenido " + usuarioActual.nombre + "\n\n" +
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
                console.log("Gracias por utilizar Mi Plata.");
                usuarioActual = null;
                break;

            default:
                console.log("Opción no válida.");
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
                console.log("Gracias por utilizar Mi Plata.");
                break;

            default:
                console.log("Opción no válida.");
        }
    }
}


// ==========================================
// INICIAR PROGRAMA
// ==========================================

menuInicial();