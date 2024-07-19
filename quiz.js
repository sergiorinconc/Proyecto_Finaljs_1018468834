// Utilizando Axios para cargar datos desde un archivo JSON
axios.get('/preguntas.json')
    .then(response => {
        preguntas = response.data;
        localStorage.setItem('preguntas', JSON.stringify(preguntas));
    })
    .catch(error => console.error('Error al cargar las preguntas:', error));

// Variables necesarias
let indicePreguntaActual = 0;
let puntaje = 0;
let nombreEstudiante = '';
let cursoEstudiante = '';
let materiaSeleccionada = '';

// Elementos del DOM
const formularioInicial = document.getElementById('formulario-inicial');
const contenedorFormulario = document.getElementById('contenedor-formulario');
const contenedorMaterias = document.getElementById('contenedor-materias');
const contenedorQuiz = document.getElementById('contenedor-quiz');
const elementoPregunta = document.getElementById('pregunta');
const botonesRespuestas = document.getElementById('respuestas');
const botonSiguiente = document.getElementById('boton-siguiente');
const botonResultados = document.getElementById('boton-resultados');
const contenedorResultados = document.getElementById('contenedor-resultados');
const botonReiniciar = document.getElementById('boton-reiniciar');
const botonRegresar = document.getElementById('boton-regresar');
const botonRegresarResultados = document.getElementById('boton-regresar-resultados');
const botonRegresarFormulario = document.getElementById('boton-regresar-formulario');
const tituloMateria = document.getElementById('titulo-materia');

// Función para manejar el formulario inicial
function manejarFormularioInicial(e) {
    e.preventDefault();
    nombreEstudiante = document.getElementById('nombre').value;
    cursoEstudiante = document.getElementById('curso').value;

    localStorage.setItem('nombre', nombreEstudiante);
    localStorage.setItem('curso', cursoEstudiante);

    contenedorFormulario.style.display = 'none';
    contenedorMaterias.style.display = 'block';
}

// Función para seleccionar una materia
function seleccionarMateria(materia) {
    materiaSeleccionada = materia;
    tituloMateria.innerText = materia.charAt(0).toUpperCase() + materia.slice(1);
    contenedorMaterias.style.display = 'none';
    contenedorQuiz.style.display = 'block';
    comenzarQuiz();
}

// Función para comenzar el quiz
function comenzarQuiz() {
    indicePreguntaActual = 0;
    puntaje = 0;
    botonSiguiente.style.display = 'none';
    botonResultados.style.display = 'none';
    mostrarPregunta(preguntas[materiaSeleccionada][indicePreguntaActual]);
}

// Función para mostrar una pregunta
function mostrarPregunta(pregunta) {
    elementoPregunta.innerText = pregunta.pregunta;
    botonesRespuestas.innerHTML = '';
    pregunta.respuestas.forEach((respuesta, index) => {
        const boton = document.createElement('button');
        boton.innerText = respuesta.texto;
        boton.classList.add('boton-respuesta');
        if (respuesta.correcto) {
            boton.dataset.correcto = respuesta.correcto;
        }
        boton.addEventListener('click', seleccionarRespuesta);
        botonesRespuestas.appendChild(boton);
    });
}

// Función para seleccionar una respuesta
function seleccionarRespuesta(e) {
    const botonSeleccionado = e.target;
    const correcto = botonSeleccionado.dataset.correcto === "true";
    if (correcto) {
        puntaje++;
    }
    Array.from(botonesRespuestas.children).forEach(boton => {
        establecerClaseEstado(boton, boton.dataset.correcto === "true");
    });
    botonSiguiente.style.display = 'block';
}

// Función para establecer la clase de estado
function establecerClaseEstado(elemento, correcto) {
    limpiarClaseEstado(elemento);
    if (correcto) {
        elemento.classList.add('correcto');
    } else {
        elemento.classList.add('incorrecto');
    }
}

// Función para limpiar las clases de estado
function limpiarClaseEstado(elemento) {
    elemento.classList.remove('correcto');
    elemento.classList.remove('incorrecto');
}

// Función para manejar el botón siguiente
function manejarBotonSiguiente() {
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntas[materiaSeleccionada].length) {
        mostrarPregunta(preguntas[materiaSeleccionada][indicePreguntaActual]);
    } else {
        botonSiguiente.style.display = 'none';
        botonResultados.style.display = 'block';
    }
}

// Función para manejar el botón resultados
function manejarBotonResultados() {
    mostrarResultados();
    contenedorQuiz.style.display = 'none';
    contenedorResultados.style.display = 'block';
}

// Función para mostrar los resultados
function mostrarResultados() {
    const resultadosElemento = document.getElementById('resultados');
    resultadosElemento.innerText = `${nombreEstudiante} de ${cursoEstudiante}, tu puntaje es ${puntaje} de ${preguntas[materiaSeleccionada].length}.`;
}

// Función para manejar el botón reiniciar
function manejarBotonReiniciar() {
    contenedorResultados.style.display = 'none';
    contenedorFormulario.style.display = 'block';
    formularioInicial.reset();
}

// Función para manejar el botón regresar
function manejarBotonRegresar() {
    contenedorQuiz.style.display = 'none';
    contenedorMaterias.style.display = 'block';
}

// Función para manejar el botón regresar en resultados
function manejarBotonRegresarResultados() {
    contenedorResultados.style.display = 'none';
    contenedorMaterias.style.display = 'block';
}

// Event listeners
formularioInicial.addEventListener('submit', manejarFormularioInicial);
botonSiguiente.addEventListener('click', manejarBotonSiguiente);
botonResultados.addEventListener('click', manejarBotonResultados);
botonReiniciar.addEventListener('click', manejarBotonReiniciar);
botonRegresar.addEventListener('click', manejarBotonRegresar);
botonRegresarResultados.addEventListener('click', manejarBotonRegresarResultados);
botonRegresarFormulario.addEventListener('click', () => {
    contenedorMaterias.style.display = 'none';
    contenedorFormulario.style.display = 'block';
});
