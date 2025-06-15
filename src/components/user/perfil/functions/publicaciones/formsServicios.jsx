"use client"
import { SelectServicios } from "@/components/generales/select-forms";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";
import { getEstadosFromApi } from "@/utils/locationUtils";
import { useContext, useRef, useState,useEffect } from "react";
import PhoneInput from 'react-phone-number-input';
import Swal from "sweetalert2";

export default function FormsServicios({servicio, userInf, refreshServicios}){
    const {csrf}= useContext(Context);
    const formRef = useRef(null);

    const [phone,setPhone] = useState(servicio.num_telf);
    const [estados, setEstados] =useState([]);

    
    useEffect(()=>{
        const obtenerEstadosYCiudades = async () => {
            try{await getEstadosFromApi(setEstados, csrf);}
            catch(error){console.log('not found cities: '+error)}
                
        };
        obtenerEstadosYCiudades();
    },[]) //GET CIUDADES
    const editarServicio= async(id)=>{
        if(!formRef.current.reportValidity()) return;
        const formData = new FormData(formRef.current);
        if(phone.length<6||!phone||phone.length>50){
            await Swal.fire({
                title: "DEBES INGRESAR UN NUMERO DE TELEFONO VALIDO",
                icon: "warning"
            });
            return;
        }
        formData.append("num_telf",phone);
        const data = Object.fromEntries(formData.entries());
        if(!data.isActive) data.isActive=false;
        if(data.isActive==="on") data.isActive=true;
        const response = await fetch(urlBackGlobal+"/api/servicios-c/updateServicio/"+id,{
            method:"PUT",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf
            },
            body:JSON.stringify(data)
        });
        if(response.ok){
            refreshServicios();
            await Swal.fire({
                title: "Servicio actualizado",
                icon: "success"
            });
        }
        else{
            const res = await response.json()
            await Swal.fire({
                title: res.message,
                icon: "error"
            });
        }
    }

    const eliminarServicio= async(id)=>{
        const response = await fetch(urlBackGlobal+"/api/servicios-c/deleteServicio/"+id,{
            method:'DELETE',
            credentials:"include",
            headers:{
                "X-XSRF-Token":csrf
            }
        });
        if(response.ok){
            refreshServicios();
            await Swal.fire({
                title: "Servicio eliminado",
                icon: "success"
            });
        }
        else{
            await Swal.fire({
                title: "ERROR",
                text:"Si el problema persiste contacte con soporte tecnico",
                icon: "error"
            });  
        }
    }
    return(
        <form className="row g-3 needs-validation mx-auto" ref={formRef}>
            <input defaultValue={servicio.id_servicio} disabled hidden />
            <div className="col-md-6">
                <label>TITULO</label>
                <input className="form-control" defaultValue={servicio.titulo} name="titulo" maxLength="50" required/>
            </div>
            <div className="col-md-3">
                <label>AREA (*)</label>
                <SelectServicios categoria={servicio.categoria}/>
            </div>
            <div className="col-md-3">
                <label>PRECIO</label>
                <input className="form-control" defaultValue={servicio.precio} name="precio" required type="number" />
            </div>
            <div className="col-md-6 text-black">
                <label className="">NUMERO DE TELEFONO</label>
                <PhoneInput country={userInf.pais.slice(0,2).toLowerCase()} onChange={(num) => setPhone(num)} value={phone}  className='form-control'/>
            </div>
            <div className="col-md-3">
                <label>MODALIDAD</label>
                <select className="form-select" defaultValue={servicio.modalidad} name="modalidad" required>
                    <option value={"Presencial"}>PRESENCIAL</option>
                    <option value={"Remoto"}>REMOTO</option>
                    <option value={"Hibrido"}>HIBRIDO</option>
                </select>
            </div>
            <div className="col-md-3">
                <label>CIUDAD</label>
                <select defaultValue={servicio.ciudad.trim()} className="form-select" name="ciudad" required>
                    {estados.map((ciudad, index) => (
                        <option 
                            key={index} 
                            value={ciudad.name}
                            selected={ciudad.name === servicio.ciudad.trim()}
                        >
                            {ciudad.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>UBICACION</label>
                <input className="form-control" defaultValue={servicio.ubicacion} name="ubicacion" maxLength="50"/>
            </div>
            <div className="col-md-6">
                <label>PAIS</label>
                <input className="form-control" name="pais" readOnly defaultValue={servicio.pais} />
            </div>
            <div className="col-md-6">
                <label>FECHA DE MODIFICACION</label>
                <input className="form-control" disabled defaultValue={new Date(servicio.fecha_modificacion).toLocaleDateString()} />
            </div>
            <div className="col-12">
                <label>DESCRIPCION</label>
                <textarea className="form-control" name="descripcion" defaultValue={servicio.descripcion} style={{ height: "max-content" }} required maxLength="1000" />
            </div>
            <div className="col-12">
                <label>ACTIVO</label>
                <input className="form-check-input ms-2" type="checkbox" defaultChecked={servicio.isActive} name="isActive" />
            </div>
            <div className="row pb-3">
                <button className="btn btn-warning col-12 col-md-4 mx-auto" onClick={(e) => {
                    e.preventDefault();
                    editarServicio(servicio.id_servicio);
                }}>
                    GUARDAR CAMBIOS
                </button>
                <button className="btn btn-danger col-12 col-md-3 mx-auto"
                    onClick={async (e) => {
                        e.preventDefault();
                        eliminarServicio(servicio.id_servicio);
                    }}>
                    ELIMINAR
                </button>
                
                <button className='btn btn-primary col-md-3 col-12 mx-auto'
                onClick={async(e)=>{
                    e.preventDefault();
                    await fetch(urlBackGlobal+'/api/servicios-c/renovation/'+servicio.id_servicio,{
                        method:'PUT',
                        credentials:"include",
                        headers:{
                            'X-XSRF-Token':csrf
                        }
                    });
                    Swal.fire(({
                        title:'Se renovo el servicio',
                        icon:'success'
                    }));
                }}>RENOVAR</button>
            </div>
        </form>
    )
}