// Simple interactive simulation for item selection
const agendaItems = document.querySelectorAll(".divide-y > div");
agendaItems.forEach((item) => {
  item.addEventListener("click", () => {
    agendaItems.forEach((i) => {
      i.classList.remove(
        "bg-light-blue-bg/30",
        "border-l-4",
        "border-primary-container",
      );
    });
    item.classList.add(
      "bg-light-blue-bg/30",
      "border-l-4",
      "border-primary-container",
    );
  });
});
