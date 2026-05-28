// Micro-interactions and simple state handling
document.querySelectorAll(".sidebar-item").forEach((item) => {
  item.addEventListener("mousedown", function () {
    this.style.transform = "scale(0.98)";
  });
  item.addEventListener("mouseup", function () {
    this.style.transform = "scale(1)";
  });
});

// Search bar focus effect
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener("focus", () => {
  searchInput.parentElement.classList.add("ring-2", "ring-primary/20");
});
searchInput.addEventListener("blur", () => {
  searchInput.parentElement.classList.remove("ring-2", "ring-primary/20");
});
