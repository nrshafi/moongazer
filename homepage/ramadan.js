// Ramadan hub: the print button is shown only when JavaScript can run it. The page works fully without JS.
const button = document.querySelector('[data-print]');
if (button) {
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
