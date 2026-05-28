// app.js - Global Frontend Logic and State Management

const STORAGE_KEYS = {
  PROFILE: "siakad_profile",
  NOTIFICATIONS: "siakad_notifications",
  KRS_AVAILABLE: "siakad_krs_available",
  MY_KRS: "siakad_my_krs",
  FINANCES: "siakad_finances",
};

// Initial Dummy Data
const DUMMY_DATA = {
  profile: {
    name: "Andi Pratama",
    nim: "2101234567",
    role: "Mahasiswa",
    program: "Sistem Informasi",
    faculty: "Fakultas Ilmu Komputer",
    phone: "081234567890",
    email: "andi.pratama@mhs.umaju.ac.id",
    address: "Jl. Merdeka No. 45, Jakarta",
  },
  notifications: [
    {
      id: 1,
      type: "info",
      title: "Pembayaran UKT diverifikasi",
      date: "2 jam yang lalu",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Nilai Basis Data dipublikasikan",
      date: "5 jam yang lalu",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Batas KRS 15 Mei 2024",
      date: "1 hari yang lalu",
      read: false,
    },
    {
      id: 4,
      type: "error",
      title: "KRS Semester Genap Dibuka",
      date: "2 hari yang lalu",
      read: true,
    },
  ],
  krs_available: [
    {
      id: "IF101",
      name: "Algoritma dan Pemrograman",
      class: "SI-21A",
      sks: 3,
      semester: 2,
      prereq: "-",
    },
    {
      id: "IF102",
      name: "Struktur Data",
      class: "SI-21A",
      sks: 3,
      semester: 2,
      prereq: "IF101",
    },
    {
      id: "IF103",
      name: "Basis Data",
      class: "SI-21A",
      sks: 3,
      semester: 2,
      prereq: "-",
    },
    {
      id: "IF104",
      name: "Sistem Operasi",
      class: "SI-21A",
      sks: 3,
      semester: 2,
      prereq: "-",
    },
    {
      id: "IF105",
      name: "Jaringan Komputer",
      class: "SI-21A",
      sks: 3,
      semester: 3,
      prereq: "-",
    },
    {
      id: "IF106",
      name: "Rekayasa Perangkat Lunak",
      class: "SI-21A",
      sks: 3,
      semester: 4,
      prereq: "IF102",
    },
    {
      id: "IF107",
      name: "Kecerdasan Buatan",
      class: "SI-21A",
      sks: 3,
      semester: 5,
      prereq: "IF102",
    },
    {
      id: "UM101",
      name: "Pendidikan Pancasila",
      class: "UM-21A",
      sks: 2,
      semester: 1,
      prereq: "-",
    },
    {
      id: "UM102",
      name: "Bahasa Indonesia",
      class: "UM-21A",
      sks: 2,
      semester: 1,
      prereq: "-",
    },
  ],
  my_krs: [
    "IF101",
    "IF102",
    "IF103",
    "IF104",
    "UM101",
    "UM102", // IDs of taken courses initially
  ],
  finances: {
    balance: 0,
    bills: [
      {
        id: 1,
        name: "UKT Semester Genap 2023/2024",
        amount: 4500000,
        deadline: "31 Jan 2024",
        status: "unpaid",
      },
      {
        id: 2,
        name: "Sumbangan Pembangunan",
        amount: 1500000,
        deadline: "15 Jan 2024",
        status: "paid",
      },
    ],
  },
};

// Initialize State
function initAppState() {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(
      STORAGE_KEYS.PROFILE,
      JSON.stringify(DUMMY_DATA.profile),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(DUMMY_DATA.notifications),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.KRS_AVAILABLE)) {
    localStorage.setItem(
      STORAGE_KEYS.KRS_AVAILABLE,
      JSON.stringify(DUMMY_DATA.krs_available),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.MY_KRS)) {
    localStorage.setItem(
      STORAGE_KEYS.MY_KRS,
      JSON.stringify(DUMMY_DATA.my_krs),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.FINANCES)) {
    localStorage.setItem(
      STORAGE_KEYS.FINANCES,
      JSON.stringify(DUMMY_DATA.finances),
    );
  }
}

