document.addEventListener("DOMContentLoaded", () => {
  const profile = AppState.getProfile();

  // Map inputs
  const inputName = document.querySelector('input[value="Andi Pratama"]');
  const inputEmail = document.querySelector('input[type="email"]');
  const inputPhone = document.querySelector('input[value="0812-3456-7890"]');
  const inputAddress = document.querySelector("textarea");
  const saveBtn =
    document.querySelector(
      'button:has(span.material-symbols-outlined:contains("save"))',
    ) ||
    Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Simpan Perubahan"),
    );

  if (profile) {
    if (inputName) inputName.value = profile.name;
    if (inputEmail) inputEmail.value = profile.email;
    if (inputPhone) inputPhone.value = profile.phone;
    if (inputAddress) inputAddress.value = profile.address;

    // Also update the left panel
    const panelName = document.querySelector(".col-span-12.lg\\:col-span-3 h3");
    if (panelName) panelName.textContent = profile.name;
    const panelEmail = document.querySelector(".flex-1 p.break-all");
    if (panelEmail) panelEmail.textContent = profile.email;
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (profile) {
        profile.name = inputName ? inputName.value : profile.name;
        profile.email = inputEmail ? inputEmail.value : profile.email;
        profile.phone = inputPhone ? inputPhone.value : profile.phone;
        profile.address = inputAddress ? inputAddress.value : profile.address;

        AppState.setProfile(profile);
        showToast("Profil berhasil diperbarui!", "success");

        // Add notification
        let notifs = AppState.getNotifications() || [];
        notifs.unshift({
          id: Date.now(),
          type: "info",
          title: "Data profil berhasil diubah",
          date: "Baru saja",
          read: false,
        });
        AppState.setNotifications(notifs);

        // Update UI immediately
        updateNavbarUI();

        const panelName = document.querySelector(
          ".col-span-12.lg\\:col-span-3 h3",
        );
        if (panelName) panelName.textContent = profile.name;
        const panelEmail = document.querySelector(".flex-1 p.break-all");
        if (panelEmail) panelEmail.textContent = profile.email;
      }
    });
  }

  // Micro-interactions
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    element.addEventListener("focus", () => {
      element.parentElement
        .querySelector("label")
        ?.classList.add("text-primary");
    });
    element.addEventListener("blur", () => {
      element.parentElement
        .querySelector("label")
        ?.classList.remove("text-primary");
    });
  });

  // Hover effects on Sidebar links
  const navLinks = document.querySelectorAll("aside nav a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (!link.classList.contains("active-nav-bg")) {
        link.style.transform = "translateX(4px)";
      }
    });
    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateX(0)";
    });
  });
});
