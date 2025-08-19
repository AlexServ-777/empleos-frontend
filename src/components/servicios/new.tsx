"use client"
import React, { useRef, useContext, useState, useEffect } from "react";
import { Context } from "@/app/providers";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import { urlBackGlobal } from "@/constants/urls";
import { getEstadosFromApi } from "@/utils/locationUtils";
import { SelectServicios } from "@/components/1generales/select-forms";

export default function NewService(){
    const urlBackEnd = urlBackGlobal;
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const {csrf} = useContext(Context);
    const [estados, setEstados] = useState([]);
    const [phone, setPhone] = useState("");

    const createService = async () => {
        if(!formRef.current.reportValidity()) return;
        const formData = new FormData(formRef.current);
        if(!phone || phone.length < 5 ||phone.length>50) {
            await Swal.fire({
                title: "NÚMERO DE TELÉFONO INVÁLIDO",
                text: "Por favor ingresa un número de teléfono válido",
                icon: "warning"
            });
            return;
        }
        formData.append("num_telf", phone);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(urlBackEnd + "/api/servicios-c/createServicio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token": csrf
                },
                credentials: "include",
                body: JSON.stringify(data)
            });
            if(response.ok) {
                await Swal.fire({
                    title: "SE PUBLICO EL SERVICIO",
                    text: "",
                    icon: "success"
                });
                router.push("/");
            } else {
                await Swal.fire({
                    title: "ERROR AL CREAR EL SERVICIO",
                    text: "Si el problema persiste, por favor contacta al soporte técnico",
                    icon: "error"
                });
            }
        } catch {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor",
                icon: "error"
            });
        }
    }

    useEffect(() => {
        const obtenerEstados = async () => {
            try {await getEstadosFromApi(setEstados, csrf);} 
            catch (error) {console.error("Error al obtener estados:", error);}
        };
        obtenerEstados();
    }, [csrf]);
    
    return(
    <section className="container form-container">
        <h1 className="form-title">PUBLICAR SERVICIO</h1>
        <form ref={formRef} className="row g-4 p-4">
            {/* Información Básica */}
            <input hidden name="pais" defaultValue="none"/>
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Información Básica</h3>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">TÍTULO DEL SERVICIO (*)</label>
                        <input className="form-control form-input" required name="titulo"
                               placeholder="Ej: Desarrollo de Aplicaciones Web" maxLength={50}/>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">ÁREA (*)</label>
                        <SelectServicios categoria={"OTROS"}/>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">PRECIO (*)</label>
                        <input type="number" className="form-control form-input" required name="precio"
                               placeholder="Ej: 500" />
                    </div>
                </div>
            </div>

            {/* Ubicación y Contacto */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Ubicación y Contacto</h3>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">NÚMERO DE CONTACTO (*)</label>
                        <PhoneInput
                            international
                            defaultCountry="BO"
                            value={phone}
                            onChange={(num)=>setPhone(num)}
                            className="form-control form-input"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                borderRadius: "8px",
                                color: "white"
                            }}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">CIUDAD (*)</label>
                        <select className="form-select form-select" name="ciudad" required>
                            <option value="">Seleccione una ciudad</option>
                            {estados && estados.length > 0 ? 
                                estados.map((estado, index) => (
                                    <option key={index} value={estado.name}>
                                        {estado.name}
                                    </option>
                                ))
                                : <option value="" disabled>NO HAY CIUDADES DISPONIBLES</option>
                            }
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">UBICACIÓN ESPECÍFICA (opcional)</label>
                        <input type="text" className="form-control form-input" name="ubicacion"
                               placeholder="Ej: Zona Centro, Calle Principal #123" maxLength={50}/>
                    </div>
                </div>
            </div>

            {/* Modalidad y Descripción */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Detalles del Servicio</h3>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">MODALIDAD (*)</label>
                        <select className="form-select form-select" name="modalidad" defaultValue={"Presencial"} required>
                            <option value="Presencial">PRESENCIAL</option>
                            <option value="Remoto">REMOTO</option>
                            <option value="Hibrido">HIBRIDO</option>
                        </select>
                    </div>
                    <div className="col-md-8">
                        <label className="form-label">DESCRIPCIÓN (*)</label>
                        <textarea 
                            className="form-control form-input form-textarea" 
                            required 
                            name="descripcion"
                            placeholder="Describe tu servicio en detalle:&#10;- ¿Qué ofreces exactamente?&#10;- ¿Cuál es tu experiencia?&#10;- ¿Qué incluye el servicio?&#10;- Tiempo estimado de entrega&#10;- Condiciones especiales"
                            maxLength={1000}
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 text-center mt-4">
                <button 
                    type="button" 
                    className="submit-btn"
                    onClick={(e)=>{
                        e.preventDefault();
                        createService();
                    }}
                >
                    PUBLICAR SERVICIO
                </button>
            </div>
        </form>
    </section>);
}