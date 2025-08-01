"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import { urlBackGlobal } from "@/constants/urls";
import { getEstadosFromApi } from "@/utils/locationUtils";
import { SelectEmpleos } from "@/components/generales/select-forms";
import { Context } from "@/app/providers";

export default function NuevoEmpleo(){
    const urlBackEnd = urlBackGlobal;
    const formRef = useRef();
    const router = useRouter();
    const {csrf} = useContext(Context);
    const [phone, setPhone] = useState("");

    const publicarEmpleo = async () => {
        if(!formRef.current.reportValidity()) return;
        const formData = new FormData(formRef.current);
        formData.append("num_telf", phone);
        const data = Object.fromEntries(formData.entries());
        if(data.num_telf.length < 6||!phone||phone.length>50) {
            await Swal.fire({
                title: "NUMERO DE TELEFONO INVALIDO",
                text: "Por favor ingrese un numero de telefono valido",
                icon: "warning",
            });
            return;
        }
        try {
            const response = await fetch(urlBackEnd + "/api/empleos-c/crear-empleo", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json",
                    "X-XSRF-Token": csrf
                },
                credentials:"include"
            });
            if(response.ok) {
                await Swal.fire({
                    title: "SE PUBLICO EL EMPLEO",
                    text: "",
                    icon: "success",
                });
                router.push("/");
            } else {
                await Swal.fire({
                    title: "OCURRIO UN ERROR",
                    text: "No se pudo publicar el anuncio, si el problema persiste contacte con soporte tecnico",
                    icon: "error",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor"+error,
                icon: "error",
            });
        }
    }

    return(
        <section className="container form-container">
            <h1 className="form-title">PUBLICAR NUEVO EMPLEO</h1>
            <form ref={formRef} className="row g-4 p-4">
                <FormBody acctionPublicar={publicarEmpleo} setPhone={setPhone} phone={phone}/>
            </form>
        </section>
    );
}

function FormBody({acctionPublicar, setPhone, phone}){
    const [estados, setEstados] = useState([]);
    const { csrf } = useContext(Context);
    
    useEffect(() => {
        const obtenerEstados = async () => {
            try {
                await getEstadosFromApi(setEstados, csrf);
            } catch (error) {
                console.error("Error al obtener estados:", error);
            }
        };
        obtenerEstados();
    }, [csrf]);

    return (
        <>
            {/* Información Básica */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Información Básica</h3>
                <div className="row g-3">
                    <input defaultValue={"none"} name="pais" hidden/>
                    <div className="col-md-6 col-12">
                        <label className="form-label">TÍTULO DEL PUESTO (*)</label>
                        <input className="form-control form-input text-white" name="titulo" type="text" required minLength="2" maxLength="50"
                            placeholder="Ej: Desarrollador Frontend Senior" />
                    </div>
                    <div className="col-md-3 col-6">
                        <label className="form-label">SALARIO(opcional)</label>
                        <input className="form-control form-input" type="number" name="salario" defaultValue="0"
                            placeholder="Ej: 1500" />
                    </div>
                    <div className="col-md-3 col-6">
                        <label className="form-label">MODALIDAD (*)</label>
                        <select className="form-select form-select" name="modalidad" required defaultValue="Presencial">
                            <option value="Presencial">PRESENCIAL</option>
                            <option value="Remoto">REMOTO</option>
                            <option value="Hibrido">HÍBRIDO</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Categorización y Contacto */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Categorización y Contacto</h3>
                <div className="row g-3">
                    <div className="col-md-3 col-12">
                        <label className="form-label">ÁREA (*)</label>
                        <SelectEmpleos categoria={"OTROS"}/>
                    </div>
                    <div className="col-md-4 col-12">
                        <label className="form-label">NÚMERO DE CONTACTO (*)</label>
                        <PhoneInput
                            international
                            defaultCountry="BO"
                            value={phone}
                            onChange={(num)=>{setPhone(num)}}
                            className="form-control form-input"
                        />
                    </div>
                    <div className="col-md-5 col-12">
                        <label className="form-label">ESTADO (*)</label>
                        <select className="form-select" name="ciudad" required>
                            <option value="">Seleccione un departamento</option>
                            {estados && estados.length > 0 ?
                                estados.map((estado, index) => (
                                    <option key={index} value={estado.name.replace("Department", "")}>
                                        {estado.name.replace("Department", "")}
                                    </option>
                                ))
                                : <option value="" disabled>NO HAY DEPARTAMENTOS DISPONIBLES</option>
                            }
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label">UBICACIÓN ESPECÍFICA (opcional)</label>
                        <input className="form-control form-input" name="ubicacion"
                            placeholder="Ej: Zona Centro, Calle Principal #123" maxLength="50" />
                    </div>
                </div>
            </div>

            {/* Detalles del Puesto */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Detalles del Puesto</h3>
                <div className="row g-3">
                    <div className="col-md-6 col-12">
                        <label className="form-label">REQUISITOS (*)</label>
                        <textarea
                            className="form-control form-input form-textarea"
                            name="requisitos"
                            placeholder="Lista los requisitos principales del puesto:&#10;- Experiencia mínima de X años&#10;- Conocimientos en...&#10;- Habilidades específicas..."
                            maxLength="1000"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <label className="form-label">DESCRIPCIÓN DEL PUESTO (*)</label>
                        <textarea
                            className="form-control form-input form-textarea"
                            name="descripcion"
                            placeholder="Describe las responsabilidades y beneficios del puesto:&#10;- Principales funciones&#10;- Beneficios ofrecidos&#10;- Horarios&#10;- Otros detalles relevantes"
                            maxLength="1000"
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 text-center mt-4">
                <button
                    className="submit-btn"
                    onClick={(e) => { e.preventDefault(); acctionPublicar() }}
                >
                    PUBLICAR EMPLEO
                </button>
            </div>
        </>
    );
}