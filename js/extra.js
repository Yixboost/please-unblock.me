function decode(str) {
  if (!str) return str;
  return str
    .toString()
    .split("")
    .map((char, ind) =>
      ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
    )
    .join("");
}

function inject(type) {
  if (type == "eruda") {
    activeTab.iframe.eval(
      `fetch("https://cdn.jsdelivr.net/npm/eruda").then(res => res.text()).then((data) => { eval(data); if (!window.erudaLoaded) { eruda.init({ defaults: { displaySize: 45, theme: "AMOLED" } }); window.erudaLoaded = true; } });`
    );
  }
}

openTab("frame");