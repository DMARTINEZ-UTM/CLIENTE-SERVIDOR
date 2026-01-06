const API_URL = "http://localhost:3000/api/productos";
const form = document.getElementById('formProducto');
const nombreInput = document.getElementById('nombre');
const precioInput = document.getElementById('precio');
const cantidadInput = document.getElementById('cantidad');
const tbody = document.getElementById('productos-body');
const buscador = document.getElementById('buscador');
const btnBuscar = document.getElementById('btnBuscar');
const btnMostrarTodos = document.getElementById('btnMostrarTodos');
const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');

let filaEditando = null; // referencia a la fila que se está editando

// Helper para crear una celda
function crearCelda(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

// Agregar o guardar producto
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const precio = parseFloat(precioInput.value);
  const cantidad = parseInt(cantidadInput.value, 10);

  if (!nombre || isNaN(precio) || isNaN(cantidad)) {
    alert('Por favor completa todos los campos con valores válidos.');
    return;
  }

  if (filaEditando) {
    // Guardar cambios en la fila existente
    filaEditando.querySelector('.td-nombre').textContent = nombre;
    filaEditando.querySelector('.td-precio').textContent = precio.toFixed(2);
    filaEditando.querySelector('.td-cantidad').textContent = cantidad;
    limpiarFormulario();
    volverEstadoAgregar();
  } else {
    // Crear nueva fila
    const tr = document.createElement('tr');

    tr.appendChild(crearCelda(nombre));
    tr.lastElementChild.classList.add('td-nombre');

    tr.appendChild(crearCelda(precio.toFixed(2)));
    tr.lastElementChild.classList.add('td-precio');

    tr.appendChild(crearCelda(cantidad));
    tr.lastElementChild.classList.add('td-cantidad');

    const tdAcciones = document.createElement('td');
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.type = 'button';
    btnEditar.className = 'btnEditar';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.type = 'button';
    btnEliminar.className = 'btnEliminar';

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(document.createTextNode(' '));
    tdAcciones.appendChild(btnEliminar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
    limpiarFormulario();
  }
});

// Delegación de eventos para Editar / Eliminar
tbody.addEventListener('click', (e) => {
  const target = e.target;
  const tr = target.closest('tr');
  if (!tr) return;

  if (target.classList.contains('btnEliminar')) {
    if (confirm('¿Eliminar este producto?')) {
      tr.remove();
      // Si se estaba editando esta fila, cancelar edición
      if (filaEditando === tr) {
        limpiarFormulario();
        volverEstadoAgregar();
      }
    }
  }

  if (target.classList.contains('btnEditar')) {
    // Llenar formulario con datos de la fila
    const nombre = tr.querySelector('.td-nombre').textContent;
    const precio = tr.querySelector('.td-precio').textContent;
    const cantidad = tr.querySelector('.td-cantidad').textContent;

    nombreInput.value = nombre;
    precioInput.value = parseFloat(precio);
    cantidadInput.value = parseInt(cantidad, 10);

    filaEditando = tr;
    // Cambiar botón submit para indicar edición
    document.querySelector('.btnAgregar').textContent = 'Guardar cambios';
    btnCancelarEdicion.style.display = 'inline-block';
  }
});

function limpiarFormulario() {
  nombreInput.value = '';
  precioInput.value = '';
  cantidadInput.value = '';
  nombreInput.focus();
}

function volverEstadoAgregar() {
  filaEditando = null;
  document.querySelector('.btnAgregar').textContent = 'Agregar';
  btnCancelarEdicion.style.display = 'none';
}

// Cancelar edición
btnCancelarEdicion.addEventListener('click', () => {
  limpiarFormulario();
  volverEstadoAgregar();
});

// Buscar productos (filtrado simple)
btnBuscar.addEventListener('click', () => {
  const term = buscador.value.trim().toLowerCase();
  Array.from(tbody.rows).forEach(row => {
    const nombre = row.querySelector('.td-nombre').textContent.toLowerCase();
    if (nombre.includes(term)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

btnMostrarTodos.addEventListener('click', () => {
  buscador.value = '';
  Array.from(tbody.rows).forEach(row => row.style.display = '');
});
