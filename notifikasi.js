document.addEventListener("DOMContentLoaded", () => {
  const notifContainer = document.querySelector(".space-y-4");
  const markAllBtn =
    document.querySelector(
      'button:has(span.material-symbols-outlined:contains("done_all"))',
    ) ||
    Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Tandai Semua Dibaca"),
    );

  const renderNotifications = () => {
    let notifications = AppState.getNotifications() || [];

    if (notifContainer) {
      notifContainer.innerHTML = "";

      if (notifications.length === 0) {
        notifContainer.innerHTML =
          '<div class="p-6 text-center text-text-muted">Tidak ada notifikasi.</div>';
        return;
      }

      notifications.forEach((notif) => {
        const isUnread = !notif.read;
        let icon = "info";
        let colorClass = "status-info";
        let category = "system";

        if (notif.type === "success") {
          icon = "check_circle";
          colorClass = "status-success";
          category = "academic";
        } else if (notif.type === "warning") {
          icon = "warning";
          colorClass = "status-warning";
          category = "system";
        } else if (notif.type === "error") {
          icon = "error";
          colorClass = "status-danger";
          category = "system";
        } else if (notif.type === "info") {
          if (
            notif.title.toLowerCase().includes("uang") ||
            notif.title.toLowerCase().includes("bayar")
          ) {
            icon = "account_balance_wallet";
            colorClass = "status-success";
            category = "finance";
          }
        }

        const unreadBadge = isUnread
          ? `<span class="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Baru</span>`
          : "";

        notifContainer.innerHTML += `
                            <div class="group relative bg-white rounded-2xl border ${isUnread ? "border-primary shadow-sm" : "border-border-gray opacity-80"} p-6 hover:shadow-md transition-all cursor-pointer flex items-start gap-5" data-category="${category}" onclick="viewDetail(${notif.id})">
                                <div class="w-12 h-12 rounded-xl bg-${colorClass}-bg flex items-center justify-center text-${colorClass}-text shrink-0">
                                    <span class="material-symbols-outlined">${icon}</span>
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between items-start">
                                        <h3 class="font-card-title text-card-title ${isUnread ? "text-text-primary" : "text-text-secondary"} group-hover:text-primary transition-colors">${notif.title}</h3>
                                        ${unreadBadge}
                                    </div>
                                    <p class="text-body text-text-secondary mt-1 line-clamp-2">${notif.title} - Informasi lebih detail dapat dilihat dengan mengklik notifikasi ini.</p>
                                    <div class="flex items-center justify-between mt-4">
                                        <div class="flex items-center gap-4">
                                            <span class="flex items-center gap-1.5 text-metadata text-text-muted">
                                                <span class="material-symbols-outlined text-sm">schedule</span>
                                                ${notif.date}
                                            </span>
                                        </div>
                                        <button class="text-error hover:underline text-xs z-10 relative" onclick="event.stopPropagation(); deleteNotif(${notif.id})">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        `;
      });
    }
  };

  window.viewDetail = (id) => {
    let notifs = AppState.getNotifications() || [];
    let notif = notifs.find((n) => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      AppState.setNotifications(notifs);
      renderNotifications();
    }

    // Show Overlay
    const overlay = document.getElementById("detailOverlay");
    const panel = overlay.querySelector("div");
    const detailTitle = document.getElementById("detailTitle");
    if (detailTitle)
      detailTitle.textContent = notif ? notif.title : "Detail Notifikasi";

    overlay.classList.remove("opacity-0", "pointer-events-none");
    panel.classList.remove("translate-x-full");
  };

  window.deleteNotif = (id) => {
    let notifs = AppState.getNotifications() || [];
    notifs = notifs.filter((n) => n.id !== id);
    AppState.setNotifications(notifs);
    renderNotifications();
  };

  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      let notifs = AppState.getNotifications() || [];
      notifs.forEach((n) => (n.read = true));
      AppState.setNotifications(notifs);
      renderNotifications();
      showToast("Semua notifikasi ditandai dibaca", "success");
    });
  }

  renderNotifications();

  window.filterNotif = (category) => {
    // Update UI tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.remove("active", "bg-white", "text-primary", "shadow-sm");
      tab.classList.add("text-text-secondary");
    });
    event.target.classList.add(
      "active",
      "bg-white",
      "text-primary",
      "shadow-sm",
    );
    event.target.classList.remove("text-text-secondary");

    // Filter logic
    const cards = document.querySelectorAll("[data-category]");
    cards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  };

  window.closeDetail = () => {
    const overlay = document.getElementById("detailOverlay");
    const panel = overlay.querySelector("div");

    overlay.classList.add("opacity-0", "pointer-events-none");
    panel.classList.add("translate-x-full");
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
});
