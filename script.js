document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("root");
  const testEl = document.createElement("p");

  testEl.textContent = "Foobar";
  container.appendChild(testEl);
});
