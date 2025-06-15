"use client"
import { useState, useEffect, useContext, useRef } from 'react';
import { urlBackGlobal } from '@/constants/constants_backend';
import PhoneInput from "react-phone-number-input";
import { getEstadosFromApi } from "@/utils/locationUtils";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SelectPasantias } from '@/components/generales/select-forms';
import SEO from '@/components/SEO';
import { Context } from '@/app/providers';

export default function NewPasantia(){
    const urlBack = urlBackGlobal;
    const formRef = useRef("");
    const router = useRouter();
    const {csrf} = useContext(Context);
    const [phone, setPhone] = useState("");

    const publicarPasantia = async () => {
        if(!formRef.current.reportValidity()) return;
        const formData = new FormData(formRef.current);
        if(phone.length < 5||!phone||phone.length>50) {
            await Swal.fire({
                title: "NÚMERO DE TELÉFONO INVÁLIDO",
                text: "Por favor ingrese un número de teléfono válido",
                icon: "warning"
            });
            return;
        }
        formData.append("num_telf", phone);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(urlBack + "/api/pasantias-c/newPasantia", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token":csrf
                },
                credentials:"include"
            });
            if(response.ok) {
                await Swal.fire({
                    title: "SE PUBLICÓ LA PASANTÍA",
                    text: "",
                    icon: "success"
                });
                router.push("/");
            } else {
                await Swal.fire({
                    title: "OCURRIÓ UN ERROR",
                    text: "No se pudo publicar la pasantía, si el problema persiste contacte con soporte técnico o pruebe a reiniciar la pagina",
                    icon: "error"
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor"+error,
                icon: "error"
            });
        }
    }

    useEffect(() => {
        if (csrf) {
            const obtenerEstados = async () => {
                try {
                    await getEstadosFromApi(setEstados, csrf);
                } catch (error) {
                    console.error("Error al obtener estados:", error);
                }
            };
            obtenerEstados();
        }
    }, [csrf]);

    return(
        <>
        <SEO title={'PUBLICA TU ANUNCIO DE PASANTIA'} description={'Publica tus anuncion en un solo lugar'} keywords={'pasantias,bolivia,publicacion pasantias'} url={router.asPath}/>
        <section className="container form-container mb-5">
            <h1 className="form-title">PUBLICAR PASANTÍA</h1>
            <form className="row g-4 p-4" ref={formRef}>
                <FormBody setPhone={setPhone} publicarPasantia={publicarPasantia} phone={phone}/>
            </form>
        </section>
        </>
    );
}

function FormBody({setPhone, publicarPasantia, phone}){
    const [estados, setEstados] = useState([]);
    const {csrf} = useContext(Context);
    
    return (
        <>
            {/* Información Básica */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Información Básica</h3>
                <input name='pais' defaultValue="none" hidden/>
                <div className="row g-3">
                    <div className="col-md-6 col-12">
                        <label className="form-label">TÍTULO DE LA PASANTÍA (*)</label>
                        <input className="form-control form-input" name="titulo" type="text" required maxLength="50"
                               placeholder="Ej: Pasante de Desarrollo Web"/>
                    </div>
                    <div className="col-md-3 col-12">
                        <label className="form-label">ÁREA (*)</label>
                        <SelectPasantias categoria={"OTROS"}/>
                    </div>
                    <div className="col-md-3 col-12">
                        <label className="form-label">MODALIDAD (*)</label>
                        <select className="form-select form-select" name="modalidad" required>
                            <option value="Presencial">PRESENCIAL</option>
                            <option value="Remoto">REMOTO</option>
                            <option value="Hibrido">HÍBRIDO</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Ubicación y Contacto */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Ubicación y Contacto</h3>
                <div className="row g-3">
                    <div className="col-md-4 col-12">
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
                    <div className="col-md-5 col-12">
                        <label className="form-label">UBICACIÓN ESPECÍFICA (opcional)</label>
                        <input className="form-control form-input" name="ubicacion" type="text"
                               placeholder="Ej: Zona Centro, Calle Principal #123" maxLength="50"/>
                    </div>
                    <div className="col-md-3 col-12">
                        <label className="form-label">ESTADO (*)</label>
                        <select className="form-select form-select" name="ciudad" required>
                            <option value="">Seleccione una ciudad</option>
                            {estados && estados.length > 0 ? 
                                estados.map((estado, index) => (
                                    <option key={index} value={estado.name.replace("Department","")}>
                                        {estado.name.replace("Department","")}
                                    </option>
                                ))
                                : <option value="" disabled>NO HAY CIUDADES DISPONIBLES</option>
                            }
                        </select>
                    </div>
                </div>
            </div>

            {/* Duración y Fechas */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Duración y Fechas</h3>
                <div className="row g-3">
                    <div className="col-md-4 col-12">
                        <label className="form-label">DURACIÓN (*)</label>
                        <input className="form-control form-input" name="duracion" type="text" required maxLength="15"
                               placeholder="Ej: 3 meses"/>
                    </div>
                    <div className="col-md-4 col-12">
                        <label className="form-label">FECHA DE INICIO (*)</label>
                        <input className="form-control form-input" name="fecha_inicio" type="date" required />
                    </div>
                    <div className="col-md-4 col-12">
                        <label className="form-label">FECHA DE FIN (*)</label>
                        <input className="form-control form-input" name="fecha_fin" type="date" required />
                    </div>
                </div>
            </div>

            {/* Detalles de la Pasantía */}
            <div className="form-section">
                <h3 className="form-title h4 mb-4">Detalles de la Pasantía</h3>
                <div className="row g-3">
                    <div className="col-md-6 col-12">
                        <label className="form-label">REQUISITOS (*)</label>
                        <textarea 
                            className="form-control form-input form-textarea" 
                            name="requisitos" 
                            placeholder="Lista los requisitos para la pasantía:&#10;- Nivel de estudios&#10;- Conocimientos necesarios&#10;- Habilidades requeridas..."
                            required 
                            maxLength="1000"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <label className="form-label">DESCRIPCIÓN (*)</label>
                        <textarea 
                            className="form-control form-input form-textarea" 
                            name="descripcion" 
                            placeholder="Describe las actividades y beneficios:&#10;- Actividades a realizar&#10;- Aprendizaje esperado&#10;- Beneficios ofrecidos..."
                            required 
                            maxLength="1000"
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 text-center mt-4" style={{position:"relative"}}>
                <button 
                    className="submit-btn"
                    type="button" 
                    onClick={(e)=>{
                        e.preventDefault();
                        publicarPasantia();
                    }}
                >
                    PUBLICAR PASANTÍA
                </button>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const response = await fetch(process.env.url_front+"/back/api/auth/verificar-token",{
        headers:{
            Cookie:context.req.headers.cookie
        }
    })
    if(response.ok){
        return {props:{}}
    }else{
        return {
            redirect:{
                destination:"/user/login",
                permanent:false
            }
        }
    }
}