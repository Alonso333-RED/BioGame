alert("🧠 Bienvenido al proyecto Sustancias y Sinapsis");

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {

    card.addEventListener("mouseenter", () => {
        card.style.backgroundColor = "#374151";
    });

    card.addEventListener("mouseleave", () => {
        card.style.backgroundColor = "#1f2937";
    });

});