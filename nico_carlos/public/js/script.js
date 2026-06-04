window.onload = () => {
    console.log("🧠 NeuroLab BIO-CODE 4.0 cargado correctamente.");
};


const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.info').forEach(section => {
    observer.observe(section);
});