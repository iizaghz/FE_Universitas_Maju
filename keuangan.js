document.addEventListener("DOMContentLoaded", () => {
  const renderFinances = () => {
    const finances = AppState.getFinances();
    if (!finances) return;

    const tableBody = document.querySelector("tbody");
    const totalTagihanEl = document.querySelectorAll(".text-section-title")[1];
    const activeTagihanContainer = document.querySelector(".space-y-4.mb-8");
    const btnBayar =
      document.querySelector(
        'button:has(span.material-symbols-outlined:contains("arrow_forward"))',
      ) ||
      Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Bayar Sekarang"),
      );
    const statusPembayaranEl = document.querySelectorAll(
      ".text-section-title",
    )[0];
    const statusBarEl = statusPembayaranEl.nextElementSibling;

    let unpaidBills = finances.bills.filter((b) => b.status === "unpaid");
    let totalTagihan = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    // Update Overview Cards
    if (totalTagihanEl) {
      totalTagihanEl.textContent = `Rp ${totalTagihan.toLocaleString("id-ID")}`;
    }

    if (statusPembayaranEl && statusBarEl) {
      if (totalTagihan === 0) {
        statusPembayaranEl.textContent = "Lunas";
        statusBarEl.textContent = "Berhasil";
        statusBarEl.className =
          "px-3 py-1 bg-status-success-bg text-status-success-text rounded-full text-badge-text font-badge-text";
      } else {
        statusPembayaranEl.textContent = "Belum Lunas";
        statusBarEl.textContent = "Menunggu Pembayaran";
        statusBarEl.className =
          "px-3 py-1 bg-status-danger-bg text-status-danger-text rounded-full text-badge-text font-badge-text";
      }
    }

    // Render Table
    if (tableBody) {
      tableBody.innerHTML = "";
      finances.bills.forEach((bill, index) => {
        const isPaid = bill.status === "paid";
        const statusBadge = isPaid
          ? `<span class="px-2.5 py-0.5 bg-status-success-bg text-status-success-text rounded-full text-[11px] font-bold uppercase tracking-wide">Lunas</span>`
          : `<span class="px-2.5 py-0.5 bg-status-danger-bg text-status-danger-text rounded-full text-[11px] font-bold uppercase tracking-wide">Belum Lunas</span>`;

        tableBody.innerHTML += `
                            <tr class="hover:bg-light-blue-bg/30 transition-colors">
                                <td class="px-6 py-5 text-table-text font-table-text text-text-secondary">${index + 1}</td>
                                <td class="px-6 py-5 text-table-text font-table-text text-text-primary">TGH-2024-00${bill.id}</td>
                                <td class="px-6 py-5 text-table-text font-table-text text-text-primary">${bill.name}</td>
                                <td class="px-6 py-5 text-table-text font-table-text text-text-secondary">Genap 2023/2024</td>
                                <td class="px-6 py-5 text-table-text font-table-text font-bold text-text-primary">Rp ${bill.amount.toLocaleString("id-ID")}</td>
                                <td class="px-6 py-5">${statusBadge}</td>
                                <td class="px-6 py-5 text-center">
                                    <button class="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="Download Receipt">
                                        <span class="material-symbols-outlined">download</span>
                                    </button>
                                </td>
                            </tr>
                        `;
      });
    }

    // Render Active Tagihan Details
    if (activeTagihanContainer) {
      activeTagihanContainer.innerHTML = "";
      if (totalTagihan === 0) {
        activeTagihanContainer.innerHTML = `
                            <div class="p-3 bg-status-success-bg rounded-lg border border-status-success-text/10">
                                <p class="text-metadata font-metadata text-status-success-text flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">check_circle</span>
                                    Semua tagihan untuk semester ini telah lunas.
                                </p>
                            </div>
                        `;
        if (btnBayar) {
          btnBayar.classList.add("opacity-50", "cursor-not-allowed");
          btnBayar.disabled = true;
        }
      } else {
        unpaidBills.forEach((bill) => {
          activeTagihanContainer.innerHTML += `
                                <div class="flex justify-between items-center py-2 border-b border-divider-gray">
                                    <span class="text-body font-body text-text-secondary">${bill.name}</span>
                                    <span class="text-body font-body font-bold text-text-primary">Rp ${bill.amount.toLocaleString("id-ID")}</span>
                                </div>
                            `;
        });
        activeTagihanContainer.innerHTML += `
                            <div class="flex justify-between items-center py-2 pt-4">
                                <span class="text-label font-label text-text-primary">Total Harus Dibayar</span>
                                <span class="text-section-title font-section-title text-primary">Rp ${totalTagihan.toLocaleString("id-ID")}</span>
                            </div>
                        `;
        if (btnBayar) {
          btnBayar.classList.remove("opacity-50", "cursor-not-allowed");
          btnBayar.disabled = false;
        }
      }
    }

    // Attach Pay action
    if (btnBayar && totalTagihan > 0) {
      btnBayar.onclick = () => {
        let f = AppState.getFinances();
        f.bills.forEach((b) => {
          if (b.status === "unpaid") b.status = "paid";
        });
        AppState.setFinances(f);
        showToast("Pembayaran berhasil dikonfirmasi!", "success");

        // Add notification
        let notifs = AppState.getNotifications() || [];
        notifs.unshift({
          id: Date.now(),
          type: "info",
          title:
            "Pembayaran UKT diverifikasi sebesar Rp " +
            totalTagihan.toLocaleString("id-ID"),
          date: "Baru saja",
          read: false,
        });
        AppState.setNotifications(notifs);

        renderFinances();
      };
    }
  };

  renderFinances();

  // Interactions
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (!link.classList.contains("bg-white/10")) {
        link.style.transform = "translateX(4px)";
      }
    });
    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateX(0)";
    });
  });
});
