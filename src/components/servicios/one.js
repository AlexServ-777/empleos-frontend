"use client"
import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";
import SEO from "@/components/SEO";

export default function OneServicio({servicio, favorito}){
    const router = useRouter();
    const {id} = router.query;
    const {setAlertData,csrf} = useContext(Context);
    const [image, setImage] = useState("");
    const [isFavorito,setIsFavorito] = useState(favorito);

    const obtenerImagenes = useCallback(async () => {
        try {
            const response = await fetch(`/api/listFiles?categoria=${servicio.categoria}`);
            const data = await response.json();
            setImage(data.image);
            document.getElementsByClassName('imgPrincipal')[0].classList.add('show');
        } catch (error) {
            console.error("Error al obtener imágenes:", error);
        }
    }, [servicio.categoria]);

    const handleFavorito = async () => {
        try {
            const response = await fetch(`${urlBackGlobal}/favoritos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({
                    idServicio: servicio.id
                })
            });
            const data = await response.json();
            if(data.status === 'success'){
                setIsFavorito(!isFavorito);
                setAlertData({
                    show: true,
                    message: isFavorito ? 'Servicio eliminado de favoritos' : 'Servicio añadido a favoritos',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error("Error al manejar favorito:", error);
        }
    }

    useEffect(() => {
        if(!id) return;
        obtenerImagenes();
    }, [id, obtenerImagenes]);

    return (
        <>
        <SEO title={`${servicio.titulo} | ${servicio.ciudad}`} description={servicio.descripcion} keywords={'servicios,trabajos, necesidad, busco'} url={router.asPath}/>
        <section className="container text-black p-5 mb-5 containerOne h-auto">
            <div className="row pt-4 h-100 pb-5 p-0">
                <div className="image my-auto text-center col-md-6 col-12">
                    <h1 className="tittle mb-3">{servicio.titulo}</h1>
                    <Image
                        src={image||'/imagesCategorias/OTROS.jpg'}
                        alt={`Imagen de ${servicio.categoria}`}
                        width={500}
                        height={300}
                        className="imgPrincipal"
                        style={{maxWidth:"90%", height:"auto"}}
                    />
                    <h2 className="mt-3">{servicio.categoria}</h2>
                </div>
                <div className="col-md-6 col-12 my-auto">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="mb-3">Descripción</h3>
                            <p className="mb-4">{servicio.descripcion}</p>
                        </div>
                        <div className="col-12">
                            <h3 className="mb-3">Ubicación</h3>
                            <p className="mb-4">{servicio.ciudad}</p>
                        </div>
                        <div className="col-12">
                            <h3 className="mb-3">Precio</h3>
                            <p className="mb-4">{servicio.precio}€</p>
                        </div>
                        <div className="col-12">
                            <h3 className="mb-3">Contacto</h3>
                            <p className="mb-4">{servicio.contacto}</p>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={handleFavorito}>
                                {isFavorito ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}

export async function getServerSideProps(context) {
    const {id} = await context.query;

    const csrfResponse = await fetch(process.env.url_front+"/back/api/auth/csrf-token",{
        headers:{Cookie:context.req.headers.cookie}
    });
    const {token:csrf} = await csrfResponse.json();
    
    //getServicio
    const response = await fetch(process.env.url_front+"/back/api/servicios-c/getServicioOne/"+id);
    const data = await response.json();

    const initFavorito = async(servicio)=>{
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/isFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:servicio.id_servicio,
                tipo_recurso:"servicio"
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

    const isFavorito = await initFavorito(data);
    return{
        props:{servicio:data, favorito:isFavorito}
    }
}