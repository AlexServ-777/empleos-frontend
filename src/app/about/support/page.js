"use client"
import React from 'react';
import Link from 'next/link';

export default function Support() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <h2 className="mb-0">Soporte Técnico</h2>
                        </div>
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-headset display-1 text-primary"></i>
                            </div>

                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-envelope fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">Email de Soporte</h5>
                                            <a href="mailto:jobget.soporte.contact@gmail.com" className="text-decoration-none">
                                                jobget.soporte.contact@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-telephone fs-3 me-3 text-primary"></i>
                                        <div>
                                            <h5 className="mb-1">Teléfono de Soporte</h5>
                                            <a href="tel:+59178763589" className="text-decoration-none">
                                                +591 78763589
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form action='https://formsubmit.co/jobget.soporte.contact@gmail.com' method='POST'>
                            <input type='hidden' name='_captcha' value='false'/>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            required
                                            maxLength='100'
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            required
                                            maxLength='100'
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Asunto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="asunto"
                                            required
                                            maxLength='200'
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Mensaje</label>
                                        <textarea
                                            className="form-control"
                                            name="mensaje"
                                            rows="5"
                                            required
                                            maxLength='1000'
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-primary me-2 mb-3">
                                        <i className="bi bi-send me-2"></i>
                                        Enviar Mensaje
                                    </button>
                                    <Link href="/about/contactDev" className="btn btn-outline-primary mb-3">
                                        <i className="bi bi-code-square me-2"></i>
                                        Contactar Desarrolladores
                                    </Link>
                                </div>
                            </form>

                            <div className="mt-5">
                                <h4 className="text-center mb-4">Horario de Atención</h4>
                                <div className="row text-center">
                                    <div className="col-md-6">
                                        <p className="mb-1"><strong>Lunes a Viernes:</strong></p>
                                        <p className="text-muted">9:00 AM - 6:00 PM</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-1"><strong>Sábados:</strong></p>
                                        <p className="text-muted">10:00 AM - 2:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
