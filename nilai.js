document.addEventListener("DOMContentLoaded", () => {
  const semesterSelect = document.querySelector("select");
  const tbody = document.querySelector(".overflow-x-auto table tbody");
  const ipkElement = document.querySelectorAll(
    ".text-primary.text-center.text-sm",
  )[2];
  const ipSemesterElement = document.querySelectorAll(
    ".text-sm.font-bold.text-primary",
  )[0];
  const profile = AppState.getProfile();

  if (profile) {
    // Update KHS Sidebar info
    const nameEl = document.querySelectorAll(
      ".flex.justify-between .text-sm.font-semibold.text-on-surface",
    )[0];
    const nimEl = document.querySelectorAll(
      ".flex.justify-between .text-sm.font-semibold.text-on-surface",
    )[1];
    if (nameEl) nameEl.textContent = profile.name;
    if (nimEl) nimEl.textContent = profile.nim;
  }

  if (semesterSelect && tbody) {
    semesterSelect.addEventListener("change", () => {
      // Simulate loading
      tbody.style.opacity = "0.5";
      setTimeout(() => {
        // Fake randomize grades
        const rows = tbody.querySelectorAll("tr");
        let totalBobot = 0;
        let totalSks = 0;

        const grades = [
          { h: "A", a: "4.00" },
          { h: "A-", a: "3.75" },
          { h: "B+", a: "3.50" },
          { h: "B", a: "3.00" },
          { h: "B-", a: "2.75" },
        ];

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length === 7) {
            const sks = parseInt(cells[3].textContent);
            const randomGrade =
              grades[Math.floor(Math.random() * grades.length)];

            cells[4].textContent = randomGrade.h;
            cells[5].textContent = randomGrade.a;

            const bobot = sks * parseFloat(randomGrade.a);
            cells[6].textContent = bobot.toFixed(2);

            totalSks += sks;
            totalBobot += bobot;
          }
        });

        const newIp = (totalBobot / totalSks).toFixed(2);
        if (ipkElement) ipkElement.textContent = newIp;
        if (ipSemesterElement) ipSemesterElement.textContent = newIp;

        tbody.style.opacity = "1";
        showToast(`Data nilai ${semesterSelect.value} dimuat`, "info");
      }, 500);
    });
  }

  // Micro-interactions
  document.querySelectorAll("nav a, nav button").forEach((el) => {
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
});
