const url = '/QuizAlimentacionSaludable/public/js/items.json'

const obtenerItems = async()=>{
    const respuesta = await fetch(url)
    if(!respuesta.ok){
        throw new Error(`Respuesta ${respuesta.status}`)
    }
    return await respuesta.json()
}


const cargarDatos = async()=>{
    try {
        const items = await obtenerItems()
        items.forEach(function(item){

            const article = document.createElement('article')
            article.className = 'article'
            const {codigo,nombre,descripcion,imagen} = item
            article.innerHTML = `<p>${nombre}</p>
            <p>${descripcion}</p>
            <button type="button" id=${codigo} class="btn">Ver</button>`
            const tarjeta = document.querySelector('#galeria')
            tarjeta.append(article)
            
        })
        eventoClick()
    }catch(error){
        console.log(error.message)
    }
}

cargarDatos()