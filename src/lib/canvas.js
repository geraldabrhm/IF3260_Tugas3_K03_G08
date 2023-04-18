const canvas = document.getElementById("webgl-canvas");

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();

  const x = (event.clientX - rect.left) / (canvas.width / 2) - 1;
  const y = -1 * ((event.clientY - rect.top) / (canvas.height / 2) - 1);

  console.log(`x: ${x}, y: ${y}`);
  return vec2(x, y);
}