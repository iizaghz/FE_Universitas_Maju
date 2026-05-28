document.addEventListener("DOMContentLoaded", () => {
  // Dropdown logic
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");
  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector(".dropdown-icon");
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        icon.style.transform = "rotate(180deg)";
      } else {
        content.classList.add("hidden");
        icon.style.transform = "rotate(0deg)";
      }
    });
  });

  // Determine active nav
  let currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace("_universitas_maju.html", "");
  if (currentPage === "nilai") {
    const hash = window.location.hash;
    if (hash === "#transkrip") {
      currentPage = "nilai_transkrip";
    } else {
      currentPage = "nilai";
    }
  }

  let foundActive = false;
  document.querySelectorAll(".sub-nav-item").forEach((el) => {
    if (el.dataset.page === currentPage) {
      el.classList.add(
        "bg-white/10",
        "rounded-xl",
        "font-bold",
        "text-white",
        "flex",
        "items-center",
        "gap-3",
        "px-4",
        "py-2",
        "-ml-8",
        "mb-1",
      );
      const iconSpan = document.createElement("span");
      iconSpan.className = "material-symbols-outlined text-[20px]";
      const iconMap = {
        jadwal_kuliah: "calendar_today",
        krs_refined: "list_alt",
        nilai: "grade",
        nilai_transkrip: "receipt_long",
        kurikulum: "menu_book",
      };
      iconSpan.textContent = iconMap[currentPage] || "circle";
      el.prepend(iconSpan);

      // Open parent dropdown
      const parentDropdown = el.closest(".dropdown-content");
      if (parentDropdown) {
        parentDropdown.classList.remove("hidden");
        const btnIcon =
          parentDropdown.previousElementSibling.querySelector(".dropdown-icon");
        if (btnIcon) btnIcon.style.transform = "rotate(180deg)";
      }
      foundActive = true;
    }
  });

  if (!foundActive) {
    document.querySelectorAll(".nav-item").forEach((el) => {
      if (el.dataset.page === currentPage) {
        el.classList.add(
          "bg-white/10",
          "rounded-xl",
          "font-bold",
          "text-white",
        );
        el.classList.remove("text-white/70");
      }
    });
  }
});
