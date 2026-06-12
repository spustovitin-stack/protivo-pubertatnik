chrome.storage.local.get(["blockedSites"], (result) => {
  const blockedSites = result.blockedSites || ["noodlemagazine.com", "pornhub.org"];
  const currentUrl = window.location.href;

  // Проверяем, содержит ли текущий URL хотя бы один из заблокированных доменов
  const isBlocked = blockedSites.some(site => currentUrl.includes(site));

  if (isBlocked) {
    alert("Слышь, пубертатник! Тебе сюда нельзя.");
    chrome.runtime.sendMessage({ action: "redirect" });
  }
});
