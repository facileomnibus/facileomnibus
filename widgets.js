document.addEventListener("DOMContentLoaded",()=>{

/* ===============================
   BARRA DE WIDGETS SUPERIOR
================================ */
const bar=document.createElement("div")
bar.className="widgets-bar"
document.body.prepend(bar)

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
   MENÚ RESPONSIVE FUNCIONAL
================================ */
const menuBtn=document.querySelector(".menu-icon")
const menu=document.querySelector(".navigation ul")
if(menuBtn && menu){
    menuBtn.addEventListener("click",()=>{
        menu.classList.toggle("show")
    })
}
