import { Context } from "@/app/providers";
import Link from "next/link";
import { useContext } from "react";
export default function Nav_Movil({ isMenuOpen, setMenuOpen }) {
    return (
        <nav className="nav container_movil">
            {/*MENU DEPLEGABLE*/}
            <Menu_interno isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />

            {/*Menu*/}
            <div className="movil d-flex justify-content-center align-items-center d-md-none">
                <img src="/logoJobGet.webp" style={{ height: "4rem", borderRadius: "30px" }} />
                <Link href="/" className="text-decoration-none m-auto text-warning homeLinkMovil">
                    <span className="fs-1">JobGet </span>
                    <span className="fs-5">Lat</span>
                </Link>

                {/*menu para abrir el menu deslizante */}
                <menu className="menu" onClick={() => { setMenuOpen(!isMenuOpen) }}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </menu>
            </div>
        </nav>
    )
}
function Menu_interno({ isMenuOpen, setMenuOpen }) {
    const { session } = useContext(Context);
    return (
        <>
            <div className={`menuInterno ${isMenuOpen ? 'open' : ''} navBar d-block d-md-none`} style={{ display: "block" }}>
                <ul className="text-center ulPadre" onClick={(e) => {
                    if (!e.target.closest('.noCerrar')) setMenuOpen(!isMenuOpen);
                }}>
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
                        <ul className="dropdown-menu" onClick={() => {
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
                            <li><hr className="dropdown-divider" /></li>
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
                    <br />
                    {!session ?
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
                    <button>
                        <i className="bi bi-x-circle" onClick={() => { setMenuOpen(!isMenuOpen) }}></i>
                    </button>
                </ul>
            </div>

        </>)
}