const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const healthText = document.getElementById("health");
const dashStatus = document.getElementById("dashStatus");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const timerText = document.getElementById("timer");
const messageBox = document.getElementById("messageBox");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const triviaScreen = document.getElementById("triviaScreen");
const triviaQuestion = document.getElementById("triviaQuestion");
const triviaOptions = document.getElementById("triviaOptions");
const shieldIndicator = document.getElementById("shieldIndicator");
const healthContainer = document.getElementById("healthContainer");
const finalScoreText = document.getElementById("finalScoreText");
const lessonText = document.getElementById("lessonText");

const restartBtn = document.getElementById("restartBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const pauseScreen = document.getElementById("pauseScreen");
const resumeBtn = document.getElementById("resumeBtn");
const pauseBackToMenuBtn = document.getElementById("pauseBackToMenuBtn");

const jugadorImg = new Image(); jugadorImg.src = "public/images/jugador.png";
const cervezaImg = new Image(); cervezaImg.src = "public/images/cerveza.png";
const porroImg = new Image(); porroImg.src = "public/images/porro.png";
const marimbaImg = new Image(); marimbaImg.src = "public/images/marimba.jpg";

const keys = {};
const substances = [];
const healthyItems = [];
const particles = [];
const floatingTexts = [];

let score = 0;
let health = 100;
let time = 0;
let levelTimer = 0; 
let gameLevel = 1; 
let highScore = localStorage.getItem("highScore") || 0;
if (highScoreText) highScoreText.textContent = highScore;

let isPlaying = false;
let gameOver = false;
let isPaused = false;

let difficulty = 1;
let enemySpeed = 3;
let spawnRate = 1500;

let invertedControls = false;
let invertedTimer = 0;
let distortedVision = false;
let distortedTimer = 0;
let shieldActive = false;
let dashCooldown = 0;
const DASH_MAX_COOLDOWN = 180; 

let triviaActive = false;
let activeTriviaOptionIndex = 0;
let currentTriviaCorrectIndex = 0;
let currentTriviaOptionsCount = 0;

const player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 30,
    baseSpeed: 6,
    speed: 6
};

const messages = [
    "El alcohol puede afectar la memoria y la coordinación.",
    "Las drogas pueden provocar dependencia y problemas de salud.",
    "Las adicciones afectan la salud física and mental.",
    "Tomar decisiones saludables protege tu futuro.",
    "La prevención ayuda a evitar consecuencias graves."
];

const finalLessons = [
    "Las drogas y el alcohol pueden afectar gravemente la salud física y mental.",
    "El consumo problemático puede perjudicar estudios, trabajo y relaciones personales.",
    "Muchas adicciones comienzan con consumos aparentemente pequeños.",
    "Buscar ayuda profesional es importante cuando existe un problema de consumo.",
    "La prevención y la educación ayudan a tomar mejores decisiones."
];

