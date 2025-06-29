"use client"
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '@/app/providers';
import { urlBackGlobal } from '@/constants/constants_backend';
import FormsEmpleos from './publicaciones/formsEmpleos';
import FormsPasantias from './publicaciones/formsPasantias';
import FormsServicios from './publicaciones/formsServicios';

export default function Publications({ userInf }) {
    const {csrf } = useContext(Context);
    const [showType, setShowType]= useState("EMPLEOS");
    const [empleos, setEmpleos] = useState([]);
    const [pasantias, setPasantias] = useState([]);
    const [servicios, setServicios] = useState([]);

    const formEmpUpdate = useRef();
    const urlBack = urlBackGlobal;

    const getEmpleosUser = async () => {
        try {
            const response = await fetch(urlBack + "/api/empleos-c/empleos-user", {
                credentials:"include"
            });
            const data = response.ok ? await response.json() : [];
            if (data.length > 0 && Array.isArray(data)) {
                setEmpleos(data);
            } else {
                setEmpleos([]);
            }
        } catch (error) {
        }
    };
    const getPasantiasUser = async()=>{
        try{
            const response = await fetch(urlBack+"/api/pasantias-c/getPasantiasUser",{
                credentials:"include",
                headers:{
                    "X-XSRF-Token":csrf
                }
            });
            const data = await response.json();
            if(response.ok){
                if(Array.isArray(data)&&data.length>0){
                    setPasantias(data);
                }
            }else{setPasantias([])}
        }catch{
            //error de conexion
        }
    }
    const getServiciosUser = async()=>{
        try{
            const response = await fetch(urlBack+"/api/servicios-c/getServiciosUsuario",{
                credentials:"include",
                headers:{
                    "X-XSRF-Token": csrf
                }
            })
            const data = await response.json();
            if(response.ok){
                if(Array.isArray(data))setServicios(data);
            }
        }catch(error){
            //error del fetch
        }
    }

    useEffect(() => {
        getEmpleosUser();
        getPasantiasUser();
        getServiciosUser();
    }, [csrf]);

    return (
        <>
        <hr />
        <section style={{ display: `${empleos || pasantias || servicios ? "block" : "none"}` }}>
            {/*EMPLEOS ACCORDEON*/}
            <select className='form-select wid-50 wid-md-25 mb-3' defaultValue={"EMPLEOS"}
            onChange={(e)=>{setShowType(e.target.value)}}>
                <option value="EMPLEOS">EMPLEOS</option>
                <option value="PASANTIAS">PASANTIAS</option>
                <option value="SERVICIOS">SERVICIOS</option>
            </select>
            <h3 className="text-white text-center">PUBLICACIONES</h3>
            <p className='text-warning text-center'>Las publicaciones se desactivaran automaticamente pasado 1 semana desde su modificacion</p>
            <p className='text-warning text-center'>Y se eliminaran pasado 6 meses si no se vuelven a activar</p>
            
            {/* EMPLEOS ACCORDEON */}
            <section style={{display:`${showType==="EMPLEOS"?"block":"none"}`}}>
                {empleos.map((empleo) => (
                    <div
                        key={empleo.id_empleo}
                        className="publicaciones text-white accordion accordion-flush"
                        id={`accordionFlushExample-${empleo.id_empleo}`}
                    >
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse-${empleo.id_empleo}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse-${empleo.id_empleo}`}
                                >
                                    {empleo.titulo}
                                </button>
                            </h2>
                            <div
                                id={`flush-collapse-${empleo.id_empleo}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#accordionFlushExample-${empleo.id_empleo}`}
                            >
                                <div className="accordion-body">
                                    <FormsEmpleos empleo={empleo} userInf={userInf} refFormEmpUpdate={formEmpUpdate} refreshEmpleos={getEmpleosUser} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/*PASANTIAS ACCORDEON */}
            <section style={{display:`${showType==="PASANTIAS"?"block":"none"}`}}>
            {pasantias.map((pasantia) => (
                    <div
                        key={pasantia.id_pasantia}
                        className="publicaciones text-white accordion accordion-flush"
                        id={`accordionFlushExample-${pasantia.id_pasantia}`}
                    >
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse-${pasantia.id_pasantia}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse-${pasantia.id_pasantia}`}
                                >
                                    {pasantia.titulo}
                                </button>
                            </h2>
                            <div
                                id={`flush-collapse-${pasantia.id_pasantia}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#accordionFlushExample-${pasantia.id_pasantia}`}
                            >
                                <div className="accordion-body">
                                    <FormsPasantias pasantia={pasantia} userInf={userInf} refreshPasantia={getPasantiasUser}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            
            {/*SERVICIOS ACCORDEON */}
            <section style={{display:`${showType==="SERVICIOS"?"block":"none"}`}}>
            {servicios.map((servicio) => (
                    <div
                        key={servicio.id_servicio}
                        className="publicaciones text-white accordion accordion-flush"
                        id={`accordionFlushExample-${servicio.id_servicio}`}
                    >
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse-${servicio.id_servicio}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse-${servicio.id_servicio}`}
                                >
                                    {servicio.titulo}
                                </button>
                            </h2>
                            <div
                                id={`flush-collapse-${servicio.id_servicio}`}
                                className="accordion-collapse collapse"
                                data-bs-parent={`#accordionFlushExample-${servicio.id_servicio}`}
                            >
                                <div className="accordion-body">
                                    <FormsServicios servicio={servicio} userInf={userInf} refreshServicios={getServiciosUser}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </section>
        </>
    );
}
