const urlItems = './public/js/items.json'
const urlPreguntas = './public/js/preguntas.json'

let indice = 0
let puntos = 0
let items = []

const mezclarPreguntas = (preguntas) => {
    return preguntas.sort(() => Math.random() - 0.5)
}

const cargarItems = async () => {
    const res = await fetch(urlItems)
    return await res.json()
}

const cargarPreguntas = async () => {
    const res = await fetch(urlPreguntas)
    return await res.json()
}

const mostrarModal = (titulo, texto, tipo, callback) => {

    const modal = document.querySelector('#modal')
    const modalContenido = document.querySelector('.modal-contenido')

    document.querySelector('#modalTitulo').textContent = titulo
    document.querySelector('#modalTexto').textContent = texto

    modalContenido.classList.remove('correcto', 'incorrecto')
    modalContenido.classList.add(tipo)

    modal.classList.remove('oculto')

    document.querySelector('#btnContinuar').onclick = () => {
        modal.classList.add('oculto')

        if (callback) callback()
    }
}


const mostrarPregunta = (preguntas) => {

    const contenedor = document.querySelector('#trivia')
    contenedor.innerHTML = ""

    if (indice >= preguntas.length) {
        contenedor.innerHTML = `
            <h2>🎉 Juego terminado</h2>
            <p>Puntaje: ${puntos}/${preguntas.length}</p>
        `
        return
    }

    const p = preguntas[indice]

    const titulo = document.createElement('h3')
    titulo.textContent = p.pregunta

    const opcionesDiv = document.createElement('div')
    opcionesDiv.classList.add('opciones')

    p.opciones.forEach(codigo => {

        const item = items.find(i => i.codigo === codigo)

        const card = document.createElement('div')  
        card.classList.add('opcion')

        card.innerHTML = `
            <img src="./public/img/galeria/${item.imagen}" alt="${item.nombre}">
            <p>${item.nombre}</p>
        `

    card.addEventListener('click', () => {

    let titulo = ""
    let texto = ""
    let tipo = ""

    if (codigo === p.respuesta) {

        puntos++

        titulo = "✔ ¡Correcto!"
        texto = p.razon
        tipo = "correcto"

    } else {

        const itemCorrecto = items.find(i => i.codigo === p.respuesta)

        titulo = "❌ Incorrecto"
        texto = `La respuesta correcta era: ${itemCorrecto.nombre}. ${p.razon}`
        tipo = "incorrecto"
    }

    mostrarModal(titulo, texto, tipo, () => {

        indice++
        mostrarPregunta(preguntas)

    })
})

        opcionesDiv.appendChild(card)
    })

    contenedor.appendChild(titulo)
    contenedor.appendChild(opcionesDiv)
}
const iniciar = async () => {

    items = await cargarItems()

    let preguntas = await cargarPreguntas()
    preguntas = mezclarPreguntas(preguntas)

    mostrarPregunta(preguntas)
}

document.addEventListener('DOMContentLoaded', iniciar)