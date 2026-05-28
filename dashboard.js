// Simple interactive effects
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mousedown", () => {
    el.style.transform = "scale(0.98)";
  });
  el.addEventListener("mouseup", () => {
    el.style.transform = "scale(1)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
  });
});

// Tab switching logic (simulated)
const navItems = document.querySelectorAll("aside nav a");
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    navItems.forEach((i) => {
      i.classList.remove("bg-white/12", "text-on-primary", "font-bold");
      i.classList.add("text-white/70", "hover:text-white", "hover:bg-white/5");
    });
    item.classList.remove(
      "text-white/70",
      "hover:text-white",
      "hover:bg-white/5",
    );
    item.classList.add("bg-white/12", "text-on-primary", "font-bold");
  });
});