const triviaBanco = [
    { q: "¿Qué órgano limpia el alcohol del cuerpo y sufre más por su abuso?", a: ["El estómago", "El hígado", "El corazón"], c: 1 },
    { q: "¿Qué sistema de nuestro cuerpo alteran directamente las sustancias psicoactivas?", a: ["Sistema Nervioso Central", "Sistema Óseo", "Sistema Digestivo"], c: 0 },
    { q: "Verdadero o Falso: ¿Las adicciones dañan las relaciones con familiares y amigos?", a: ["Verdadero", "Falso"], c: 0 },
    { q: "¿Cuál es una alternativa saludable y protectora frente al consumo de sustancias?", a: ["El aislamiento", "El deporte y pasatiempos", "Ignorar los problemas"], c: 1 },
    { q: "¿Qué efecto inmediato causa el consumo nocivo de alcohol en la conducción?", a: ["Mejora los reflejos", "Aumenta la velocidad", "Disminuye la coordinación y reflejos"], c: 2 },
    { q: "¿Qué sustancia química de los cigarros y vapeadores genera la fuerte dependencia física?", a: ["La nicotina", "El alquitrán", "El monóxido de carbono"], c: 0 },
    { q: "¿Cómo afecta el consumo temprano de drogas al cerebro de un adolescente?", a: ["No causa efectos puesto que el cerebro ya se desarrolló", "Interfiere en las áreas de toma de decisiones y control de impulsos", "Mejora temporalmente la memoria a largo plazo"], c: 1 },
    { q: "¿Qué significa que el cuerpo desarrolle 'tolerancia' a una sustancia?", a: ["Que el organismo la rechaza y vomita de inmediato", "Que se necesita cada vez más cantidad para conseguir el mismo efecto", "Que el usuario puede dejar de consumirla cuando lo desee sin malestar"], c: 1 },
    { q: "Ante la presión de un grupo de conocidos para consumir algo que no quieres, la mejor opción es:", a: ["Ceder sólo una vez para evitar que se burlen", "Decir 'No' con firmeza, mantener tu postura y proponer otro plan", "Reaccionar de forma violenta y gritarles"], c: 1 },
    { q: "¿Cuál de las siguientes afirmaciones sobre el alcohol es un MITO común?", a: ["Una ducha fría o café cargado te quitan la borrachera instantáneamente", "El hígado tarda aproximadamente una hora en procesar un trago estándar", "El consumo crónico daña las neuronas"], c: 0 },
    { q: "El uso constante de inhalantes domésticos (pegamentos, solventes, aerosoles) puede causar:", a: ["Daño cerebral irreversible y pérdida de capacidades cognitivas", "Mayor resistencia física al hacer ejercicio", "Una estimulación pasajera completamente inofensiva"], c: 0 },
    { q: "¿A qué se le denomina 'Síndrome de Abstinencia'?", a: ["Al deseo de probar una sustancia nueva por curiosidad", "Al conjunto de síntomas físicos y psicológicos dolorosos cuando se interrumpe el consumo", "A la capacidad de beber alcohol sin embriagarse"], c: 1 },
    { q: "Verdadero o Falso: Los vapeadores con sabores frutales son vapor de agua inofensivo para tus pulmones.", a: ["Verdadero", "Falso, contienen compuestos tóxicos y metales pesados"], c: 1 },
    { q: "¿Cuándo se considera que el uso de una sustancia se convirtió en un 'consumo problemático'?", a: ["Cuando altera de forma negativa tu salud, tus estudios, tu trabajo o tus relaciones", "Cuando se consume únicamente una vez al año", "Solo si la sustancia consumida es ilegal"], c: 0 },
    { q: "¿Cuál es el principal riesgo de mezclar bebidas energizantes con dosis altas de alcohol?", a: ["El alcohol pierde su efecto por completo", "Enmascara la borrachera, haciendo que la persona consuma más hasta una intoxicación letal", "Ayuda a rehidratar los músculos más rápido"], c: 1 },
    { q: "Si tú o alguien cercano necesita apoyo u orientación confidencial sobre adicciones, lo ideal es:", a: ["Buscar remedios milagrosos o hilos informales en redes sociales", "Acudir a líneas de ayuda especializadas, psicólogos o centros de salud", "Esconder el problema y esperar a que se solucione solo"], c: 1 }
];

let triviaPool = [];

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.code === "Escape") {
        if (isPlaying && !gameOver && !triviaActive) {
            e.preventDefault();
            togglePause();
        }
        return;
    }

    if (triviaActive) {
        if (e.key === "ArrowDown" || e.code === "ArrowDown" || e.key === "Down" || e.key === "S" || e.key === "s") {
            e.preventDefault(); 
            activeTriviaOptionIndex = (activeTriviaOptionIndex + 1) % currentTriviaOptionsCount;
            actualizarVisualTrivia();
            return;
        } 
        if (e.key === "ArrowUp" || e.code === "ArrowUp" || e.key === "Up" || e.key === "W" || e.key === "w") {
            e.preventDefault();
            activeTriviaOptionIndex = (activeTriviaOptionIndex - 1 + currentTriviaOptionsCount) % currentTriviaOptionsCount;
            actualizarVisualTrivia();
            return;
        }
        if (e.key === "Enter" || e.code === "Enter") {
            e.preventDefault();
            procesarRespuestaTrivia(activeTriviaOptionIndex, currentTriviaCorrectIndex);
            return;
        }
        return; 
    }

    keys[e.key] = true;
    
    if (e.key === " " && dashCooldown <= 0 && isPlaying && !gameOver && !isPaused) {
        executeDash();
    }
});

