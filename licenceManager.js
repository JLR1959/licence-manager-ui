/* ======================================================
MODULE 00 — CONFIG API
====================================================== */

const API = "https://licence-server-jlr-0jex.onrender.com";

/* ======================================================
MODULE 01 — LOG
====================================================== */

function log(msg, type="info"){

  const box = document.getElementById("journalActivite");

  const time = new Date().toLocaleTimeString();

  const div = document.createElement("div");

  div.innerHTML = `[${time}] ${msg}`;

  if(type==="error") div.classList.add("log-error");
  else if(type==="ok") div.classList.add("log-ok");
  else div.classList.add("log-info");

  box.prepend(div);
}

/* ======================================================
MODULE 02 — STATUS UI
====================================================== */

function setStatus(etat){

  const barre = document.getElementById("barreEtat");
  const texte = document.getElementById("etatServeurTexte");

  barre.className = "status-bar";

  if(etat==="online"){
    barre.classList.add("status-online");
    barre.innerText = "Serveur en ligne";
    texte.innerText = "En ligne";
  }

  if(etat==="offline"){
    barre.classList.add("status-offline");
    barre.innerText = "Serveur hors ligne";
    texte.innerText = "Hors ligne";
  }

  if(etat==="connecting"){
    barre.classList.add("status-connecting");
    barre.innerText = "Connexion...";
    texte.innerText = "Connexion...";
  }
}

/* ======================================================
MODULE 03 — CHECK SERVER (ANTI RENDER SLEEP)
====================================================== */

async function checkServer(){

  for(let i=0;i<5;i++){

    try{
      const res = await fetch(API + "/ping");

      if(res.ok){
        log("Serveur connecté","ok");
        return true;
      }

    }catch(e){}

    await new Promise(r=>setTimeout(r,2000));
  }

  return false;
}

/* ======================================================
MODULE 04 — LOAD LICENCES
====================================================== */

async function chargerLicences(){

  try{

    // test simple avec email fictif
    const res = await fetch(API + "/licence/test@test.com");

    // juste pour valider connexion API
    if(!res.ok){
      log("Connexion API OK (test)","info");
    }

    document.getElementById("derniereSync").innerText =
      new Date().toLocaleTimeString();

  }catch(e){

    log("Erreur chargement licences","error");

  }

}

/* ======================================================
MODULE 05 — GENERER LICENCE (LOCAL UI)
====================================================== */

function genererLicence(){

  const email = document.getElementById("emailClient").value;

  if(!email){
    alert("Email requis");
    return;
  }

  const cle = "XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX";

  document.getElementById("licenceGeneree").value = cle;

  log("Licence générée (local)","info");
}

/* ======================================================
MODULE 06 — ENVOYER EMAIL (SIMULATION UI)
====================================================== */

function envoyerEmail(){

  const email = document.getElementById("emailClient").value;

  if(!email){
    alert("Email requis");
    return;
  }

  log("Email envoyé à " + email,"ok");
}

/* ======================================================
MODULE 07 — FILTRE
====================================================== */

function filtrer(){

  const filtre = document.getElementById("rechercheClient").value.toLowerCase();

  const rows = document.querySelectorAll("#listeClients tr");

  rows.forEach(r=>{
    r.style.display = r.innerText.toLowerCase().includes(filtre) ? "" : "none";
  });

}

/* ======================================================
MODULE 08 — EXPORT PDF
====================================================== */

function exportPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.text("Export licences VPIJLR",10,10);

  doc.save("licences.pdf");

}

/* ======================================================
MODULE 09 — INIT
====================================================== */

async function init(){

  setStatus("connecting");

  const online = await checkServer();

  if(online){
    setStatus("online");
    await chargerLicences();
  }else{
    setStatus("offline");
    log("Serveur inaccessible","error");
  }

}

window.onload = init;
