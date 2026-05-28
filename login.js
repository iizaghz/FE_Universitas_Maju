function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("passwordToggle");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.textContent = "visibility_off";
  } else {
    passwordInput.type = "password";
    toggleIcon.textContent = "visibility";
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML =
    '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span> Memproses...';

  // Simulate API Call
  setTimeout(() => {
    alert("Login Berhasil! Mengalihkan ke Dashboard...");
    window.location.href = "dashboard_universitas_maju.html"; // Tambahkan ini untuk redirect
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.classList.replace("bg-status-success-bg", "bg-primary-container");
    btn.classList.remove("text-status-success-text");
  }, 500);
  }, 1500);

