"use client";
import { useEffect } from "react";
export  function BarPerfil({setSeccion}){
    const handler=(e)=>{
        const opcion = e.currentTarget.textContent;
        setSeccion(opcion);
    }
    return(
        <section className="containerBar d-md-flex d-none">
            <button className="btn text-white" onClick={(e)=>handler(e)}>INFORMACION</button>
            <button className="btn text-white" onClick={(e)=>handler(e)}>SEGURIDAD</button>
            <button className="btn text-white" onClick={(e)=>handler(e)}>PUBLICACIONES</button>
            <button className="btn text-white" onClick={(e)=>handler(e)}>FAVORITOS</button>
        </section>
    )
}

export function BarPefilMovil({setSeccion, show, setShow}){
    const handler=(e)=>{
        const opcion = e.currentTarget.textContent;
        setSeccion(opcion);
        setShow('none');
    }
    useEffect(()=>{
        if(show==='none'){
            document.getElementsByClassName('containerBar-movil')[0].classList.remove('show');
        }
        else{
            document.getElementsByClassName('containerBar-movil')[0].classList.add('show');
        }   
    },[show])
    return(
        <section className="containerBar-movil d-md-none d-flex">
            <button className="close btn" onClick={()=>setShow('none')}>
            <i className="bi bi-x-circle"></i></button>
            <button className="btn buttonList" onClick={(e)=>handler(e)}>
            <i className="bi bi-info-circle-fill"></i>
                INFORMACION</button>
            <button className="btn buttonList" onClick={(e)=>handler(e)}>
            <i className="bi bi-shield-lock-fill"></i>
                SEGURIDAD</button>
            <button className="btn buttonList" onClick={(e)=>handler(e)}>
            <i className="bi bi-archive-fill"></i>
                PUBLICACIONES</button>
            <button className="btn buttonList" onClick={(e)=>handler(e)}>
            <i className="bi bi-heart-fill"></i>
                FAVORITOS</button>
        </section>
    )
}