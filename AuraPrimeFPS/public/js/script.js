const escena = new THREE.Scene();
escena.background = new THREE.Color(0x87ceeb);

const camara = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 10000);
camara.position.set(0, 20, 60);

const render = new THREE.WebGLRenderer({ antialias: true });
render.setSize(innerWidth, innerHeight);
document.body.appendChild(render.domElement);

const luz1 = new THREE.DirectionalLight(0xffffff, 3);
luz1.position.set(50, 100, 50);
escena.add(luz1);

const luz2 = new THREE.AmbientLight(0xffffff, 1.5);
escena.add(luz2);

let jugando = false;
let yaw = 0;
let pitch = 0;

const menu = document.getElementById("menu");

menu.addEventListener("click", function () {
    jugando = true;
    menu.style.display = "none";
    document.body.requestPointerLock();
});

document.addEventListener("mousemove", function (e) {
    if (!jugando) return;

    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;

    if (pitch > 1.2) pitch = 1.2;
    if (pitch < -1.2) pitch = -1.2;

    camara.rotation.order = "YXZ";
    camara.rotation.y = yaw;
    camara.rotation.x = pitch;
});

const teclas = {};

document.addEventListener("keydown", function (e) {
    teclas[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (e) {
    teclas[e.key.toLowerCase()] = false;
});

function mover() {
    if (!jugando) return;

    const velocidad = 1;

    const direccion = new THREE.Vector3();
    camara.getWorldDirection(direccion);
    direccion.y = 0;
    direccion.normalize();

    const lado = new THREE.Vector3();
    lado.crossVectors(camara.up, direccion).normalize();

    if (teclas["w"]) camara.position.addScaledVector(direccion, velocidad);
    if (teclas["s"]) camara.position.addScaledVector(direccion, -velocidad);
    if (teclas["a"]) camara.position.addScaledVector(lado, velocidad);
    if (teclas["d"]) camara.position.addScaledVector(lado, -velocidad);
}

const loader = new THREE.GLTFLoader();

loader.load(
    "public/models/mapa.glb",

    function (gltf) {
        const mapa = gltf.scene;

        escena.add(mapa);

        const caja = new THREE.Box3().setFromObject(mapa);
        const centro = caja.getCenter(new THREE.Vector3());
        const tamaño = caja.getSize(new THREE.Vector3());

        mapa.position.sub(centro);

        const max = Math.max(tamaño.x, tamaño.y, tamaño.z);
        const escala = 80 / max;

        mapa.scale.set(15,15,15);

        camara.position.set(0,8,15);

        camara.lookAt(0,0,0);

        console.log("MAPA CARGADO BIEN");
    },

    function (xhr) {
        console.log("Cargando mapa...");
    },

    function (error) {
        console.log("ERROR AL CARGAR MAPA:", error);
        alert("No se pudo cargar el mapa. Revisa que esté en public/models/mapa.glb");
    }
);

function animar() {
    requestAnimationFrame(animar);
    mover();
    render.render(escena, camara);
}

animar();