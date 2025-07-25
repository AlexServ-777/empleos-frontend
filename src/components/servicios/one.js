"use client"
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";
import Modal_Share from "../generales/modal-share";

export default function OneServicio({servicio, favorito}){
    const {setAlertData,csrf} = useContext(Context);
    const [image, setImage] = useState("");
    const [isFavorito,setIsFavorito] = useState(favorito);
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(()=>{
        const obtenerImagenes = async () => {
            try {
                const response = await fetch(`/api/listFiles?categoria=${servicio.categoria}`);
                const data = await response.json();
                setImage(data.image);
                document.getElementsByClassName('imgPrincipal')[0].classList.add('show');
            } catch (error) {
                console.error("Error al obtener imágenes:", error);
            }
        }
        obtenerImagenes();
    },[servicio.categoria])
    

    const setFavorito = async()=>{
        const response = await fetch(urlBackGlobal+"/api/usuarios-c/setFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:servicio.id_servicio,
                tipo_recurso:"servicio"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf
            },
            credentials:"include"
        });
        const data = await response.json();
        if(data.statusCode === 400){
            const res2 = await fetch(urlBackGlobal+"/api/usuarios-c/deleteFavorito/"+data.id_favorito,{
                method:"DELETE",
                headers:{
                    "X-XSRF-Token":csrf
                },
                credentials:"include"
            });
            const data2 = await res2.json();
            if(res2.ok){
                setAlertData({
                    show:"flex",message:data2.message, type:"danger"
                })
                setIsFavorito(false);
            }
        }
        if(data.statusCode===200){
            setAlertData({
                show:"flex", message:data.message, type:"success"
            })
            setIsFavorito(true);
        }
    }

    return (
        <section className="container text-white p-5 mb-5 containerOne h-auto" style={{marginTop:"2%"}}>
            <div className="pt-4  h-100 row">
                <div className="image my-auto text-center col-md-6 col-12">
                    <h1 className="tittle mb-3">{servicio.titulo}</h1>
                    <img
                        src={image||"/imagesCategorias/OTROS.jpg"}
                        style={{ maxWidth: "90%"}}
                        className="imgPrincipal"
                    />
                    <h2 className="mt-3">{servicio.categoria}</h2>
                </div>
                <div className="col-md-6 col-12">
                    <div className="descripcion">
                        <h2>DESCRIPCION</h2>
                        <p style={{whiteSpace:"pre-wrap"}}>{servicio.descripcion}</p>
                    </div>
                    <hr/>
                    <div className="col-12">
                        <h2>PRECIO</h2>
                        <p>{servicio.precio}</p>
                    </div>
                    <hr />
                    <div>
                        <h3>CIUDAD</h3>
                        <p>{servicio.ciudad}</p>
                    </div>
                    <hr />
                    <div>
                        <h3>UBICACION</h3>
                        <p>{servicio.ubicacion ? servicio.ubicacion : "No Definido"}</p>
                    </div>
                    <hr />

                    <div>
                        <h3>MODALIDAD</h3>
                        <p>{servicio.modalidad}</p>
                    </div>
                    <hr/>
                    <div>
                        <h3>NUMERO DE TELEFONO</h3>
                        <p>{servicio.num_telf}</p>
                    </div>
                    <hr />
                    <div className="buttons justify-content-center pb-5">
                        {/*Aqui faltan algunos atributos de la db */}
                        <Link href={"https://wa.me/"+servicio.num_telf} target="_blank" className="btn text-success">
                            <i className="bi bi-whatsapp icon whatsapp"></i>
                        </Link>
                        <button className={`btn`}
                        onClick={()=>setFavorito()}>
                            <i className={`bi bi-bookmark-heart icon favorito ${isFavorito?"set-fav":"del-fav"}`}></i>
                        </button>
                        <button className="btn text-primary " onClick={()=>setShowShareModal(true)}>
                            <i className="bi bi-share-fill icon share"></i>
                        </button>
                    </div>
                </div>
            </div>
            <Modal_Share showShareModal={showShareModal} setShowShareModal={setShowShareModal} tipo={"servicio"} data={servicio}/>
        </section>
    );
}