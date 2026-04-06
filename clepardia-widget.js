(function(){

const root = document.getElementById("clepardia-widget");

root.innerHTML = `
<style>
.cw{font-family:Roboto,sans-serif;max-width:1100px;margin:auto}
.cw-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.cw-lang button{margin-left:5px;border:none;padding:6px 10px;border-radius:6px;background:#eee;cursor:pointer}
.cw-box{background:#fff;border-radius:14px;padding:20px;box-shadow:0 10px 25px rgba(0,0,0,0.08)}
.cw-row{display:flex;gap:20px}
.cw-left{flex:2}
.cw-right{flex:1;background:#f8f8f8;padding:15px;border-radius:10px}
.cw-services{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.cw-item{border:1px solid #ddd;padding:10px;border-radius:10px;display:flex;justify-content:space-between;align-items:center}
.cw-btn{background:#3CB371;color:#fff;border:none;padding:12px;border-radius:10px;width:100%;margin-top:10px;cursor:pointer}
.cw-count{display:flex;gap:5px;align-items:center}
.cw-count button{border:none;background:#3CB371;color:#fff;border-radius:50%;width:28px;height:28px}
.cw-total{font-size:22px;font-weight:bold;margin-bottom:10px}
.fade{animation:fade .3s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.toast{position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:10px 15px;border-radius:8px;opacity:0}
.toast.show{opacity:1}
</style>

<div class="cw">
  <div class="cw-top">
    <h2 id="title">Rezerwacja</h2>
    <div class="cw-lang">
      <button onclick="setLang('pl')">PL</button>
      <button onclick="setLang('en')">EN</button>
      <button onclick="setLang('de')">DE</button>
      <button onclick="setLang('it')">IT</button>
    </div>
  </div>

  <div class="cw-box cw-row">
    
    <div class="cw-left">
      
      <div class="cw-total">Łączny koszt: <span id="total">0</span> PLN</div>

      <div>
        Liczba nocy:
        <div class="cw-count">
          <button onclick="nights(-1)">-</button>
          <span id="nights">1</span>
          <button onclick="nights(1)">+</button>
        </div>
      </div>

      <h3>Usługi</h3>
      <div class="cw-services" id="services"></div>

    </div>

    <div class="cw-right">
      <h3>Podgląd</h3>
      <div id="preview"></div>

      <button class="cw-btn" onclick="copy()">Kopiuj</button>
      <button class="cw-btn" onclick="mail()">Wyślij maila</button>
    </div>

  </div>

</div>

<div class="toast" id="toast">Skopiowano</div>
`;

const translations = {
  pl:{title:"Rezerwacja",copy:"Skopiowano"},
  en:{title:"Booking",copy:"Copied"},
  de:{title:"Reservierung",copy:"Kopiert"},
  it:{title:"Prenotazione",copy:"Copiato"}
};

let lang="pl";

window.setLang=function(l){
  lang=l;
  document.getElementById("title").innerText=translations[l].title;
  document.querySelector(".cw").classList.add("fade");
  setTimeout(()=>document.querySelector(".cw").classList.remove("fade"),300);
}

const prices={
  adult:35,
  child:20,
  camper:80,
  trailer:60,
  electricity:30
};

let state={
  nights:1,
  items:{
    adult:0,
    child:0,
    camper:0,
    trailer:0,
    electricity:0
  }
};

function render(){
  const el=document.getElementById("services");
  el.innerHTML="";
  
  Object.keys(prices).forEach(k=>{
    const div=document.createElement("div");
    div.className="cw-item";
    div.innerHTML=`
      <span>${k} (${prices[k]} PLN)</span>
      <div class="cw-count">
        <button onclick="change('${k}',-1)">-</button>
        <span id="${k}">0</span>
        <button onclick="change('${k}',1)">+</button>
      </div>
    `;
    el.appendChild(div);
  });
}

window.change=function(k,v){
  state.items[k]=Math.max(0,state.items[k]+v);
  document.getElementById(k).innerText=state.items[k];
  calc();
}

window.nights=function(v){
  state.nights=Math.max(1,state.nights+v);
  document.getElementById("nights").innerText=state.nights;
  calc();
}

function calc(){
  let sum=0;
  Object.keys(state.items).forEach(k=>{
    sum+=state.items[k]*prices[k];
  });
  sum*=state.nights;
  animate(sum);
  updatePreview();
}

function animate(target){
  let el=document.getElementById("total");
  let start=parseInt(el.innerText)||0;
  let step=(target-start)/10;
  let i=setInterval(()=>{
    start+=step;
    if(Math.abs(target-start)<1){
      start=target;
      clearInterval(i);
    }
    el.innerText=Math.round(start);
  },20);
}

function updatePreview(){
  let txt="Zapytanie:\n";
  Object.keys(state.items).forEach(k=>{
    if(state.items[k]>0){
      txt+=k+": "+state.items[k]+"\n";
    }
  });
  txt+="Noce: "+state.nights;
  document.getElementById("preview").innerText=txt;
}

window.copy=function(){
  navigator.clipboard.writeText(document.getElementById("preview").innerText);
  let t=document.getElementById("toast");
  t.innerText=translations[lang].copy;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1500);
}

window.mail=function(){
  let body=document.getElementById("preview").innerText;
  window.location.href="mailto:clepardia@gmail.com?subject=Rezerwacja&body="+encodeURIComponent(body);
}

render();
calc();

})();