window.addEventListener("keyup", function(e) {
    if (!triviaActive) keys[e.key] = false;
});

window.addEventListener("resize", function() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        if (pauseScreen) pauseScreen.style.display = "flex";
        for (let key in keys) { keys[key] = false; }
    } else {
        if (pauseScreen) pauseScreen.style.display = "none";
        gameLoop(); 
    }
}

function resetGame() {
    score = 0; health = 100; time = 0; levelTimer = 0; gameLevel = 1; difficulty = 1; enemySpeed = 3; spawnRate = 1500;
    invertedControls = false; invertedTimer = 0; distortedVision = false; distortedTimer = 0; shieldActive = false; dashCooldown = 0;
    
    substances.length = 0; healthyItems.length = 0; particles.length = 0; floatingTexts.length = 0;
    
    player.x = window.innerWidth / 2;
    player.y = window.innerHeight / 2;
    
    if (healthText) healthText.textContent = health;
    if (scoreText) scoreText.textContent = score;
    if (timerText) timerText.textContent = time;
    
    if (canvas) canvas.classList.remove("distorted");
    if (shieldIndicator) shieldIndicator.style.display = "none";
    if (healthContainer) healthContainer.classList.remove("warning");
}

function startGame() {
    resetGame();
    if (startScreen) startScreen.style.display = "none";
    if (gameOverScreen) gameOverScreen.style.display = "none";
    if (pauseScreen) pauseScreen.style.display = "none";
    
    isPlaying = true; gameOver = false; isPaused = false;
    
    for (let i = 0; i < 6; i++) { createSubstance(); }
    gameLoop();
}

function volverAlMenu() {
    if (gameOverScreen) gameOverScreen.style.display = "none";
    if (pauseScreen) pauseScreen.style.display = "none"; 
    if (startScreen) startScreen.style.display = "flex";
    resetGame();
    isPlaying = false; gameOver = false; isPaused = false;
}

if (restartBtn) restartBtn.onclick = startGame;
if (backToMenuBtn) backToMenuBtn.onclick = volverAlMenu;
if (resumeBtn) resumeBtn.onclick = togglePause;
if (pauseBackToMenuBtn) pauseBackToMenuBtn.onclick = volverAlMenu;

function executeDash() {
    let moveX = 0; let moveY = 0;
    let up = invertedControls ? keys["ArrowDown"] : keys["ArrowUp"];
    let down = invertedControls ? keys["ArrowUp"] : keys["ArrowDown"];
    let left = invertedControls ? keys["ArrowRight"] : keys["ArrowLeft"];
    let right = invertedControls ? keys["ArrowLeft"] : keys["ArrowRight"];

    if (up) moveY = -1; if (down) moveY = 1; if (left) moveX = -1; if (right) moveX = 1;

    if (moveX !== 0 || moveY !== 0) {
        const dashDistance = 130;
        player.x += moveX * dashDistance;
        player.y += moveY * dashDistance;
        dashCooldown = DASH_MAX_COOLDOWN;
        createExplosion(player.x - moveX*60, player.y - moveY*60, "#38bdf8", 12);
    }
}

function createExplosion(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y, radius: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 6, speedY: (Math.random() - 0.5) * 6,
            alpha: 1, color: color
        });
    }
}

function createSmoke(x, y) {
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            radius: Math.random() * 14 + 6,        
            speedX: (Math.random() - 0.5) * 2.5,   
            speedY: -Math.random() * 2.5 - 1,      
            alpha: 0.7,                            
            color: "rgba(226, 232, 240, 0.5)"     
        });
    }
}

