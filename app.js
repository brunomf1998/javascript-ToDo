const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('lista-tareas');
const input = document.getElementById('input');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();
let tareas = {};

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
        pintarTareas();
    }
    
})

formulario.addEventListener('submit', e => {
    e.preventDefault();
    setTarea(e);
})

listaTareas.addEventListener('click', e => {
    btnAccion(e);
})

const setTarea = e => {
    if (input.value.trim() === '') return;
    
    const tarea = {
        id: Date.now(),
        texto: input.value.trimLeft().trimRight(),
        estado: false
    }

    tareas[tarea.id] = tarea;
    formulario.reset();
    input.focus();
    pintarTareas();
}

const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
    listaTareas.innerHTML = '';

    if (Object.keys(tareas).length === 0) {
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center" role="alert">
            No hay tareas pendientes ❤.
        </div>
        `;
        return;
    }
    Object.values(tareas).forEach(item => {
        const clone = template.cloneNode(true);
        clone.querySelector('p').textContent = item.texto;
        clone.querySelectorAll('.fas')[0].dataset.id = item.id;
        clone.querySelectorAll('.fas')[1].dataset.id = item.id;
        if (item.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
            clone.querySelector('p').classList.add('text-decoration-line-through')
        }
        fragment.appendChild(clone);
    });
    listaTareas.appendChild(fragment);
}

const btnAccion = (e) => {
    if (e.target.classList.contains('fa-check-circle') || e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = !tareas[e.target.dataset.id].estado;
        pintarTareas();
    }
    if (e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id];
        pintarTareas();
        console.log(tareas);
    }
    e.stopPropagation();
}