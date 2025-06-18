"use client"
import { useEffect, useState, useContext } from "react";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";
import Link from "next/link";
import Image from "next/image";
import Modal_Share from "../generales/modal-share";

export default function OneEmpleo({empleo,favorito}){
    const urlBack = urlBackGlobal;
    const {csrf, setAlertData} = useContext(Context);

    const [image, setImage] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [isFavorito, setIsFavorito] = useState(favorito);
    useEffect(()=>{
        const getImage =async()=>{
            const response = await fetch(`/api/listFiles?categoria=${empleo.categoria}`);
            const data = await response.json();
            setImage(data.image);
            document.getElementsByClassName('imgPrincipal')[0].classList.add('show');
        }
        getImage();
    },[empleo.categoria]);//setear la imagen correspondiente

    const setFavorito = async()=>{ //agregar o eliminar de favoritos
        const response = await fetch(urlBack+"/api/usuarios-c/setFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:empleo.id,
                tipo_recurso:"empleo"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf
            },
            credentials:"include"
        });
        const data = await response.json();
        if(response.status===401){
            setAlertData({
                message:"DEBES INICIAR SESION",
                type:"warning",
                show:"flex"
            })
        }
        if(data.statusCode === 400){
            const res2 = await fetch(urlBack+"/api/usuarios-c/deleteFavorito/"+data.id_favorito,{
                method:"DELETE",
                headers:{
                    "X-XSRF-Token":csrf
                },
                credentials:"include"
            });
            const data2 = await res2.json();
            if(res2.ok){
                setIsFavorito(false);
                setAlertData({show:"flex",message:data2.message,type:"danger"})
            }
        }
        if(data.statusCode===200){
            setIsFavorito(true);
            setAlertData({show:"flex",message:data.message, type:"success"})
        }
    }

    return (
    <section className="container text-white p-5 containerOne h-auto mb-5" style={{marginTop:"2%"}}>
        <div className="pt-4  h-100 row">
            <div className="image my-auto text-center col-12 col-md-6 p-0">
                <h1 className="tittle mb-3">{empleo.titulo}</h1>
                <Image 
                    src={image||'/imagesCategorias/OTROS.jpg'} 
                    alt={`Imagen de ${empleo.categoria}`}
                    width={500}
                    height={300}
                    className="imgPrincipal"
                    style={{maxWidth:"90%", height:"auto"}}
                />
                <h2 className="mt-3">{empleo.categoria}</h2>
            </div>
            <div className="col-12 col-md-6 p-0">
                <div className="descripcion">
                    <h2>DESCRIPCION</h2>
                    <p style={{whiteSpace:'pre-wrap'}}>{empleo.descripcion}</p>
                </div>
                <hr/>
                <div>
                    <h2>REQUISITOS</h2>
                    <p style={{whiteSpace:'pre-wrap'}}>{empleo.requisitos}</p>
                </div>
                <hr/>
                <div>
                    <h3>CIUDAD</h3>
                    <p>{empleo.ciudad}</p>
                </div>
                <hr/>
                <div>
                    <h3>UBICACION</h3>
                    <p>{empleo.ubicacion?empleo.ubicacion:"No Definido"}</p>
                </div>
                <hr/>
                <div>
                    <h3>SALARIO</h3>
                    <p>{empleo.salario||"No definido"}</p>
                </div>
                <hr/>
                <div>
                    <h3>MODALIDAD</h3>
                    <p>{empleo.modalidad}</p>
                </div>
                <hr/>
                <div>
                        <h3>NUMERO DE TELEFONO</h3>
                        <p>{empleo.num_telf}</p>
                </div>
                <hr/>
                <div className="buttons justify-content-center pb-5">
                    <Link href={`https://wa.me/${empleo.num_telf}`} target="_blank" className="btn text-success">
                    <i className="bi bi-whatsapp icon whatsapp"></i>
                    </Link>

                    <button  className={`btn`}
                    onClick={()=>{
                        setFavorito();
                    }}><i className={`bi bi-bookmark-heart icon favorito ${isFavorito?"set-fav":"del-fav"}`}></i></button>
                    
                    <button 
                        className="btn text-primary"
                        onClick={() => setShowShareModal(true)}
                    >
                        <i className="bi bi-share-fill icon share"></i>
                    </button>
                </div>
            </div>
        </div>
        <Modal_Share showShareModal={showShareModal} setShowShareModal={setShowShareModal} tipo={"empleo"} data={empleo}/>
    </section>
    );
}