function createFloatingText(x, y, text, color) {
    floatingTexts.push({ x: x, y: y, text: text, color: color, alpha: 1, speedY: -1 });
}

function createSubstance() {
    if (!isPlaying || isPaused || gameOver || !canvas) return;
    const types = [
        { name: "Cerveza", img: cervezaImg },
        { name: "Porro", img: porroImg },
        { name: "Marimba", img: marimbaImg }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    substances.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        radius: difficulty >= 5 ? 35 : 25,
        speedX: (Math.random() - 0.5) * enemySpeed, speedY: (Math.random() - 0.5) * enemySpeed,
        img: type.img, name: type.name
    });
}

function createHealthyItem() {
    if (!isPlaying || isPaused || gameOver || !canvas) return;
    const types = [
        { name: "Manzana", emoji: "🍎", effect: "heal", color: "#f87171" },
        { name: "Agua", emoji: "💧", effect: "heal", color: "#60a5fa" },
        { name: "Deporte", emoji: "🏀", effect: "points", color: "#fb923c" }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    healthyItems.push({
        x: Math.random() * (canvas.width - 60) + 30, y: Math.random() * (canvas.height - 60) + 30,
        radius: 20, emoji: type.emoji, name: type.name, effect: type.effect, color: type.color
    });
}

function movePlayer() {
    if (!canvas) return;
    let up = invertedControls ? keys["ArrowDown"] : keys["ArrowUp"];
    let down = invertedControls ? keys["ArrowUp"] : keys["ArrowDown"];
    let left = invertedControls ? keys["ArrowRight"] : keys["ArrowLeft"];
    let right = invertedControls ? keys["ArrowLeft"] : keys["ArrowRight"];

    player.speed = invertedControls ? player.baseSpeed * 0.55 : player.baseSpeed;

    if (up) player.y -= player.speed;
    if (down) player.y += player.speed;
    if (left) player.x -= player.speed;
    if (right) player.x += player.speed;

    if (player.x < player.radius) player.x = player.radius;
    if (player.y < player.radius) player.y = player.radius;
    if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;
    if (player.y > canvas.height - player.radius) player.y = canvas.height - player.radius;
}

function updateSubstances() {
    for (let i = substances.length - 1; i >= 0; i--) {
        const s = substances[i];
        s.x += s.speedX; s.y += s.speedY;

        if (canvas) {
            if (s.x < 0 || s.x > canvas.width) s.speedX *= -1;
            if (s.y < 0 || s.y > canvas.height) s.speedY *= -1;
        }

        const dx = player.x - s.x; const dy = player.y - s.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + s.radius) {
            if (shieldActive) {
                shieldActive = false;
                if (shieldIndicator) shieldIndicator.style.display = "none";
                if (messageBox) messageBox.textContent = "🛡️ ¡El escudo te protegió del impacto!";
                createExplosion(s.x, s.y, "#34d399", 15);
                substances.splice(i, 1);
                continue;
            }

            let danio = Math.min(10 + difficulty, 40);
            health -= danio; if (health < 0) health = 0;
            if (healthText) healthText.textContent = health;

            createExplosion(s.x, s.y, "#ef4444", 15);
            createFloatingText(player.x, player.y - 30, "-" + danio + " HP", "#ef4444");

            if (s.name === "Cerveza") {
                invertedControls = true; invertedTimer = 240; 
                if (messageBox) messageBox.textContent = "🍺 Cerveza: Pierdes la coordinación. ¡Controles invertidos!";
            } else {
                distortedVision = true; distortedTimer = 240; 
                if (canvas) canvas.classList.add("distorted");
                if (messageBox) messageBox.textContent = s.name + ": Altera tu percepción y reflejos visuales.";
                
                if (s.name === "Porro") {
                    createSmoke(player.x, player.y);
                }
            }
            substances.splice(i, 1);
            if (health <= 0) endGame();
        }
    }
}

