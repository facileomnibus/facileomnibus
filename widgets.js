document.addEventListener("DOMContentLoaded",()=>{

/* ===============================
   BARRA DE WIDGETS SUPERIOR
================================ */

const bar=document.createElement("div")
bar.className="widgets-bar"

const container = document.getElementById("widgets-container")

if(container){
    container.appendChild(bar)
}

/* ===============================
     FECHA
  ================================= */

  const dateWidget = document.createElement("div")
  dateWidget.className="widget-box"

  function updateDate(){
    const now = new Date()
    // Formato: Día de la semana, dd/mm/yyyy
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' }
    dateWidget.innerHTML = "📅 " + now.toLocaleDateString('es-ES', options)
  }

  updateDate()
  // Actualiza la fecha a medianoche para que cambie correctamente (opcional)
  setInterval(updateDate, 60 * 1000) // cada minuto

  bar.appendChild(dateWidget)

/* ===============================
   RELOJ
================================ */

const clock=document.createElement("div")
clock.className="widget-box"

function updateClock(){
 const now=new Date()
 clock.innerHTML="🕒 "+now.toLocaleTimeString()
}

setInterval(updateClock,1000)
updateClock()

bar.appendChild(clock)

/* ===============================
   BUSCADOR GOOGLE
================================ */

const search=document.createElement("div")
search.className="widget-box"

search.innerHTML=`
<form action="https://www.google.com/search" target="_blank">
<input name="q" placeholder="Buscar en Internet..."
style="
padding:8px;
border-radius:10px;
border:none;
outline:none;
width:260px;
max-width:90vw;
font-size:14px;
">
</form>
`

bar.appendChild(search)

/* ===============================
   MENÚ RESPONSIVE
================================ */
const menuBtn = document.getElementById("mobileMenuToggle") || document.querySelector(".menu-icon");
const menu = document.getElementById("site-menu") || document.querySelector(".navigation ul");

if (menuBtn && menu) {
  let isOpen = false;

  const openMenu = () => {
    menu.classList.add("show");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Cerrar menú");
    isOpen = true;
  };

  const closeMenu = () => {
    menu.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    isOpen = false;
  };

  const toggleMenu = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  menuBtn.addEventListener("click", toggleMenu);

  menuBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleMenu(event);
    }
  });

  document.addEventListener("click", (event) => {
    if (!isOpen) return;

    const clickedInsideMenu = menu.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
    }
  });

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && isOpen) {
      closeMenu();
    }
  });
}
