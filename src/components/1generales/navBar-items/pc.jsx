import { Context } from "@/app/providers";
import Link from "next/link"
import { useContext } from "react";
export default function Nav_Pc(){
    const {session} = useContext(Context);
    return(
    <div className="nav">
        <nav className="navbar navPC d-none d-md-flex">
          <div className="col-3 container justify-content-start gap-4">
            <img src="/logoJobGet.webp" style={{width:"4rem", borderRadius:"30px", padding:"0px"}} className=""/>
            <h2 className="my-auto text-warning" style={{fontFamily:"'Permanent Marker', cursive"}}>
              <Link href="/" style={{textDecoration:"none"}}>
              <span className="fs-1">JobGet </span>
              <span className="fs-5">Lat</span>
              </Link>
            </h2>
          </div>
          <div className="container col-6" style={{zIndex:"50"}}>
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
    </div>)
}