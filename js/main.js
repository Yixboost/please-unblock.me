var tabs = [];
var activeTab = null;

function openTab(url) {
  var iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.display = "none";
  iframe.onload = function () {
    updateTabTitle(tabs[tabs.length - 1]);
    fetchFavicon(url).then(function (iconUrl) {
      updateUrlInput(activeTab);
      if (iconUrl) {
        activeTab.tab.querySelector(".tab-icon").src = iconUrl;
        updateUrlInput(activeTab);
      } else {
        activeTab.tab.querySelector(".tab-icon").src =
          "https://www.google.com/s2/favicons?sz=64&domain=e";
        updateUrlInput(activeTab);
      }
    });
  };
  document.querySelector(".browser-window").appendChild(iframe);

  var tab = document.createElement("div");
  tab.classList.add("tab");
  var tabIcon = document.createElement("img");
  tabIcon.classList.add("tab-icon");
  tabIcon.src = "https://www.google.com/s2/favicons?sz=64&domain=e";
  var tabTitle = document.createElement("span");
  tabTitle.classList.add("tab-title");
  tabTitle.textContent = "Blank Page";
  var tabClose = document.createElement("span");
  tabClose.classList.add("tab-close");
  tabClose.textContent = "×";
  tab.appendChild(tabIcon);
  tab.appendChild(tabTitle);
  tab.appendChild(tabClose);
  tab.addEventListener("click", function (event) {
    if (event.target.classList.contains("tab-close")) {
      closeTab(tab);
    } else {
      switchTab(tab);
    }
  });
  document.querySelector(".tab-bar").appendChild(tab);

  tabs.push({
    tab: tab,
    iframe: iframe,
  });
  switchTab(tab);
}

function closeTab(tab) {
  var index = tabs.findIndex((t) => t.tab === tab);
  if (index !== -1) {
    var tabObj = tabs[index];

    tab.classList.add("closing");
    tab.style.animation = "closeTab 0.1s ease forwards";

    tab.addEventListener("animationend", function () {
      tabObj.iframe.parentNode.removeChild(tabObj.iframe);
      tab.parentNode.removeChild(tab);
      tabs.splice(index, 1);
      if (tab.classList.contains("active")) {
        if (tabs.length > 0) {
          switchTab(tabs[Math.max(index - 1, 0)].tab);
        } else {
          activeTab = null;
          updateUrlInput();
        }
      }
      tab.classList.remove("closing");
    });
  }
}

function switchTab(tab) {
  if (activeTab) {
    activeTab.tab.classList.remove("active");
    activeTab.iframe.style.display = "none";
  }

  activeTab = tabs.find((t) => t.tab === tab);
  activeTab.tab.classList.add("active");
  activeTab.iframe.style.display = "block";
  updateUrlInput(activeTab);
  activeTab.iframe.onload = function () {
    updateTabTitle(activeTab);
    updateUrlInput(activeTab);
    fetchFavicon(activeTab.iframe.src).then(function (iconUrl) {
      if (iconUrl) {
        activeTab.tab.querySelector(".tab-icon").src = iconUrl;
        updateUrlInput(activeTab);
      } else {
        activeTab.tab.querySelector(".tab-icon").src =
          "https://www.google.com/s2/favicons?sz=64&domain=e";
      }
    });
  };
}

function updateTabTitle(tabObj) {
  var tabTitle = tabObj.iframe.contentWindow.document.title;
  tabObj.tab.querySelector(".tab-title").textContent = tabTitle;
}

function updateUrlInput(tabObj) {
  var urlInput = document.querySelector(".url-input");
  if (tabs.length === 0) {
    urlInput.value = "";
    urlInput.setAttribute("readonly", true);
  } else if (tabObj) {
    let url = tabObj.iframe.src.split("/@/")[1];
    const decodedPath = decode(decodeURIComponent(url)).replace(
      /^https?:\/\//,
      ""
    );

    urlInput.value = decodedPath !== "uldgfkngd" ? decodedPath : "";
    urlInput.removeAttribute("readonly");
  }
}

function fetchFavicon(url) {
  return new Promise(function (resolve) {
    var faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + url;
    var img = new Image();
    img.onload = function () {
      resolve(faviconUrl);
    };
    img.onerror = function () {
      resolve(null);
    };
    img.src = faviconUrl;
  });
}

document.querySelector(".url-input").addEventListener("focus", function () {
  if (this.value && this.value.indexOf(".") !== -1) {
    this.value = "https://" + this.value;
  }
});

document.querySelector(".url-input").addEventListener("blur", function () {
  this.value = this.value.replace(/^https?:\/\//, "");
});

document
  .querySelector(".url-input")
  .addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var url = this.value;
      var isAUrl = url.includes(".");

      if (isAUrl) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "http://" + url; 
        }
        
        activeTab.iframe.src = "frame/?url=" + encodeURIComponent(url);
      } else {
        var searchUrl = "frame/?url=" + encodeURIComponent(url);
        activeTab.iframe.src = searchUrl;
      }

      fetchFavicon(url).then(function (iconUrl) {
        if (iconUrl) {
          activeTab.tab.querySelector(".tab-icon").src = iconUrl;
        } else {
          activeTab.tab.querySelector(".tab-icon").src =
            "https://www.google.com/s2/favicons?sz=64&domain=e";
        }
      });
    }
  });

document
  .querySelector(".new-tab-button")
  .addEventListener("click", function () {
    openTab("frame");
    updateUrlInput({
      iframe: {
        src: "",
      },
    });
  });

document.getElementById("backButton").addEventListener("click", function () {
  if (activeTab && activeTab.iframe.contentWindow.history.length > 1) {
    activeTab.iframe.contentWindow.history.back();
  }
});

document.getElementById("forwardButton").addEventListener("click", function () {
  if (activeTab && activeTab.iframe.contentWindow.history.length > 1) {
    activeTab.iframe.contentWindow.history.forward();
  }
});

document.getElementById("reloadButton").addEventListener("click", function () {
  if (activeTab) {
    activeTab.iframe.contentWindow.location.reload();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('q')) {
    const searchTerm = urlParams.get('q');
    document.querySelector(".url-input").value = searchTerm;
    activeTab.iframe.src = "https://naslambers.synology.me/Yixboost-Games/proxy/frame/?url=" + encodeURIComponent(searchTerm);
  }
});
