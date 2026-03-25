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
   MENÚ RESPONSIVE MEJORADO
================================ */

const menuBtn = document.querySelector(".menu-icon");
const menu = document.querySelector(".navigation ul");

if (menuBtn && menu) {

  // Función para alternar menú
  function toggleMenu() {
    menu.classList.toggle("show");
    // Bloquea el scroll cuando el menú está abierto
    document.body.classList.toggle("menu-open");
  }

  // Eventos de clic y táctil para abrir/cerrar
  menuBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  menuBtn.addEventListener("touchstart", function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  // Cerrar menú al hacer clic en cualquier enlace
  const menuLinks = menu.querySelectorAll("a");
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("show");
      document.body.classList.remove("menu-open");
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", function(e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("show");
      document.body.classList.remove("menu-open");
    }
  });
}
