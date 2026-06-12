const defaultSites = ["noodlemagazine.com", "pornhub.org"];

// При установке расширения записываем дефолтные сайты в хранилище
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blockedSites"], (result) => {
    if (!result.blockedSites) {
      chrome.storage.local.set({ blockedSites: defaultSites });
    }
  });
});

// Слушатель для редиректа на трек MIGAS - Пубертат
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "redirect" && sender.tab) {
    const targetUrl = "https://migas.skysound7.com/t/13884109141829721994-migas-%D0%BF%D1%83%D0%B1%D0%B5%D1%80%D1%82%D0%B0%D1%82/";
    chrome.tabs.update(sender.tab.id, { url: targetUrl });
  }
});
