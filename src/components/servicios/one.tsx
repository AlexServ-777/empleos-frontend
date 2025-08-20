"use client"
import { useState, useContext } from "react";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import Modal_Share from "../1generales/modals/modal-share";

export default function OneServicio({ servicio, favorito, setFavorito, one_item_ref, setShowServicio }) {
    const { setAlertData, setReportData, csrf } = useContext(Context);
    const [showShareModal, setShowShareModal] = useState(false);

    const fun_set_fav = async () => {
        const response = await fetch(urlBackGlobal + "/api/usuarios-c/setFavorito", {
            method: "POST",
            body: JSON.stringify({
                id_recurso: servicio.id_servicio,
                tipo_recurso: "servicio"
            }),
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-Token": csrf
            },
            credentials: "include"
        });
        const data = await response.json();
        if (data.statusCode === 400) {
            const res2 = await fetch(urlBackGlobal + "/api/usuarios-c/deleteFavorito/" + data.id_favorito, {
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

    return (<>

        <section className="containerOne" ref={one_item_ref}>
            <section className="container_head">
                <div className="header">
                    <div className="d-flex flex-column">
                        <h1>{servicio.titulo}</h1>
                        <p className="user_name"><i className="bi bi-person-fill"></i>&nbsp;{servicio.user_name}</p>
                    </div>
                    <button className="btn_close d-lg-none"
                        onClick={() => {
                            one_item_ref.current.classList.remove('show');
                            setShowServicio({})
                        }}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="actions">
                    <button className="action-btn" data-tooltip="Contactar por WhatsApp" onClick={() => window.open(`https://wa.me/${servicio.num_telf}`, '_blank')}>
                        <i className="bi bi-whatsapp"></i>
                    </button>
                    <button className={`action-btn ${favorito ? 'mark' : ''}`} data-tooltip={favorito ? "Quitar de favoritos" : "Agregar a favoritos"} onClick={fun_set_fav}>
                        <i className={`bi bi-bookmark-heart${favorito ? ' set-fav' : ' del-fav'}`}></i>
                    </button>
                    <button className="action-btn" data-tooltip="Compartir" onClick={() => setShowShareModal(true)}>
                        <i className="bi bi-share-fill"></i>
                    </button>
                    <button className="action-btn" data-tooltip="Reportar" onClick={() => setReportData({
                        id: servicio.id_servicio,
                        type: 'servicio',
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
                    <p className="info">{servicio.descripcion}</p>
                </div>
                <div className="section">
                    <span className="badge">{servicio.costo ? `Costo: ${servicio.costo}` : 'Costo no definido'}</span>
                    <span className="badge">{servicio.modalidad}</span>
                </div>
                <div className="section">
                    <h3 className="section-title">Ciudad</h3>
                    <p className="info">{servicio.ciudad}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Ubicación</h3>
                    <p className="info">{servicio.ubicacion ? servicio.ubicacion : "No Definido"}</p>
                </div>
                <div className="section">
                    <h3 className="section-title">Número de Teléfono</h3>
                    <p className="info">{servicio.num_telf}</p>
                </div>
            </section>
        </section>

        <Modal_Share showShareModal={showShareModal} setShowShareModal={setShowShareModal} tipo={"servicio"} data={servicio} />
    </>
    );
}