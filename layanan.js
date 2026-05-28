// Simple micro-interaction for cards
document.querySelectorAll(".card-shadow").forEach((card) => {
  card.addEventListener("mousedown", () => {
    card.style.transform = "scale(0.98)";
  });
  card.addEventListener("mouseup", () => {
    card.style.transform = "scale(1)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
  });
});
