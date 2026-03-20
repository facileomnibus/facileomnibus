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

// =============================== BUSCADOR GOOGLE ================================
const search = document.createElement("div");
search.className = "widget-box";

search.innerHTML = `
  <form id="top-search" action="https://www.google.com/search" method="GET" target="_blank" aria-label="Buscar en Internet">
    <input
      type="search"
      name="q"
      placeholder="Buscar en Internet…"
      aria-label="Buscar en Internet"
      autocomplete="off"
      class="widgets-input"
    />
    <button type="submit" class="widgets-btn" aria-label="Buscar">🔎</button>
  </form>
`;

bar.appendChild(search);

// Accesibilidad: permitir Enter desde el input aunque el foco no esté en el botón
const topSearchForm = search.querySelector('#top-search');
topSearchForm.addEventListener('submit', (e) => {
  const q = topSearchForm.querySelector('input[name="q"]').value.trim();
  if (!q) {
    e.preventDefault(); // evita abrir una pestaña vacía
  }
});
``

/* ===============================
   MENÚ RESPONSIVE
================================ */

const menuBtn=document.querySelector(".menu-icon")
const menu=document.querySelector(".navigation ul")

if(menuBtn && menu){

menuBtn.addEventListener("click",()=>{
menu.classList.toggle("show")
})

menuBtn.addEventListener("touchstart",()=>{
menu.classList.toggle("show")
})

/* ===== FIX CLICK PC (evitar doble evento) ===== */

menuBtn.addEventListener("click", function(e){
    e.stopPropagation();
    e.preventDefault();
    menu.classList.toggle("show");
}, true);

menuBtn.addEventListener("touchstart", function(e){
    e.stopPropagation();
    e.preventDefault();
}, true);   
}

})