// Data Access Helpers
const AppState = {
  getProfile: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE)),
  setProfile: (data) =>
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data)),

  getNotifications: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)),
  setNotifications: (data) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data));
    updateNavbarUI();
  },

  getAvailableCourses: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.KRS_AVAILABLE)),
  getMyKRS: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_KRS)),
  setMyKRS: (courseIds) =>
    localStorage.setItem(STORAGE_KEYS.MY_KRS, JSON.stringify(courseIds)),

  getFinances: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.FINANCES)),
  setFinances: (data) =>
    localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(data)),
};

// Common UI Functions
function updateNavbarUI() {
  const profile = AppState.getProfile();
  const notifications = AppState.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Update Profile Name in Top Navbar
  const nameElements = document.querySelectorAll(
    "header .font-label.text-primary, header .font-label.text-text-primary, header .font-label.text-on-surface",
  );
  nameElements.forEach((el) => {
    if (
      el.textContent.includes("Andi") ||
      el.textContent.includes("Andi Pratama")
    ) {
      el.textContent = profile.name;
    }
  });

  // Update Notification Badge
  const badgeElements = document.querySelectorAll(
    "header .bg-error.text-white",
  );
  badgeElements.forEach((badge) => {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  });
}

// Toast Notification System
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-[9999] flex flex-col gap-2";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  let bgClass =
    type === "success"
      ? "bg-status-success-text"
      : type === "error"
        ? "bg-status-danger-text"
        : "bg-primary";

  toast.className = `${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transform transition-all translate-y-10 opacity-0 duration-300`;

  const icon =
    type === "success" ? "check_circle" : type === "error" ? "error" : "info";

  toast.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <span class="font-medium text-sm">${message}</span>
    `;

  container.appendChild(toast);

  // Animate In
  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 50);

  // Animate Out
  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Sidebar Toggle Logic
function initSidebarToggle() {
  // Create backdrop for mobile drawer
  let backdrop = document.getElementById("sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "sidebar-backdrop";
    backdrop.className = "fixed inset-0 bg-slate-900/50 z-40 hidden transition-opacity duration-300 opacity-0";
    document.body.appendChild(backdrop);
  }

  // Close mobile sidebar when backdrop is clicked
  backdrop.addEventListener("click", () => {
    document.body.classList.remove("sidebar-open");
  });

  const isCollapsed = localStorage.getItem("sidebar_collapsed") === "true";
  if (isCollapsed && window.innerWidth > 1024) {
    document.body.classList.add("sidebar-collapsed");
  }

  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("#sidebar-toggle-btn");
    if (toggleBtn) {
      if (window.innerWidth <= 1024) {
        document.body.classList.toggle("sidebar-open");
      } else {
        document.body.classList.toggle("sidebar-collapsed");
        const isNowCollapsed = document.body.classList.contains("sidebar-collapsed");
        localStorage.setItem("sidebar_collapsed", isNowCollapsed);
      }
    }
  });

  // Close sidebar drawer when navigating on mobile (clicking sidebar menu links)
  const navItems = document.querySelectorAll(".sidebar a, .sidebar button:not(.dropdown-btn)");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });
}

// Unify hamburger toggle button inside the search container (pill layout)
function unifyHeaderSearch() {
  const header = document.querySelector("header");
  if (!header) return;

  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const searchInput = header.querySelector("input[placeholder*='Cari']");
  if (!toggleBtn || !searchInput) return;

  const searchContainer = searchInput.parentElement;
  if (!searchContainer) return;

  // Add the unified styling classes
  searchContainer.classList.add("unified-search-bar");

  // Move the toggle button inside the search container at the beginning
  searchContainer.prepend(toggleBtn);

  // Style search icon
  const searchIcon = searchContainer.querySelector(".material-symbols-outlined:not(#sidebar-toggle-btn *)");
  if (searchIcon) {
    searchIcon.className = "material-symbols-outlined search-icon";
    searchIcon.style.position = "static";
    searchIcon.style.transform = "none";
  }

  // Style input
  searchInput.className = "search-input";
  searchInput.style.paddingLeft = "0";

  // Ensure the parent wrapper takes appropriate width and flex layout
  const parentWrapper = searchContainer.parentElement;
  if (parentWrapper && parentWrapper !== header) {
    parentWrapper.className = "flex items-center flex-grow max-w-xl mr-4";
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initAppState();
  updateNavbarUI();
  initSidebarToggle();
  unifyHeaderSearch();
});
