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
   MENÚ RESPONSIVE (FIX)
================================ */

const menuBtn = document.querySelector(".menu-icon");
const menu = document.querySelector(".navigation ul");

if (menuBtn && menu) {
    // Manejador para clic (escritorio y móvil con ratón)
    menuBtn.addEventListener("click", function(e) {
        e.preventDefault();         // Evita comportamientos extraños
        menu.classList.toggle("show");
    });

    // Manejador específico para toque en móvil (mejor respuesta)
    menuBtn.addEventListener("touchstart", function(e) {
        e.preventDefault();         // Evita zoom/scroll accidental
        menu.classList.toggle("show");
    });
}

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
