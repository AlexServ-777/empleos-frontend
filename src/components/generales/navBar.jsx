"use client"
import Link from "next/link";
import { useContext,useState } from "react";
import React from "react";
import { Context } from "@/app/providers";

export default function NavBar() {
  const [isMenuOpen,setMenuOpen] = useState("");
  const {session} = useContext(Context);
  return (
    <div className="navBar">
      {/*NAVBAR PARA RESPONSIVE  MOVIL*/}
      <nav className={`menuInterno ${isMenuOpen?'open':''} navBar d-block d-md-none`} style={{ display: "block"}}>
        <ul className="text-center ulPadre" onClick={(e)=>{
          if(!e.target.closest('.noCerrar'))setMenuOpen(!isMenuOpen);}}>
          <li className="nav-item">
            <Link href='/empleos/all'>
              <i className="bi bi-briefcase"></i>
              EMPLEOS
            </Link>
          </li>
          <li className="nav-item">
            <Link href='/pasantias/all'>
              <i className="bi bi-mortarboard"></i>
              PASANTIAS
            </Link>
          </li>
          <li className="nav-item">
            <Link href='/servicios/all'>
              <i className="bi bi-gear"></i>
              SERVICIOS
            </Link>
          </li>
          <li className="nav-item dropdown noCerrar">
            <a className="dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots"></i>
              MAS
            </a>
            <ul className="dropdown-menu" onClick={(e)=>{
              setMenuOpen(!isMenuOpen);
            }}>
              <li>
                <Link className="dropdown-item" href="/empleos/new">
                  <i className="bi bi-plus-circle"></i>
                  PUBLICAR EMPLEO
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/pasantias/new">
                  <i className="bi bi-plus-circle"></i>
                  PUBLICAR PASANTIA
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/servicios/new">
                  <i className="bi bi-plus-circle"></i>
                  PUBLICAR SERVICIO
                </Link>
              </li>
              <li><hr className="dropdown-divider"/></li>
              <li>
                <Link className="dropdown-item" href="/about/support">
                  <i className="bi bi-headset"></i>
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/about/contactDev">
                  <i className="bi bi-code-square"></i>
                  Contactar Desarrolladores
                </Link>
              </li>
            </ul>
          </li>
          <br/>
          {!session? 
          <li>
            <Link href="/user/login" className="linkLogin">
              <i className="bi bi-box-arrow-in-right text-white"></i>
              INICIAR SESION
            </Link>
          </li>
          :
          <li>
            <Link href="/user/perfil" className="linkLogin">
              <i className="bi bi-person-circle text-white"></i>
              PERFIL
            </Link>
          </li>}
          <i className="bi bi-x-circle" onClick={()=>{setMenuOpen(!isMenuOpen)}}></i>
        </ul>
      </nav>
      
      <div className="container movil d-flex justify-content-center align-items-center d-md-none" style={{position:"fixed", zIndex:"998"}}>
          <img src="/logoJobGet.webp" style={{height:"4rem",borderRadius:"30px"}}/>
          <Link href="/" className="text-decoration-none m-auto text-warning homeLinkMovil">
            <h1 style={{fontFamily:"'Permanent Marker', cursive"}}>JobGet</h1>
          </Link>

          {/*menu para abrir el menu deslizante */}
          <menu className="menu" onClick={()=>{setMenuOpen(!isMenuOpen)}}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </menu>
      </div>

      {/* NAVBAR RESPONSIVO PARA PC */}
      <div className="pc d-none d-md-block" style={{position:"fixed", width:"100%", zIndex:9999}}>
        <nav className="navbar navPC mx-5 mt-3">
          <div className="col-3 container justify-content-start gap-4">
            <img src="/logoJobGet.webp" style={{width:"4rem", borderRadius:"30px", padding:"0px"}} className=""/>
            <h2 className="my-auto text-warning" style={{fontFamily:"'Permanent Marker', cursive"}}>
              <Link href="/" className="text-warning" style={{textDecoration:"none"}}>JobGet</Link>
            </h2>
          </div>
          <div className="container col-6" style={{zIndex:9999}}>
            <ul style={{display:"flex", gap:60}} className="my-auto mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/empleos/all">
                  <i className="bi bi-briefcase"></i>
                  EMPLEOS
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/pasantias/all">
                  <i className="bi bi-mortarboard"></i>
                  PASANTIAS
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/servicios/all">
                  <i className="bi bi-gear"></i>
                  SERVICIOS
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-three-dots"></i>
                  MAS
                </a>
                <ul className="dropdown-menu" style={{color:"white"}}>
                  <li>
                    <Link className="dropdown-item" href="/empleos/new">
                      <i className="bi bi-plus-circle"></i>
                      PUBLICAR EMPLEO
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/pasantias/new">
                      <i className="bi bi-plus-circle"></i>
                      PUBLICAR PASANTIA
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/servicios/new">
                      <i className="bi bi-plus-circle"></i>
                      PUBLICAR SERVICIO
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <Link className="dropdown-item" href="/about/support">
                      <i className="bi bi-headset"></i>
                      Soporte Técnico
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/about/contactDev">
                      <i className="bi bi-code-square"></i>
                      Contactar Desarrolladores
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="col-3 container justify-content-end">
            {!session ?
             <Link href="/user/login" className="btn btnLogin" style={{borderRadius:"20px", paddingLeft:"30px", paddingRight:"30px"}}>
               <i className="bi bi-box-arrow-in-right"></i>
               ACCEDER
             </Link>
            :
             <Link href="/user/perfil" className="btn btnLogin" style={{borderRadius:"20px", paddingLeft:"30px", paddingRight:"30px"}}>
               <i className="bi bi-person-circle"></i>
               PERFIL
             </Link>
            }
          </div>
        </nav>
      </div>
    </div>
  );
}