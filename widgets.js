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
   BOTÓN SCROLL ARRIBA
================================ */

const topBtn=document.createElement("div")

topBtn.innerHTML="⬆"

topBtn.style=`
position:fixed;
bottom:110px;
right:30px;
background:#4ac8ff;
color:white;
padding:10px 15px;
border-radius:50%;
cursor:pointer;
font-size:20px;
box-shadow:0 5px 15px rgba(0,0,0,0.3);
z-index:9999;
transition:0.2s;
`

topBtn.onmouseover=()=>{
topBtn.style.transform="scale(1.1)"
}

topBtn.onmouseout=()=>{
topBtn.style.transform="scale(1)"
}

topBtn.onclick=()=>{
 window.scrollTo({
  top:0,
  behavior:"smooth"
 })
}

document.body.appendChild(topBtn)

/* ===============================
   MENÚ RESPONSIVE
================================ */

function initMobileMenu(){

const menuBtn=document.querySelector(".menu-icon")
const menu=document.querySelector(".navigation ul")

if(!menuBtn || !menu) return

menuBtn.addEventListener("click",(e)=>{

e.stopPropagation()

menu.classList.toggle("show")

})

document.addEventListener("click",(e)=>{

if(!menu.contains(e.target) && !menuBtn.contains(e.target)){
menu.classList.remove("show")
}

})

}

initMobileMenu()

})
