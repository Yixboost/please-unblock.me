const menuContext = document.querySelector(".menu-context");
const menuButton = document.getElementById("menuButton");

menuButton.addEventListener("click", function (event) {
  event.stopPropagation();
  const rect = menuButton.getBoundingClientRect();
  menuContext.style.top = `calc(${rect.bottom}px + 2px)`;
  menuContext.style.right = "0px";
  menuContext.style.display =
    menuContext.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function (event) {
  if (
    menuContext.style.display === "block" &&
    !menuContext.contains(event.target) &&
    event.target !== menuButton
  ) {
    menuContext.style.display = "none";
  }
});
