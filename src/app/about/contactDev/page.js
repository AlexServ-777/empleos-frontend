"use client"
import Link from 'next/link';

export default function ContactDev() {

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <h2 className="mb-0">Contacto con Desarrolladores</h2>
                        </div>
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-code-square display-1 text-primary"></i>
                            </div>
                            
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-github fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">GitHub</h5>
                                            <a href="https://github.com/AlexServ-777" target='_blank' className="text-decoration-none">
                                                github.com/AlexServ-777
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-linkedin fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">LinkedIn</h5>
                                            <a href="https://www.linkedin.com/in/alex-daniel-apaza-ramirez-512579347" target='_blank' className="text-decoration-none text-break">
                                                linkedin.com/in/alex-daniel-apaza-ramirez
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-envelope fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">Email</h5>
                                            <a href="mailto:dev@alexdaniel2005.yt@gmail.com" target='_blank' className="text-decoration-none">
                                                alexdaniel2005.yt@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-telephone fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">Teléfono</h5>
                                            <a href="tel:+59178763589" target='_blank' className="text-decoration-none">
                                                +591 78763589
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h4 className="text-center mb-4">¿Tienes un proyecto en mente?</h4>
                                <p className="text-center text-muted mb-4">
                                    Estamos siempre interesados en escuchar nuevas ideas y colaborar en proyectos innovadores.
                                    No dudes en contactarnos para discutir cómo podemos ayudarte a hacer realidad tu visión.
                                </p>
                                <div className="text-center">
                                    <Link href="/about/support" className="btn btn-outline-primary me-2 mb-3">
                                        <i className="bi bi-headset me-2"></i>
                                        Ir a Soporte
                                    </Link>
                                    <Link href="/" className="btn btn-primary mb-3">
                                        <i className="bi bi-house me-2"></i>
                                        Volver al Inicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
