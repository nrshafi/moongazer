// Directory feedback pages (P4). External file because the directory CSP allows no inline script.
// 1. At submit, record how long the page has been open (performance.now(), not the device clock)
//    for the server's minimum time-to-submit check.
document.addEventListener('submit', event => {
  const input = event.target.querySelector('[data-feedback-time]');
  if (input) input.value = String(Math.round(performance.now()));
});
// 2. On the thanks page, send people back to the app they came from (known slugs only).
const back = document.querySelector('[data-feedback-back]');
if (back) {
  const from = new URLSearchParams(location.search).get('from') || '';
  const known = (back.getAttribute('data-apps') || '').split(' ');
  if (/^[a-z0-9-]{1,60}$/.test(from) && known.includes(from)) {
    back.setAttribute('href', `https://${from}.moongazer.tech/`);
    back.textContent = 'Go back to the app';
  }
}
