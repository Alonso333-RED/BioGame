const url = './public/js/items.json'


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
        productos.forEach(function(item){
            const article = document.createElement('article')
            article.className = 'item'
            const {nombre,imagen,descripcion,codigo} = item
            article.innerHTML = `<img src="../img/galeria/${imagen}" alt="${nombre}">
            <h2>${nombre}</h2>
            <p>${descripcion}</p>`
            const tarjeta = document.querySelector('#galeria')
            tarjeta.append(article)
            
        })
    }catch(error){
        console.log(error.message)
    }
}


cargarDatos()