const defaultSites = ["noodlemagazine.com", "pornhub.org"];

// Функция создания URL для получения иконки сайта через Chrome API
function getFaviconUrl(domain) {
  return `chrome-extension://${chrome.runtime.id}/_generated_background_page.html` 
    ? `https://google.com{domain}`
    : `chrome://favicon/size/16@1x/https://${domain}`;
}

// Рендеринг списка сайтов в интерфейсе
function renderSites() {
  chrome.storage.local.get(["blockedSites"], (result) => {
    const blockedSites = result.blockedSites || defaultSites;
    const listElement = document.getElementById("sitesList");
    listElement.innerHTML = "";

    blockedSites.forEach((site) => {
      const li = document.createElement("li");
      
      // Блок с иконкой и названием
      const infoDiv = document.createElement("div");
      infoDiv.className = "site-info";
      
      const img = document.createElement("img");
      img.className = "favicon";
      img.src = getFaviconUrl(site);
      img.onerror = () => { img.src = "https://google.com"; };

      const span = document.createElement("span");
      span.textContent = site;

      infoDiv.appendChild(img);
      infoDiv.appendChild(span);
      li.appendChild(infoDiv);

      // Проверяем: если сайт дефолтный — запрещаем удаление
      if (defaultSites.includes(site)) {
        const lockSpan = document.createElement("span");
        lockSpan.className = "lock-icon";
        lockSpan.textContent = "🔒";
        lockSpan.title = "Этот сайт нельзя удалить из списка";
        li.appendChild(lockSpan);
      } else {
        // Для кастомных сайтов создаем кнопку удаления
        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "Удалить";
        delBtn.onclick = () => deleteSite(site);
        li.appendChild(delBtn);
      }

      listElement.appendChild(li);
    });
  });
}

// Добавление нового сайта
document.getElementById("addBtn").onclick = () => {
  const input = document.getElementById("siteInput");
  let rawUrl = input.value.trim().toLowerCase();
  
  if (!rawUrl) return;

  // Очищаем введенный адрес от протоколов, чтобы остался только чистый домен
  try {
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    const urlObj = new URL(rawUrl);
    let domain = urlObj.hostname;
    if (domain.startsWith("www.")) {
      domain = domain.substring(4);
    }

    chrome.storage.local.get(["blockedSites"], (result) => {
      const blockedSites = result.blockedSites || defaultSites;
      if (!blockedSites.includes(domain)) {
        blockedSites.push(domain);
        chrome.storage.local.set({ blockedSites: blockedSites }, () => {
          input.value = "";
          renderSites();
        });
      } else {
        alert("Этот сайт уже есть в списке!");
      }
    });
  } catch (e) {
    alert("Пожалуйста, введите корректный адрес сайта.");
  }
};

// Удаление сайта
function deleteSite(siteToDelete) {
  if (defaultSites.includes(siteToDelete)) return; // Дополнительная защита

  chrome.storage.local.get(["blockedSites"], (result) => {
    let blockedSites = result.blockedSites || defaultSites;
    blockedSites = blockedSites.filter(site => site !== siteToDelete);
    chrome.storage.local.set({ blockedSites: blockedSites }, renderSites);
  });
}

// Инициализация при открытии попапа
document.addEventListener("DOMContentLoaded", renderSites);