function updateHealthyItems() {
    for (let i = healthyItems.length - 1; i >= 0; i--) {
        const h = healthyItems[i];
        const dx = player.x - h.x; const dy = player.y - h.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + h.radius) {
            createExplosion(h.x, h.y, h.color, 12);
            if (h.effect === "heal") {
                health = Math.min(100, health + 15);
                if (healthText) healthText.textContent = health;
                createFloatingText(player.x, player.y - 30, "+15 HP", "#4ade80");
                if (messageBox) messageBox.textContent = "🍏 ¡Buen hábito! Cuidas tu organismo (" + h.name + ").";
            } else if (h.effect === "points") {
                score += 300;
                if (scoreText) scoreText.textContent = score;
                createFloatingText(player.x, player.y - 30, "+300 Pts", "#fb923c");
                if (messageBox) messageBox.textContent = "🏀 ¡Gran decisión! Mantenerse activo fortalece tu mente.";
            }
            healthyItems.splice(i, 1);
        }
    }
}

function updateVisuals() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.x += p.speedX; p.y += p.speedY; p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const t = floatingTexts[i]; t.y += t.speedY; t.alpha -= 0.015;
        if (t.alpha <= 0) floatingTexts.splice(i, 1);
    }
}

function manejarTimersEfectos() {
    if (dashCooldown > 0) {
        dashCooldown--;
        if (dashStatus) {
            dashStatus.textContent = Math.ceil(dashCooldown / 60) + "s";
            dashStatus.style.color = "#f87171";
        }
    } else if (dashStatus) {
        dashStatus.textContent = "LISTO";
        dashStatus.style.color = "#4ade80";
    }
    if (invertedControls) { invertedTimer--; if (invertedTimer <= 0) invertedControls = false; }
    if (distortedVision) { distortedTimer--; if (distortedTimer <= 0) { distortedVision = false; if (canvas) canvas.classList.remove("distorted"); } }
    if (health <= 30 && health > 0) { if (healthContainer) healthContainer.classList.add("warning"); } 
    else { if (healthContainer) healthContainer.classList.remove("warning"); }
}

function drawBackground() {
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#081c24"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 40; i++) {
        const x = (i * 173) % canvas.width; const y = (i * 97) % canvas.height;
        ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 2; ctx.stroke();
    }
}

function drawPlayer() {
    if (!ctx) return;
    try { ctx.drawImage(jugadorImg, player.x - 35, player.y - 35, 70, 70); } 
    catch(e) { ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2); ctx.fill(); }
    if (shieldActive) {
        ctx.beginPath(); ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = "#34d399"; ctx.lineWidth = 4; ctx.stroke();
    }
}

function drawSubstances() {
    if (!ctx) return;
    for (let i = 0; i < substances.length; i++) {
        const s = substances[i];
        try { ctx.drawImage(s.img, s.x - 25, s.y - 25, 50, 50); } 
        catch(e) { ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); ctx.fill(); }
    }
}

function drawHealthyItems() {
    if (!ctx) return;
    ctx.font = "30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < healthyItems.length; i++) { const h = healthyItems[i]; ctx.fillText(h.emoji, h.x, h.y); }
}

function drawVisuals() {
    if (!ctx) return;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i]; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.save(); ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
    for (let i = 0; i < floatingTexts.length; i++) {
        const t = floatingTexts[i]; ctx.globalAlpha = t.alpha; ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y);
    }
    ctx.restore();
}

function draw() {
    drawBackground(); drawSubstances(); drawHealthyItems(); drawPlayer(); drawVisuals(); 
}

function update() {
    const posAnteriorX = player.x;
    const posAnteriorY = player.y;

    movePlayer();
    updateSubstances();
    updateHealthyItems();
    updateVisuals();
    manejarTimersEfectos();

    if (player.x !== posAnteriorX || player.y !== posAnteriorY) {
        score++;
        if (scoreText) scoreText.textContent = score;
    }
}

