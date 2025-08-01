"use client"
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import { getEstadosFromApi } from "@/utils/locationUtils";
import React, { useContext, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import Swal from "sweetalert2";
import { SelectPasantias } from "@/components/generales/select-forms";

export default function FormsPasantias({pasantia, refreshPasantia, userInf}){
    const formRef = useRef(null);
    const {csrf} = useContext(Context);
    const [phone,setPhone] = useState(pasantia.num_telf+"");
    const [estados, setEstados]= useState([]);

    useEffect(()=>{
        const obtenerEstadosYCiudades = async () => {
            try{await getEstadosFromApi(setEstados, csrf);}
            catch{console.log('not found cities')}
        };
        obtenerEstadosYCiudades();
    },[]) //GET CIUDADES

    const editarPasantia=async(id)=>{
        if(!formRef.current.reportValidity())return;
        const formData = new FormData(formRef.current);
        if(phone.length<10||!phone ||phone.length>50){
            await Swal.fire({
                title: "ADVERTENCIA",
                text: "Debe ingresar un numero de telefono valido.",
                icon: "warning",
            });
            return;
        }
        formData.append("num_telf",phone);
        const data = Object.fromEntries(formData.entries());
        if(!data.isActive)data.isActive=false;
        if(data.isActive==="on")data.isActive=true;
        const response = await fetch(urlBackGlobal+"/api/pasantias-c/updatePasantia/"+id,{
            method:"PUT",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf
            },
            body:JSON.stringify(data)
        })
        if(response.ok){
            refreshPasantia();
            await Swal.fire({
                title: "PASANTIA ACTUALIZADA",
                text: "",
                icon: "success",
            });
        }
        else{
            await Swal.fire({
                title: response.status,
                text: "",
                icon: "error",
            });
        }
    }
    const eliminarPasantia=async(id)=>{
        const response = await fetch(urlBackGlobal+"/api/pasantias-c/deletePasantia/"+id,{
            method:"DELETE",
            credentials:"include",
            headers:{
                "X-XSRF-Token":csrf
            }
        });
        if(response.ok){
            refreshPasantia();
            await Swal.fire({
                title: "PASANTIA ELIMINADA",
                text: "",
                icon: "success",
            });
        }
        else{
            await Swal.fire({
                title: "ERROR",
                text: "No se pudo eliminar este objeto. Prueba a reiniciar la pagina. Si el problema persiste contacte con soporte tecnico",
                icon: "error",
            });
        }   
    }
    return(
    <form className="row g-3 needs-validation mx-auto" ref={formRef}>
        <input defaultValue={pasantia.id_pasantia} disabled hidden />
            <div className="col-md-6">
                <label>TITULO</label>
                <input className="form-control" defaultValue={pasantia.titulo} name="titulo" maxLength="50" required />
            </div>
            <div className="col-md-3">
                <label>AREA (*)</label>
                <SelectPasantias categoria={pasantia.categoria}/>
            </div>
            <div className="col-md-3">
                <label>DURACION</label>
                <input className="form-control" defaultValue={pasantia.duracion} name="duracion" required type="text" maxLength="15" />
            </div>
            <div className="col-md-6 text-black">
                <label className="">NUMERO DE TELEFONO</label>
                <PhoneInput country={userInf.pais.slice(0,2).toLowerCase()} onChange={(num) => setPhone(num)} value={phone}  className='form-control'/>
            </div>
            <div className="col-md-3">
                <label>MODALIDAD</label>
                <select className="form-select" defaultValue={pasantia.modalidad} name="modalidad" required>
                    <option value={"Presencial"}>PRESENCIAL</option>
                    <option value={"Remoto"}>REMOTO</option>
                    <option value={"Hibrido"}>HIBRIDO</option>
                </select>
            </div>
            <div className="col-md-3">
                <label>CIUDAD</label>
                <select defaultValue={pasantia.ciudad.trim()} className="form-select" name="ciudad" required>
                    {estados.map((ciudad, index) => (
                        <option 
                            key={index} 
                            value={ciudad.name}
                            selected={ciudad.name.trim() === pasantia.ciudad.trim()}
                        >
                            {ciudad.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>UBICACION</label>
                <input className="form-control" name="ubicacion" defaultValue={pasantia.ubicacion} maxLength="50"/>
            </div>
            <div className="col-md-6">
                <label>PAIS</label>
                <input className="form-control" name="pais" readOnly defaultValue={pasantia.pais} />
            </div>
            <div className="col-md-6">
                <label>FECHA DE PUBLICACION</label>
                <input className="form-control" disabled defaultValue={new Date(pasantia.fecha_modificacion).toLocaleDateString()} />
            </div>
            <div className="col-md-6">
                <label htmlFor="">FECHA INICIO</label>
                <input className="form-control" type="date" defaultValue={new Date(pasantia.fecha_inicio).toISOString().split('T')[0]} required name="fecha_inicio"/>
            </div>
            <div className="col-md-6">
                <label>FECHA FIN</label>
                <input className="form-control" type="date" defaultValue={new Date(pasantia.fecha_fin).toISOString().split('T')[0]} required name="fecha_fin"/>
            </div>
            <div className="col-12 col-md-6">
                <label>REQUISITOS</label>
                <textarea className="form-control" name="requisitos" defaultValue={pasantia.requisitos} style={{ height: "max-content" }} maxLength="1000" required/>
            </div>
            <div className="col-12 col-md-6">
                <label>DESCRIPCION</label>
                <textarea className="form-control" name="descripcion" defaultValue={pasantia.descripcion} style={{ height: "max-content" }} maxLength="1000" required />
            </div>
            <div className="col-12">
                <label>ACTIVO</label>
                <input className="form-check-input ms-2" type="checkbox" defaultChecked={pasantia.isActive} name="isActive" />
            </div>
            <div className="row pb-3">
                <button className="btn btn-warning col-12 col-md-4 mx-auto text-white" onClick={(e) => {
                    e.preventDefault();
                    editarPasantia(pasantia.id_pasantia);
                }}>
                    GUARDAR CAMBIOS
                </button>
                <button className="btn btn-danger col-12 col-md-3 mx-auto"
                    onClick={async (e) => {
                        e.preventDefault();
                        eliminarPasantia(pasantia.id_pasantia);
                    }}>
                    ELIMINAR
                </button>
                
                <button className='btn btn-primary col-md-3 col-12 mx-auto'
                onClick={async(e)=>{
                    e.preventDefault();
                    await fetch(urlBackGlobal+'/api/pasantias-c/renovation/'+pasantia.id_pasantia,{
                        method:'PUT',
                        credentials:"include",
                        headers:{
                            'X-XSRF-Token':csrf
                        }
                    });
                    Swal.fire(({
                        title:'Se renovo la pasantia',
                        icon:'success'
                    }));
                }}>RENOVAR</button>
            </div>
    </form>);
}