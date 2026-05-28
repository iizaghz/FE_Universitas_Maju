// Jadwal Kuliah Interactivity
document.addEventListener("DOMContentLoaded", () => {
  const availableCourses = AppState.getAvailableCourses() || [];
  const myKrsIds = AppState.getMyKRS() || [];

  // Map course IDs to fake schedule
  const scheduleData = {
    IF101: {
      day: 1,
      start: "07:00",
      end: "08:40",
      room: "R. A-201",
      lecturer: "Budi Santoso",
      color: "blue",
    },
    IF102: {
      day: 2,
      start: "08:50",
      end: "10:30",
      room: "R. C-305",
      lecturer: "Siti Aminah",
      color: "purple",
    },
    IF103: {
      day: 3,
      start: "13:00",
      end: "14:40",
      room: "R. B-203",
      lecturer: "Dewi Lestari",
      color: "green",
    },
    IF104: {
      day: 4,
      start: "08:50",
      end: "10:30",
      room: "R. B-203",
      lecturer: "Arief Wibowo",
      color: "orange",
    },
    UM101: {
      day: 5,
      start: "10:40",
      end: "12:20",
      room: "R. Lab 1",
      lecturer: "Rina Kartika",
      color: "rose",
    },
    UM102: {
      day: 1,
      start: "13:00",
      end: "14:40",
      room: "R. D-101",
      lecturer: "Ahmad Fauzi",
      color: "slate",
    },
    IF105: {
      day: 3,
      start: "07:00",
      end: "08:40",
      room: "R. E-201",
      lecturer: "Eko Prasetyo",
      color: "blue",
    },
  };

  const timeSlots = [
    { id: 1, start: "07:00", end: "08:40" },
    { id: 2, start: "08:50", end: "10:30" },
    { id: 3, start: "10:40", end: "12:20" },
    { id: 4, start: "13:00", end: "14:40" },
    { id: 5, start: "14:50", end: "16:30" },
  ];

  const renderSchedule = () => {
    const gridContainer = document.querySelector(
      ".schedule-grid.time-row",
    ).parentElement;
    // Clear existing time rows (except header)
    gridContainer.innerHTML = "";

    let todayClasses = [];

    timeSlots.forEach((slot) => {
      let rowHtml = `<div class="schedule-grid time-row">
                        <div class="flex flex-col items-center justify-center text-xs font-semibold text-text-muted">
                            <span>${slot.start}</span><span>${slot.end}</span>
                        </div>`;

      for (let day = 1; day <= 6; day++) {
        let cellContent = "";

        myKrsIds.forEach((id) => {
          const courseInfo = availableCourses.find((c) => c.id === id);
          const sched = scheduleData[id];
          if (
            courseInfo &&
            sched &&
            sched.day === day &&
            sched.start === slot.start
          ) {
            cellContent = `
                                    <div class="h-full bg-${sched.color}-100 rounded-lg p-2 border-l-4 border-${sched.color}-500 hover:shadow-md transition-shadow cursor-pointer">
                                        <p class="text-[11px] font-bold text-${sched.color}-800 leading-tight">${courseInfo.name}</p>
                                        <p class="text-[10px] text-${sched.color}-600 font-medium">${sched.room}</p>
                                        <p class="text-[9px] text-${sched.color}-500 mt-1">${sched.lecturer}</p>
                                    </div>
                                `;

            if (day === 3) {
              // Let's say today is Wednesday (3)
              todayClasses.push({ course: courseInfo, sched });
            }
          }
        });

        rowHtml += `<div class="p-2 border-l border-border-gray">${cellContent}</div>`;
      }
      rowHtml += `</div>`;
      gridContainer.innerHTML += rowHtml;
    });

    // Render Daily Schedule (Assume Wednesday)
    const dailyContainer = document.querySelectorAll(
      ".col-span-12.lg\\:col-span-3 .p-0",
    )[0];
    if (dailyContainer) {
      let dailyHtml = "";
      let totalSks = 0;
      todayClasses.forEach((item) => {
        totalSks += item.course.sks;
        dailyHtml += `
                            <div class="p-6 border-b border-border-gray hover:bg-light-blue-bg/20 transition-colors">
                                <div class="flex gap-4">
                                    <div class="text-xs font-semibold text-text-muted pt-1">
                                        ${item.sched.start}<br>${item.sched.end}
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2 mb-1">
                                            <div class="w-2 h-2 rounded-full bg-${item.sched.color}-500"></div>
                                            <h3 class="text-sm font-bold text-text-primary">${item.course.name}</h3>
                                        </div>
                                        <p class="text-[11px] text-text-muted mb-1">${item.sched.room}</p>
                                        <p class="text-[11px] text-text-muted">${item.sched.lecturer}</p>
                                    </div>
                                </div>
                            </div>
                        `;
      });

      if (todayClasses.length === 0) {
        dailyHtml = `
                            <div class="p-6 text-center">
                                <p class="text-[11px] text-text-muted">Tidak ada jadwal hari ini.</p>
                            </div>
                        `;
      }
      dailyContainer.innerHTML = dailyHtml;

      // Update Summary
      const totalClassesEl = document.querySelectorAll(
        ".text-lg.font-bold.text-text-primary",
      )[0];
      const totalSksEl = document.querySelectorAll(
        ".text-lg.font-bold.text-text-primary",
      )[1];
      if (totalClassesEl) totalClassesEl.textContent = todayClasses.length;
      if (totalSksEl) totalSksEl.textContent = totalSks + " SKS";
    }
  };

  renderSchedule();

  // Simple interactive simulation for filter
  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      const gridBody = document.querySelector(
        ".schedule-grid.time-row",
      ).parentElement;
      gridBody.style.opacity = "0.5";
      setTimeout(() => {
        gridBody.style.opacity = "1";
        showToast("Jadwal diperbarui", "info");
      }, 400);
    });
  });
});