function gameLoop() {
    if (gameOver || isPaused || !isPlaying) return;
    update(); draw();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameOver = true; isPlaying = false;
    if (score > highScore) {
        highScore = score; localStorage.setItem("highScore", highScore);
        if (highScoreText) highScoreText.textContent = highScore;
    }
    if (finalScoreText) finalScoreText.innerHTML = "Tu puntuación: <strong>" + score + "</strong> | Récord actual: <strong>" + highScore + "</strong>";
    if (lessonText) lessonText.textContent = finalLessons[Math.floor(Math.random() * finalLessons.length)];
    if (gameOverScreen) gameOverScreen.style.display = "flex";
}

function spawnLoop() {
    if (isPlaying && !isPaused && !gameOver) createSubstance();
    setTimeout(spawnLoop, spawnRate);
}

function healthySpawnLoop() {
    if (isPlaying && !isPaused && !gameOver) createHealthyItem();
    setTimeout(healthySpawnLoop, 4000); 
}

setInterval(function() {
    if (isPlaying && !gameOver && !isPaused && messageBox) {
        messageBox.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}, 7000);

setInterval(function() {
    if (isPlaying && !gameOver && !isPaused) {
        time++; if (timerText) timerText.textContent = time;
        levelTimer++;
        if (levelTimer >= 30) { levelTimer = 0; isPaused = true; lanzarTrivia(); }
    }
}, 1000);

function lanzarTrivia() {
    triviaActive = true; activeTriviaOptionIndex = 0; 
    if (document.activeElement && typeof document.activeElement.blur === "function") document.activeElement.blur();
    if (triviaPool.length === 0) triviaPool = [...triviaBanco];

    const randomIndex = Math.floor(Math.random() * triviaPool.length);
    const triviaRandom = triviaPool.splice(randomIndex, 1)[0];

    if (triviaQuestion) triviaQuestion.innerHTML = `<span style="color: #38bdf8; font-size: 18px; display: block; margin-bottom: 10px;">NIVEL ${gameLevel} - DESAFÍO</span> ${triviaRandom.q}`;
    if (triviaOptions) {
        triviaOptions.innerHTML = ""; 
        currentTriviaCorrectIndex = triviaRandom.c;
        currentTriviaOptionsCount = triviaRandom.a.length;

        triviaRandom.a.forEach((opcion, index) => {
            const btn = document.createElement("button");
            btn.textContent = (index + 1) + ". " + opcion; btn.id = "trivia-option-" + index; btn.style.pointerEvents = "auto";
            btn.onmouseenter = function() { if (activeTriviaOptionIndex !== index) { activeTriviaOptionIndex = index; actualizarVisualTrivia(); } };
            btn.addEventListener("click", function(e) { e.preventDefault(); e.stopPropagation(); procesarRespuestaTrivia(index, triviaRandom.c); });
            triviaOptions.appendChild(btn);
        });
    }
    actualizarVisualTrivia(); 
    if (triviaScreen) triviaScreen.style.display = "flex";
}

function actualizarVisualTrivia() {
    for (let i = 0; i < currentTriviaOptionsCount; i++) {
        const btn = document.getElementById("trivia-option-" + i);
        if (btn) {
            if (i === activeTriviaOptionIndex) btn.classList.add("focused");
            else btn.classList.remove("focused");
        }
    }
}

function procesarRespuestaTrivia(seleccionada, correcta) {
    if (triviaScreen) triviaScreen.style.display = "none";
    isPaused = false; triviaActive = false; 
    for (let key in keys) keys[key] = false;

    gameLevel++; difficulty++; enemySpeed += 0.8; 
    if (spawnRate > 400) spawnRate -= 150; 

    if (seleccionada === correcta) {
        shieldActive = true; if (shieldIndicator) shieldIndicator.style.display = "block";
        if (messageBox) messageBox.textContent = `✅ ¡Correcto! Avanzas al Nivel ${gameLevel}. Obtienes un escudo protector.`;
    } else if (messageBox) {
        enemySpeed += 0.7; messageBox.textContent = `❌ Incorrecto. Avanzas al Nivel ${gameLevel} con dificultad incrementada.`;
    }
    for (let i = 0; i < Math.min(difficulty, 4); i++) createSubstance();
    gameLoop();
}

spawnLoop();
healthySpawnLoop();