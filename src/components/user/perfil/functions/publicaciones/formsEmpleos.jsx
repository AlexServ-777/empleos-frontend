"use client"
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '@/app/providers';
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import { getEstadosFromApi } from "@/utils/locationUtils";
import { urlBackGlobal } from "@/constants/urls";
import { SelectEmpleos } from '@/components/generales/select-forms';

export default function FormsEmpleos({ empleo, userInf, refreshEmpleos }) {
    const {csrf } = useContext(Context);
    const [estados, setEstados] = useState([]);
    const urlBack = urlBackGlobal;
    const [phone, setPhone] = useState(String(empleo.num_telf));

    const formRef = useRef(null);
    useEffect(() => {
        const obtenerEstadosYCiudades = async () => {
            try {
                await getEstadosFromApi(setEstados, csrf);
            }catch{console.log('cities failed')}
        };
        obtenerEstadosYCiudades();
    }, []); //getCiudades


    const eliminarEmpleo = async (id) => {
        try {
            const response = await fetch(urlBack + "/api/empleos-c/delete-empleo/" + id, {
                method: "DELETE",
                headers: {
                    "X-XSRF-Token":csrf,
                },
                credentials:"include"
            });
            if (response.ok) {
                refreshEmpleos();
                await Swal.fire({
                    title: "SE ELIMINO LA PUBLICACION",
                    text: "",
                    icon: "info",
                });
            } else {
                await Swal.fire({
                    title: "OCURRIO UN ERROR INESPERADO",
                    text: "Si el problema persiste contacte con soporte tecnico",
                    icon: "warning",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor",
                icon: "error",
            });
        }
    }

    const editarEmpleo = async (id) => {
        if (!formRef.current.reportValidity()) return;
        const formData = new FormData(formRef.current);
        if(!phone||phone.length<10||phone.length>50){
            await Swal.fire({
                title: "ADVERTENCIA",
                text: "Debe ingresar un numero de telefono valido.",
                icon: "warning",
            });
            return;
        }
        formData.append('num_telf', phone);
        const data = Object.fromEntries(formData.entries());
        if(!data.isActive) data.isActive=false;
        if(data.isActive==='on')data.isActive=true;
        try {
            const response = await fetch(urlBack + "/api/empleos-c/update-empleo/" + id, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token":csrf,
                },
                credentials:"include"
            });
            refreshEmpleos();
            if (response.ok) {
                await Swal.fire({
                    title: "SE GUARDARON LOS CAMBIOS",
                    text: "",
                    icon: "success",
                });
            } else {
                await Swal.fire({
                    title: "NO SE PUDO GUARDAR LOS CAMBIOS",
                    text: "si el problema persiste contacte con soporte tecnico",
                    icon: "error",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor",
                icon: "error",
            });
        }
    }

    return (
        <form className="row g-3 needs-validation mx-auto" ref={formRef}>
            <input defaultValue={empleo.id_empleo} disabled hidden />
            <div className="col-md-6">
                <label>TITULO</label>
                <input className="form-control" type='text' defaultValue={empleo.titulo} name="titulo" maxLength="50" required/>
            </div>
            <div className="col-md-3">
                <label>AREA (*)</label>
                <SelectEmpleos categoria={empleo.categoria}/>
            </div>
            <div className="col-md-3">
                <label>SALARIO</label>
                <input className="form-control" defaultValue={empleo.salario} name="salario" type="number" />
            </div>
            <div className="col-md-6 text-black">
                <label className="">NUMERO DE TELEFONO</label>
                <PhoneInput country={userInf.pais.slice(0,2).toLowerCase()} onChange={(num) => setPhone(num)} value={phone}  className='form-control'/>
            </div>
            <div className="col-md-3">
                <label>MODALIDAD</label>
                <select className="form-select" defaultValue={empleo.modalidad} name="modalidad" required>
                    <option value={"Presencial"}>PRESENCIAL</option>
                    <option value={"Remoto"}>REMOTO</option>
                    <option value={"Hibrido"}>HIBRIDO</option>
                </select>
            </div>
            <div className="col-md-3">
                <label>CIUDAD</label>
                <select defaultValue={empleo.ciudad.trim()} className="form-select" name="ciudad" required>
                    {estados.map((ciudad, index) => (
                        <React.Fragment key={index}>
                            <option 
                            value={ciudad.name}
                            selected={ciudad.name.trim()===empleo.ciudad.trim()}
                            >{ciudad.name}</option>
                        </React.Fragment>
                    ))}
                </select>
            </div>
            <div>
                <label>UBICACION</label>
                <input className='form-control' name='ubicacion' maxLength="50" defaultValue={empleo.ubicacion}/>
            </div>
            <div className="col-md-6">
                <label>PAIS</label>
                <input className="form-control" name="pais" readOnly defaultValue={empleo.pais} />
            </div>
            <div className="col-md-6">
                <label>FECHA DE PUBLICACION</label>
                <input className="form-control" disabled defaultValue={new Date(empleo.fecha_modificacion).toLocaleDateString()} />
            </div>
            <div className="col-12 col-md-6">
                <label>REQUISITOS</label>
                <textarea className="form-control" name="requisitos" required maxLength="1000"  defaultValue={empleo.requisitos} style={{ height: "max-content" }} />
            </div>
            <div className="col-12 col-md-6">
                <label>DESCRIPCION</label>
                <textarea className="form-control" required maxLength="1000" name="descripcion" defaultValue={empleo.descripcion} style={{ height: "max-content" }} />
            </div>
            <div className="col-12">
                <label>ACTIVO</label>
                <input className="form-check-input ms-2" type="checkbox" defaultChecked={empleo.isActive} name="isActive" />
            </div>
            <div className="pb-3 row mx-auto">
                <button className="btn btn-warning col-md-4 col-12 mx-auto text-white" onClick={(e) => {
                    e.preventDefault();
                    editarEmpleo(empleo.id_empleo);
                }}>
                    GUARDAR CAMBIOS
                </button>
                <button className="btn btn-danger col-md-3 col-12 mx-auto"
                    onClick={async (e) => {
                        e.preventDefault();
                        eliminarEmpleo(empleo.id_empleo);
                    }}>
                    ELIMINAR
                </button>
                <button className='btn btn-primary col-md-3 col-12 mx-auto'
                onClick={async(e)=>{
                    e.preventDefault();
                    await fetch(urlBack+'/api/empleos-c/renovation/'+empleo.id_empleo,{
                        method:'PUT',
                        credentials:"include",
                        headers:{
                            'X-XSRF-Token':csrf
                        }
                    });
                    Swal.fire(({
                        title:'Se renovo el empleo',
                        icon:'success'
                    }));
                }}>RENOVAR</button>
            </div>
        </form>
    );
} 