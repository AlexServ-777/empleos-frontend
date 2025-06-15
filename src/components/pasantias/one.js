"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/constants_backend";
import Image from "next/image";

export default function OnePasantias({pasantia,favorito}){
    const urlBack = urlBackGlobal;
    const router = useRouter();
    const {id} = router.query; 
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
        if(!id)return;
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
    },[id, pasantia.categoria]); //obtener la lista de imagenes existentes 

    return(
        <>
        <SEO title={`${pasantia.titulo} | ${pasantia.ciudad}`} description={pasantia.descripcion} keywords='pasantia, trabajo, pruebas' url={router.asPath}/>
        <section className="container text-black p-5 mb-5 containerOne h-auto">
          <div className="row pt-4 w-100 h-100 pb-5 p-0">
            <div className="image my-auto text-center col-md-6 col-12">   
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
            <div className="content col-md-6 col-12">
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
                <div className="buttons justify-content-center row container">
                    {/*Aqui faltan algunos atributos de la db */}
                    <button  className="btn text-success col-md-3 col-3"><i className="bi bi-whatsapp icon"></i></button>
                    <button  className={`btn ${isFavorito?"text-danger":"text-warning"} col-md-3 col-3`} onClick={setFavorito}><i className="bi bi-bookmark-heart icon"></i></button>
                    <button className="btn text-primary col-md-3 col-3"><i className="bi bi-share-fill icon"></i></button>
                </div>
            </div>
        </div>
        </section>
        </>
    );
}

export async function getServerSideProps(context){
    const {id} = await context.query;
    const csrfResponse = await fetch(process.env.url_front+"/back/api/auth/csrf-token",{
        headers:{Cookie:context.req.headers.cookie}
    });
    const {token:csrf} = await csrfResponse.json();
    const response = await fetch(process.env.url_front+"/back/api/pasantias-c/getPasantia/"+id);
    const data = await response.json();

    const initFavorito = async(pasantia)=>{
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/isFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:pasantia.id_pasantia,
                tipo_recurso:"pasantia"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token":csrf,
                "Cookie":context.req.headers.cookie
            }
        });
        const isfav = await response.json();
        return isfav;
    }
    const isfavorito = await initFavorito(data); 
    return {
        props:{pasantia:data, favorito:isfavorito}
    };
}