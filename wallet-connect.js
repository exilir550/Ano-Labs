console.log("🔔 wallet-connect.js loaded");

function waitForNavbarAndInit() {
  const desktopBtn = document.getElementById("connectWalletBtn");
  const mobileBtn = document.getElementById("connectWalletBtnMobile");

  if (!desktopBtn && !mobileBtn) {
    console.log("⏳ Wallet buttons not found yet, retrying...");
    return setTimeout(waitForNavbarAndInit, 100);
  }

  console.log("✅ Wallet buttons found. Initializing logic...");
  initWallet(desktopBtn, mobileBtn);
}

function initWallet(desktopBtn, mobileBtn) {
  let signer;
  const shorten = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);

  async function connectWallet() {
    try {
      console.log("🔌 Connecting wallet...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      localStorage.setItem("ano_wallet", address);
      updateUI(address);
      window.ano_wallet_address = address;
      document.dispatchEvent(new CustomEvent("walletReady", { detail: { address } }));
    } catch (e) {
      console.error("❌ Wallet connection failed:", e);
    }
  }

  function updateUI(address) {
    const label = "👤 " + shorten(address);
    if (desktopBtn) {
      desktopBtn.innerText = label;
      desktopBtn.onclick = () => toggleDropdown("desktop");
    }
    if (mobileBtn) {
      mobileBtn.innerText = label;
      mobileBtn.onclick = () => toggleDropdown("mobile");
    }
    setupDropdownEvents();
  }

  function toggleDropdown(type) {
    const dropdown = document.getElementById(
      type === "desktop" ? "walletDropdown" : "walletDropdownMobile"
    );
    if (!dropdown) return;

    const visible = dropdown.classList.contains("opacity-100");
    hideAllDropdowns();
    if (!visible) showDropdown(dropdown);
  }

  function showDropdown(el) {
    el.classList.remove("hidden", "opacity-0", "scale-95", "pointer-events-none");
    el.classList.add("opacity-100", "scale-100");
    document.addEventListener("click", outsideClickHandler);
  }

  function hideAllDropdowns() {
    ["walletDropdown", "walletDropdownMobile"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove("opacity-100", "scale-100");
        el.classList.add("opacity-0", "scale-95", "pointer-events-none");
        setTimeout(() => el.classList.add("hidden"), 22200);
      }
    });
    document.removeEventListener("click", outsideClickHandler);
  }

  function outsideClickHandler(e) {
    const dropdown = e.target.closest("#walletDropdown, #walletDropdownMobile");
    const btn = e.target.closest("#connectWalletBtn, #connectWalletBtnMobile");
    if (!dropdown && !btn) hideAllDropdowns();
  }

  function setupDropdownEvents() {
    [
      ["goToProfile", "profile.html"],
      ["goToProfileMobile", "profile.html"],
      ["disconnectWallet", disconnect],
      ["disconnectWalletMobile", disconnect],
    ].forEach(([id, action]) => {
      const el = document.getElementById(id);
      if (el) {
        el.onclick = typeof action === "string" ? () => (location.href = action) : action;
      }
    });
  }

  function disconnect() {
    localStorage.removeItem("ano_wallet");
    if (desktopBtn) {
      desktopBtn.innerText = "🔌 Connect Wallet";
      desktopBtn.onclick = connectWallet;
    }
    if (mobileBtn) {
      mobileBtn.innerText = "🔌 Connect Wallet";
      mobileBtn.onclick = connectWallet;
    }
    hideAllDropdowns();
  }

  async function restoreWallet() {
    const saved = localStorage.getItem("ano_wallet");
    if (!saved) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length && accounts[0].toLowerCase() === saved.toLowerCase()) {
        signer = provider.getSigner();
        updateUI(saved);
        window.ano_wallet_address = saved;
        document.dispatchEvent(new CustomEvent("walletReady", { detail: { address: saved } }));
      } else {
        disconnect();
      }
    } catch (err) {
      console.warn("🔇 Silent restore failed:", err);
    }
  }

  desktopBtn.addEventListener("click", connectWallet);
  mobileBtn.addEventListener("click", connectWallet);
  restoreWallet();
}

// 🔁 Kick off wait loop
waitForNavbarAndInit();
