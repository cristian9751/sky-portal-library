// AdminLTE 4 drives the sidebar purely through classes on <body>:
//   >= lg: `sidebar-collapse` collapses it    < lg: `sidebar-open` shows it as an overlay
// Reproducing that here avoids depending on AdminLTE's JS, which can't see React-rendered nodes.
const LG: number = 992;

export function toggleSidebar() {
  const cls = window.innerWidth >= LG ? 'sidebar-collapse' : 'sidebar-open';
  document.body.classList.toggle(cls);
}

export function closeSidebar() {
  document.body.classList.remove('sidebar-open');
}
