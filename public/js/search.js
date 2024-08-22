const searchInput = document.getElementById("search-input");
function handleSearch() {
  searchForm.addEventListener("submit", (event) => {
    if (searchInput.value.trim() === "") {
      event.preventDefault(); // Prevent form submission
      //   alert("Please enter a search term.");
    }
  });
}
