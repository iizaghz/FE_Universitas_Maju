// Micro-interaction for table rows
document.querySelectorAll("tbody tr").forEach((row) => {
  row.addEventListener("mouseenter", () => {
    row.style.cursor = "pointer";
  });
});

// Simple filter logic simulation
const semesterSelect = document.querySelector("select");
semesterSelect.addEventListener("change", (e) => {
  console.log("Filtering for:", e.target.value);
  // Visual feedback of loading
  const table = document.querySelector("table");
  table.style.opacity = "0.5";
  setTimeout(() => {
    table.style.opacity = "1";
  }, 300);
});
