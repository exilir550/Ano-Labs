window.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectWalletBtn");
  if (!connectBtn || typeof window.ethereum === "undefined") return;

  let signer;
  let dropdown;

  function shorten(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  function createDropdown() {
    dropdown = document.createElement("div");
    dropdown.id = "walletDropdown";
    dropdown.className =
      "absolute mt-2 right-0 bg-white text-black text-sm rounded shadow-xl z-50 w-40";
    dropdown.innerHTML = `
      <button id="goToProfile" class="block w-full text-left px-4 py-2 hover:bg-gray-100">👤 Go to Profile</button>
      <button id="disconnectWallet" class="block w-full text-left px-4 py-2 hover:bg-gray-100">❌ Disconnect</button>
    `;
    document.body.appendChild(dropdown);

    const rect = connectBtn.getBoundingClientRect();
    dropdown.style.position = "absolute";
    dropdown.style.top = rect.bottom + 5 + "px";
    dropdown.style.left = rect.right - 160 + "px";

    document.getElementById("goToProfile").onclick = () => {
      window.location.href = "profile.html";
    };
    document.getElementById("disconnectWallet").onclick = () => {
      localStorage.removeItem("ano_wallet");
      location.reload();
    };

    window.addEventListener("click", handleOutsideClick);
  }

  function removeDropdown() {
    if (dropdown) {
      dropdown.remove();
      dropdown = null;
      window.removeEventListener("click", handleOutsideClick);
    }
  }

  function handleOutsideClick(e) {
    if (dropdown && !dropdown.contains(e.target) && e.target !== connectBtn) {
      removeDropdown();
    }
  }

  function setupConnectedUI(address) {
    connectBtn.innerText = "👤 " + shorten(address);
    connectBtn.onclick = () => {
      if (dropdown) removeDropdown();
      else createDropdown();
    };
  }

  async function silentlyRestoreWallet() {
    const savedWallet = localStorage.getItem("ano_wallet");
    if (!savedWallet) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts(); // ✅ silent
      if (accounts.length && accounts[0].toLowerCase() === savedWallet.toLowerCase()) {
        signer = provider.getSigner();
        setupConnectedUI(savedWallet);

        // ✅ dispatch event to let other scripts use signer/address
        window.dispatchEvent(new CustomEvent("wallet-restored", {
          detail: { address: savedWallet, signer, provider }
        }));
      } else {
        localStorage.removeItem("ano_wallet");
      }
    } catch (err) {
      console.warn("Silent restore failed:", err);
    }
  }

  async function connectWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      localStorage.setItem("ano_wallet", address);
      setupConnectedUI(address);

      window.dispatchEvent(new CustomEvent("wallet-restored", {
        detail: { address, signer, provider }
      }));
    } catch (err) {
      console.error("Wallet connect failed:", err);
    }
  }

  connectBtn.addEventListener("click", connectWallet);
  silentlyRestoreWallet();
});
