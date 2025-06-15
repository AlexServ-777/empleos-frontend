// lib/fetchInterceptor.ts

import Swal from "sweetalert2";

const originalFetch = fetch; //almcaenar el fetch original en originalFetch

globalThis.fetch = async (...args) => { //args es para heredar los argumentos o attributos del fetch original
  const response = await originalFetch(...args); //esperamos la respuesta del fetch Original
  try{
    if (response.status === 403) { //si es response 403
      const text = await response.clone().text(); //clonar el texto que recibio el fetch sin afectar a fetch original
      if (text.includes('Token CSRF inválido o faltante')) { //si tiene x mensaje que esta en el backend
        console.warn('⚠️ CSRF Token inválido detectado');
        window.location.reload(); //recargar la pagina. Como en app esta el get CSRF entonces se obtendra un nuevo token csrf
      }
    }
    if(response.status===429){
      Swal.fire({
          title:'DEMASIADOS INTENTOS',
          text:'Vuelve a intentarlo mas tarde',
          icon:'warning'
      })}
    return response;
  }catch{
    return {
      ok:false,
      status:500,
      json:async()=>([]),
    }
  }
   //retonrar la respuesta al fetch original
};
