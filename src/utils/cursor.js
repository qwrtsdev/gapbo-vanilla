const zone = document.getElementById("cursor_zone");
const cursor = document.getElementById("fake-cursor");

zone.addEventListener("mouseenter", () => {
  cursor.classList.remove("scale-0");
  cursor.classList.add("scale-100");
});

zone.addEventListener("mouseleave", () => {
  cursor.classList.remove("scale-100");
  cursor.classList.add("scale-0");
});

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
