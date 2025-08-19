"use client";
import { useContext, useState } from "react";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";
import Modal_Share from "../1generales/modals/modal-share";

export default function OnePasantias({ pasantia, favorito, setFavorito, one_item_ref, setShowPasantia }) {
    const urlBack = urlBackGlobal;
    const { csrf, setAlertData, setReportData } = useContext(Context);
    const [showShareModal, setShowShareModal] = useState(false);

    const fun_set_Favorito = async () => {
        const response = await fetch(urlBack + "/api/usuarios-c/setFavorito", {
            method: "POST",
            body: JSON.stringify({
                id_recurso: pasantia.id_pasantia,
                tipo_recurso: "pasantia"
            }),
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-Token": csrf
            },
            credentials: "include"
        });
        const data = await response.json();
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
                setAlertData({
                    show: "flex", message: data2.message, type: "danger"
                })
                setFavorito(false);
            }
        }
        if (data.statusCode === 200) {
            setAlertData({
                show: "flex", message: data.message, type: "success"
            })
            setFavorito(true);
        }
    }
    return (
        <>
        <section className="containerOne" ref={one_item_ref}>
            <section className="container_head">
                <div className="header">
                    <h1>{pasantia.titulo}</h1>
                    <button className="btn_close d-lg-none"
                        onClick={() => {
                            one_item_ref.current.classList.remove('show');
                            setShowPasantia({})}}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="actions">
                    <button className="action-btn" data-tooltip="Contactar por WhatsApp" onClick={() => window.open(`https://wa.me/${pasantia.num_telf}`, '_blank')}>
                        <i className="bi bi-whatsapp"></i>
                    </button>
                    <button className={`action-btn ${favorito ? 'mark' : ''}`} data-tooltip={favorito ? "Quitar de favoritos" : "Agregar a favoritos"} onClick={fun_set_Favorito}>
                        <i className={`bi bi-bookmark-heart${favorito ? ' set-fav' : ' del-fav'}`}></i>
                    </button>
                    <button className="action-btn" data-tooltip="Compartir" onClick={() => setShowShareModal(true)}>
                        <i className="bi bi-share-fill"></i>
                    </button>
                    <button className="action-btn" data-tooltip="Reportar" onClick={() => setReportData({
                        id: pasantia.id_pasantia,
                        type: 'pasantia',
                        message: null,
                        show: true
                    })}>
                        <i className="bi bi-flag"></i>
                    </button>
                </div>
            </section>
            <section className="body_one">
                <div className="section">
                    <h3 className="section-title">Descripción</h3>
                    <p className="info">{pasantia.descripcion}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Requisitos</h3>
                    <p className="info">{pasantia.requisitos}</p>
                </div>
                <div className="section">
                    <span className="badge">{pasantia.duracion ? `Duracion: ${pasantia.duracion}` : 'Salario no definido'}</span>
                    <span className="badge">{pasantia.modalidad}</span>
                </div>
                <div className="section">
                    <span className="badge">{`Fecha de Inicio: ${new Date(pasantia.fecha_inicio).toLocaleDateString()}`}</span>
                    <span className="badge">{`Fecha fin: ${new Date(pasantia.fecha_fin).toLocaleDateString()}`}</span>
                </div>
                <div className="section">
                    <h3 className="section-title">Ciudad</h3>
                    <p className="info">{pasantia.ciudad}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Ubicación</h3>
                    <p className="info">{pasantia.ubicacion ? pasantia.ubicacion : "No Definido"}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Número de Teléfono</h3>
                    <p className="info">{pasantia.num_telf}</p>
                </div>
            </section>
        </section>
        <Modal_Share showShareModal={showShareModal} setShowShareModal={setShowShareModal} tipo={"pasantia"} data={pasantia} />
        </>
    );
}