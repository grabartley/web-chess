/* create the main game object */
const webChess = new WebChess();

/* register event listeners */
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
function onDOMContentLoaded() {
  webChess.updateBoard();
  for (let i = 1; i < 9; i++) {
    addClickEvent(`a${i}`);
    addClickEvent(`b${i}`);
    addClickEvent(`c${i}`);
    addClickEvent(`d${i}`);
    addClickEvent(`e${i}`);
    addClickEvent(`f${i}`);
    addClickEvent(`g${i}`);
    addClickEvent(`h${i}`);
  }
}
function addClickEvent(id) {
  document.getElementById(id).addEventListener('click', webChess.handleSpaceClicked.bind(webChess));
}

/* invoke the entrypoint */
webChess.play();
