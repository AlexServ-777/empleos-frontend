"use client"
import { urlBackGlobal } from '@/constants/constants_backend';
import { Context } from '@/app/providers';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';

export default function Favorites() {
    const urlBack = urlBackGlobal;
    const {csrf} = useContext(Context);
    const router = useRouter();
    const [favoritos, setFavoritos] = useState([]);

    const getFavoritos = async()=>{
        try{
            const response = await fetch(urlBack+"/api/usuarios-c/favoritos",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "X-XSRF-Token":csrf,
                },
                credentials:"include"
            });
            const data = await response.json();
            if(response.ok){
                if (Array.isArray(data))setFavoritos(data);
            }}
        catch(error){
            console.log("failed Fetch Favoritos", error);
        }
    }
    const eliminarFavorito = async(id_favorito)=>{
        const response = await fetch(urlBack+"/api/usuarios-c/deleteFavorito/"+id_favorito,{
            method:"DELETE",
            headers:{
                "X-XSRF-Token":csrf,
            },
            credentials:"include"
        });
        if(response.ok){
            getFavoritos();
        }
    }
    const redirectFavorito = (favorito)=>{
        switch(favorito.tipo_favorito){
            case "empleo":
                router.push(`/empleos/${favorito.empleo.id_empleo}`);
                break;
            case "pasantia":
                router.push(`/pasantias/${favorito.pasantia.id_pasantia}`);
                break;
            case "servicio":
                router.push(`/servicios/${favorito.servicio.id_servicio}`);
                break;
                
        }
    }
    useEffect(()=>{
        getFavoritos();
    },[csrf]);
    const renderModal = () => {

        return(
            <>
            <hr />
                <div className="d-block">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content favorites-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-heart-fill text-danger"></i>
                                    Mis Favoritos
                                </h5>
                            </div>
                            <div className="modal-body">
                                { favoritos.length>0?favoritos.map(favorito => (
                                    <div key={favorito.id_favorito} className="favorite-item">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h4>{
                                                favorito.tipo_favorito==="empleo"?favorito.empleo.titulo:
                                                favorito.tipo_favorito==="pasantia"?favorito.pasantia.titulo:
                                                favorito.servicio.titulo}
                                                </h4>
                                                <p>{favorito.tipo_favorito==="empleo"?favorito.empleo.empresa:
                                                favorito.tipo_favorito==="pasantia"?favorito.pasantia.empresa:
                                                favorito.servicio.empresa}</p>
                                                <p>
                                                    <i className="bi bi-geo-alt"></i> {
                                                        favorito.tipo_favorito==="empleo"?favorito.empleo.ciudad:
                                                        favorito.tipo_favorito==="pasantia"?favorito.pasantia.ciudad:
                                                        favorito.servicio.ciudad
                                                    } &nbsp;
                                                    <i className="bi bi-calendar3"></i> {
                                                        favorito.tipo_favorito==="empleo"?new Date(favorito.empleo.fecha_creacion).toLocaleDateString():
                                                        favorito.tipo_favorito==="pasantia"?new Date(favorito.pasantia.fecha_creacion).toLocaleDateString():
                                                        new Date(favorito.servicio.fecha_creacion).toLocaleDateString()
                                                    }
                                                </p>
                                                <p><i className="bi bi-currency-dollar"></i> {
                                                    favorito.tipo_favorito==="empleo"?favorito.empleo.salario:
                                                    favorito.tipo_favorito==="pasantia"?favorito.pasantia.duracion:
                                                    favorito.servicio.precio
                                                }</p>
                                            </div>
                                            <span className="badge">{favorito.tipo_favorito}</span>
                                        </div>
                                        <div className="favorite-actions">
                                            <button className="view-btn" onClick={()=>{
                                                redirectFavorito(favorito);
                                            }}>
                                                <i className="bi bi-eye"></i> Ver Detalles
                                            </button>
                                            <button className="remove-btn" onClick={()=>{
                                                eliminarFavorito(favorito.id_favorito);
                                            }}>
                                                <i className="bi bi-trash"></i> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )):<h3>No tienes favoritos</h3>}
                            </div>
                        </div>
                    </div>
                </div>
                
            </>
        );
    };

    return (
        <>
            {renderModal()}
        </>
    );
} 