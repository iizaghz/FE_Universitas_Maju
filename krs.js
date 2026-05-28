// Search highlight mock
const searchInput = document.querySelector(
  'input[placeholder="Cari mata kuliah..."]',
);
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const rows = document.querySelectorAll(
      ".col-span-12.lg\\:col-span-7 tbody tr",
    );
    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      if (text.includes(e.target.value.toLowerCase())) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}

// Ripple-like scaling effect on buttons
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("mousedown", () => btn.classList.add("scale-[0.97]"));
  btn.addEventListener("mouseup", () => btn.classList.remove("scale-[0.97]"));
  btn.addEventListener("mouseleave", () =>
    btn.classList.remove("scale-[0.97]"),
  );
});

// KRS Interactivity
document.addEventListener("DOMContentLoaded", () => {
  let availableCourses = AppState.getAvailableCourses() || [];
  let myKrsIds = AppState.getMyKRS() || [];

  // Initial state copy for editing
  let currentKrsIds = [...myKrsIds];

  const renderAvailableCourses = () => {
    const tbody = document.querySelector(".col-span-12.lg\\:col-span-7 tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    availableCourses.forEach((course) => {
      // If already in KRS, disable add button or change style
      const isAdded = currentKrsIds.includes(course.id);

      const tr = document.createElement("tr");
      tr.className = "hover:bg-light-blue-bg/30";
      tr.innerHTML = `
                    <td class="px-4 py-3">${course.id}</td>
                    <td class="px-4 font-medium">${course.name}</td>
                    <td class="px-4">${course.class}</td>
                    <td class="px-4 text-center font-bold">${course.sks}</td>
                    <td class="px-4 text-center">${course.semester}</td>
                    <td class="px-4">${course.prereq}</td>
                    <td class="px-4 text-center">
                        ${
                          isAdded
                            ? `<span class="text-status-success-text text-xs font-bold"><span class="material-symbols-outlined text-[16px] align-middle">check</span> Ditambahkan</span>`
                            : `<button onclick="addCourse('${course.id}')" class="w-6 h-6 bg-status-success-bg text-status-success-text rounded flex items-center justify-center mx-auto hover:bg-status-success-text hover:text-white transition-all">
                                <span class="material-symbols-outlined text-[16px] font-bold">add</span>
                            </button>`
                        }
                    </td>
                `;
      tbody.appendChild(tr);
    });
  };

  const renderMyKrs = () => {
    const tbody = document.querySelector(".col-span-12.lg\\:col-span-5 tbody");
    const totalElement = document.querySelector(
      ".lg\\:col-span-5 .text-lg.font-extrabold",
    );
    const summarySksElement = document.querySelectorAll(
      ".text-[13px] .flex.justify-between .font-bold.text-primary",
    )[1];
    const summaryTotalMkElement = document.querySelectorAll(
      ".text-[13px] .flex.justify-between .font-bold.text-primary",
    )[2];
    const headerCount = document.querySelector(".lg\\:col-span-5 h3");

    if (!tbody) return;
    tbody.innerHTML = "";

    let totalSks = 0;
    const myCourses = currentKrsIds
      .map((id) => availableCourses.find((c) => c.id === id))
      .filter(Boolean);

    myCourses.forEach((course) => {
      totalSks += course.sks;
      const tr = document.createElement("tr");
      tr.className = "hover:bg-light-blue-bg/30";
      tr.innerHTML = `
                    <td class="px-4 py-3">${course.id}</td>
                    <td class="px-4 font-medium">${course.name}</td>
                    <td class="px-4">${course.class}</td>
                    <td class="px-4 text-center font-bold">${course.sks}</td>
                    <td class="px-4 text-center">
                        <button onclick="removeCourse('${course.id}')" class="w-6 h-6 bg-status-danger-bg text-status-danger-text rounded flex items-center justify-center mx-auto hover:bg-error hover:text-white transition-all">
                            <span class="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                    </td>
                `;
      tbody.appendChild(tr);
    });

    if (myCourses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-text-muted text-xs">Belum ada mata kuliah yang diambil.</td></tr>`;
    }

    if (totalElement) totalElement.textContent = totalSks + " SKS";
    if (summarySksElement) summarySksElement.textContent = totalSks + " SKS";
    if (summaryTotalMkElement)
      summaryTotalMkElement.textContent = myCourses.length;
    if (headerCount)
      headerCount.textContent = `Mata Kuliah yang Diambil (${myCourses.length})`;
  };

  window.addCourse = (id) => {
    const course = availableCourses.find((c) => c.id === id);
    if (!course) return;

    const myCourses = currentKrsIds
      .map((cid) => availableCourses.find((c) => c.id === cid))
      .filter(Boolean);
    const currentSks = myCourses.reduce((sum, c) => sum + c.sks, 0);

    if (currentSks + course.sks > 24) {
      showToast("Gagal: Melebihi batas maksimal 24 SKS!", "error");
      return;
    }

    if (!currentKrsIds.includes(id)) {
      currentKrsIds.push(id);
      renderAvailableCourses();
      renderMyKrs();
    }
  };

  window.removeCourse = (id) => {
    currentKrsIds = currentKrsIds.filter((cid) => cid !== id);
    renderAvailableCourses();
    renderMyKrs();
  };

  window.saveKRS = () => {
    AppState.setMyKRS(currentKrsIds);
    showToast("KRS berhasil disimpan!", "success");

    // Add notification
    let notifs = AppState.getNotifications() || [];
    notifs.unshift({
      id: Date.now(),
      type: "success",
      title: "KRS berhasil disimpan untuk Semester Genap",
      date: "Baru saja",
      read: false,
    });
    AppState.setNotifications(notifs);
  };

  window.clearKRS = () => {
    if (confirm("Yakin ingin menghapus semua mata kuliah dari KRS?")) {
      currentKrsIds = [];
      renderAvailableCourses();
      renderMyKrs();
    }
  };

  // Attach buttons
  const saveBtn =
    document.querySelector(
      'button:has(span.material-symbols-outlined:contains("save"))',
    ) ||
    Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Simpan KRS"),
    );
  if (saveBtn) saveBtn.onclick = saveKRS;

  const clearBtn =
    document.querySelector(
      'button:has(span.material-symbols-outlined:contains("delete"))',
    ) ||
    Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Hapus Semua"),
    );
  if (clearBtn) clearBtn.onclick = clearKRS;

  // Init render
  renderAvailableCourses();
  renderMyKrs();
});
