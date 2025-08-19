"use client"
import { useState, useContext } from "react";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import Modal_Share from "../1generales/modals/modal-share";

export default function OneEmpleo({ empleo, favorito, setFavorito, one_item_ref, setShowEmpleo }) {
    const urlBack = urlBackGlobal;
    const { csrf, setAlertData, setReportData } = useContext(Context);
    const [showShareModal, setShowShareModal] = useState(false);
    const fun_set_fav = async () => { //agregar o eliminar de favoritos
        const response = await fetch(urlBack + "/api/usuarios-c/setFavorito", {
            method: "POST",
            body: JSON.stringify({
                id_recurso: empleo.id_empleo,
                tipo_recurso: "empleo"
            }),
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-Token": csrf
            },
            credentials: "include"
        });
        const data = await response.json();
        if (response.status === 401) {
            setAlertData({
                message: "DEBES INICIAR SESION",
                type: "warning",
                show: "flex"
            })
        }
        if (data.statusCode === 400) {
            const res2 = await fetch(urlBack + "/api/usuarios-c/deleteFavorito/" + data.id_favorito, {
                method: "DELETE",
                headers: {
                    "X-XSRF-Token": csrf
                },
                credentials: "include"
            });
            const data2 = await res2.json();
            if (res2.ok) {
                setFavorito(false);
                setAlertData({ show: "flex", message: data2.message, type: "danger" })
            }
        }
        if (data.statusCode === 200) {
            setFavorito(true);
            setAlertData({ show: "flex", message: data.message, type: "success" })
        }
    }
    return (
        <>
        <section className="containerOne" ref={one_item_ref}>
            <section className="container_head">
                <div className="header">
                    <h1>{empleo.titulo}</h1>
                    <button className="d-lg-none btn_close"
                        onClick={() => {
                            one_item_ref.current.classList.remove('show');
                            setShowEmpleo({});
                        }}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="actions">
                    <button className="action-btn" data-tooltip="Contactar por WhatsApp" onClick={() => window.open(`https://wa.me/${empleo.num_telf}`, '_blank')}>
                        <i className="bi bi-whatsapp"></i>
                    </button>
                    <button className={`action-btn ${favorito ? 'mark' : ''}`} data-tooltip={favorito ? "Quitar de favoritos" : "Agregar a favoritos"} onClick={fun_set_fav}>
                        <i className={`bi bi-bookmark-heart${favorito ? ' set-fav' : ' del-fav'}`}></i>
                    </button>
                    <button className="action-btn" data-tooltip="Compartir" onClick={() => setShowShareModal(true)}>
                        <i className="bi bi-share-fill"></i>
                    </button>
                    <button className="action-btn" data-tooltip="Reportar" onClick={
                        () => setReportData({
                            id: empleo.id_empleo,
                            type: 'empleo',
                            message: null,
                            show: true,
                        })}>
                        <i className="bi bi-flag"></i>
                    </button>
                </div>
            </section>

            <section className="body_one">
                <div className="section">
                    <h3 className="section-title">Descripción</h3>
                    <p className="info">{empleo.descripcion}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Requisitos</h3>
                    <p className="info">{empleo.requisitos}</p>
                </div>
                <div className="section">
                    <span className="badge">{empleo.salario ? `Salario: ${empleo.salario}` : 'Salario no definido'}</span>
                    <span className="badge">{empleo.modalidad}</span>
                </div>
                <div className="section">
                    <h3 className="section-title">Ciudad</h3>
                    <p className="info">{empleo.ciudad}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Ubicación</h3>
                    <p className="info">{empleo.ubicacion ? empleo.ubicacion : "No Definido"}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Número de Teléfono</h3>
                    <p className="info">{empleo.num_telf}</p>
                </div>
            </section>
        </section>
        
        <Modal_Share showShareModal={showShareModal} setShowShareModal={setShowShareModal} tipo={"empleo"} data={empleo} />
        </>
    );
}