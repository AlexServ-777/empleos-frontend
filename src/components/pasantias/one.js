"use client";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/constants_backend";
import Image from "next/image";

export default function OnePasantias({pasantia,favorito}){
    const urlBack = urlBackGlobal;
    const {csrf, setAlertData} = useContext(Context);
    const [image, setImage] = useState("");
    const [isFavorito, setIsFavorito] = useState(favorito);

    const setFavorito = async()=>{
        const response = await fetch(urlBack+"/api/usuarios-c/setFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:pasantia.id_pasantia,
                tipo_recurso:"pasantia"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf
            },
            credentials:"include"
        });
        const data = await response.json();
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

    useEffect(()=>{
        const obtenerImagenes = async () => {
            try {
                const response = await fetch(`/api/listFiles?categoria=${pasantia.categoria}`);
                const data = await response.json();
                setImage(data.image);
                document.getElementsByClassName('imgPrincipal')[0].classList.add('show');
            } catch (error) {
                console.error("Error al obtener imágenes:", error);
            }
        }
        obtenerImagenes();
    },[pasantia.categoria]); //obtener la lista de imagenes existentes 

    return(
        <section className="container text-white p-5 containerOne h-auto mb-5" style={{marginTop:"2%"}}>
          <div className="pt-4  h-100 row">
            <div className="image my-auto text-center col-12 col-md-6 p-0">   
                <h1 className="tittle mb-3">{pasantia.titulo}</h1>
                <Image 
                    src={image||'/imagesCategorias/OTROS.jpg'} 
                    alt={`Imagen de ${pasantia.categoria}`}
                    width={500}
                    height={300}
                    className="imgPrincipal"
                    style={{maxWidth:"90%", height:"auto"}}
                />
                <h2 className="mt-3">{pasantia.categoria}</h2>
            </div>
            <div className="col-md-6 col-12 p-0">
                <div className="descripcion">
                    <h2>DESCRIPCION</h2>
                    <p style={{whiteSpace:'pre-wrap'}}>{pasantia.descripcion}</p>
                </div>
                <hr/>
                <div>
                    <h2>REQUISITOS</h2>
                    <p style={{whiteSpace:'pre-wrap'}}>{pasantia.requisitos}</p>
                </div>
                <hr/>
                <div>
                    <h3>CIUDAD</h3>
                    <p>{pasantia.ciudad}</p>
                </div>
                <hr/>
                <div>
                    <h3>UBICACION</h3>
                    <p>{pasantia.ubicacion?pasantia.ubicacion:"No Definido"}</p>
                </div>
                <hr/>

                <div>
                    <h3>MODALIDAD</h3>
                    <p>{pasantia.modalidad}</p>
                </div>
                <hr/>
                <div>
                    <h3>DURACION</h3>
                    <p>{pasantia.duracion}</p>
                </div>
                <hr/>
                <div>
                    <h3>FECHA DE INICIO - FECHA FIN</h3>
                    <p>{new Date(pasantia.fecha_inicio).toLocaleDateString()} - {new Date(pasantia.fecha_fin).toLocaleDateString()}</p>
                </div>
                <hr/>
                <div>
                        <h3>NUMERO DE TELEFONO</h3>
                        <p>{pasantia.num_telf}</p>
                </div>
                <hr/>
                <div className="buttons justify-content-center pb-5">
                    {/*Aqui faltan algunos atributos de la db */}
                    <button  className="btn text-success"><i className="bi bi-whatsapp icon"></i></button>
                    <button  className={`btn ${isFavorito?"text-danger":"text-warning"}`} onClick={setFavorito}><i className="bi bi-bookmark-heart icon"></i></button>
                    <button className="btn text-primary"><i className="bi bi-share-fill icon"></i></button>
                </div>
            </div>
        </div>
        </section>
    );
}