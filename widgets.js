document.addEventListener("DOMContentLoaded",()=>{

/* ===============================
   BARRA DE WIDGETS SUPERIOR
================================ */

const bar=document.createElement("div")
bar.className="widgets-bar"

document.body.prepend(bar)

/* ===============================
   FECHA
================================ */
  document.addEventListener("DOMContentLoaded", ()=>{
  const bar = document.querySelector(".widgets-bar");
  if(bar){
    const dateWidget = document.createElement("div");
    dateWidget.className = "widget-box";
    
    function updateDate(){
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateWidget.innerHTML = "📅 " + today.toLocaleDateString('es-ES', options);
    }
    
    updateDate();  // Inicial
    setInterval(updateDate, 60*1000); // Se actualiza cada minuto
    bar.appendChild(dateWidget);
  }
});

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
