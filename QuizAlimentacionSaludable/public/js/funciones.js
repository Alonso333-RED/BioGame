const obtenerItems = async()=>{
    const respuesta = await fetch(url)
    if(!respuesta.ok){
        throw new Error(`Respuesta ${respuesta.status}`)
    }
    return await respuesta.json()
}


const cargarDatos = async()=>{
    try {
        const productos = await obtenerItems()
        productos.forEach(function(producto){

            const article = document.createElement('article')
            article.className = 'article'
            const {codigo,nombre,descripcion,imagen} = item
            article.innerHTML = `<img src="public/img/galeria/${imagen}" alt="${nombre}">
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