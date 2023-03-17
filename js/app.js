// VARIABLES GLOBALES 
const formulario  = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');

// EVENTOS
iniciarApp();
function iniciarApp() {
    document.addEventListener('DOMContentLoaded', ingresarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

// CLASES
class Presupuesto {
    constructor(presupuesto) {
        this.total = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); 
        this.restante = this.total - gastado;
    }
}

class UI {

    insertarPresupuesto(presupuesto) {
        const { total, restante } = presupuesto;
        document.querySelector('#total').textContent = total;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarAlerta(mensaje, tipo) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('alert', 'text-center');
        tipo === 'error' ? divAlerta.classList.add('alert-danger') : divAlerta.classList.add('alert-success');
        divAlerta.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divAlerta, formulario);

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }

    agregarGastoHTML(gastos) {

        this.limpiarHTML();

        gastos.forEach(gasto => {
            // GASTO
            const { nombre, cantidad, id } = gasto; 
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;
            li.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>
            `;

            // BOTON BORRAR
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'x';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            li.appendChild(btnBorrar);
            listaGastos.appendChild(li);
        });
    }

    limpiarHTML() {
        while(listaGastos.firstChild) {
            listaGastos.removeChild(listaGastos.firstChild);
        }
    }

    actualizarRestanteHTML(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuestoHTML(presupuestoObj) {
        const { total, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        if ((total / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((total / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    }
}

const ui = new UI();
let presupuesto;

// FUNCIONES
function ingresarPresupuesto() {
    const entradaUsuario = prompt('¿Cuál es su presupuesto?');
    // const entradaUsuario = 1000;

    if (entradaUsuario === '' || entradaUsuario === null || isNaN(entradaUsuario) || entradaUsuario <= 0) {
        ingresarPresupuesto();
    } else {
        presupuesto = new Presupuesto(entradaUsuario);
        ui.insertarPresupuesto(presupuesto);
    }
}

function agregarGasto(e) {
    
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    
    if (nombre === '' || cantidad === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios.', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.mostrarAlerta('Cantidad no válida.', 'error');
        return;
    }

    // Agregado lógico del gasto
    const gasto = { nombre, cantidad, id: Date.now() };
    presupuesto.nuevoGasto(gasto);
    ui.mostrarAlerta('Gasto agregado correctamente.', 'success');
    formulario.reset();

    // Agregado visual del gasto
    const { gastos, restante } = presupuesto;
    ui.agregarGastoHTML(gastos);
    ui.actualizarRestanteHTML(restante);
    ui.comprobarPresupuestoHTML(presupuesto);

}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    const { gastos, restante } = presupuesto;
    ui.agregarGastoHTML(gastos);
    ui.actualizarRestanteHTML(restante);
    ui.comprobarPresupuestoHTML(presupuesto);
}