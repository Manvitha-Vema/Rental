let taxSwitch = document.querySelector("#flexSwitchCheckDefault");

taxSwitch.addEventListener("click", () => {
  let taxToggle = document.querySelectorAll(".tax-toggle");
  for (tax of taxToggle) {
    if (tax.style.display != "inline") {
      tax.style.display = "inline";
    } else {
      tax.style.display = "none";
    }
  }
});

function selectCategory(category) {
  window.location.href = `/listings?category=${category}`;
}
