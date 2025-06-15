"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";
import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/SEO";

export default function OneEmpleo({empleo,favorito}){
    const urlBack = urlBackGlobal;
    const router = useRouter();
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

    const handleShare = async (platform) => {
        const url = window.location.href;
        const text = `¡Mira este empleo: ${empleo.titulo} en ${empleo.ciudad}!`;

        switch(platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('¡Enlace copiado al portapapeles!');
                } catch (err) {
                    console.error('Error al copiar:', err);
                }
                break;
        }
        setShowShareModal(false);
    };//funcion del modal para compartir la pagina
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
    <>
    <SEO title={`${empleo.titulo} | ${empleo.ciudad}`} description={empleo.descripcion} keywords="empleo, trabajo, pasantia,servicio" url={router.asPath}/>
    <section className="container text-black p-5 containerOne h-auto mb-5" style={{marginTop:"2%"}}>
        <div className="row pt-4 w-100 h-100">
            <div className="image my-auto text-center col-md-6 col-12">
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
            <div className="content col-md-6 col-12">
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
                <div className="buttons justify-content-center row container pb-5">
                    <Link href={`https://wa.me/${empleo.num_telf}`} target="_blank" className="btn text-success col-md-3 col-3">
                    <i className="bi bi-whatsapp icon"></i>
                    </Link>
                    <button  className={`btn ${isFavorito?"text-danger":"text-warning"} col-md-3 col-3`}
                    onClick={()=>{
                        setFavorito();
                    }}><i className="bi bi-bookmark-heart icon"></i></button>
                    
                    <button 
                        className="btn text-primary col-md-3 col-3"
                        onClick={() => setShowShareModal(true)}
                    >
                        <i className="bi bi-share-fill icon"></i>
                    </button>
                </div>
            </div>
        </div>

        {/* Modal de Compartir */}
        {showShareModal && (
            <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
                <div className="share-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-share-fill"></i>
                            Compartir Empleo
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={() => setShowShareModal(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="share-options">
                            <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                                <i className="bi bi-whatsapp"></i>
                                <span>WhatsApp</span>
                            </button>
                            <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                                <i className="bi bi-facebook"></i>
                                <span>Facebook</span>
                            </button>
                            <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                                <i className="bi bi-twitter-x"></i>
                                <span>Twitter</span>
                            </button>
                            <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                                <i className="bi bi-linkedin"></i>
                                <span>LinkedIn</span>
                            </button>
                            <button onClick={() => handleShare('copy')} className="share-btn copy">
                                <i className="bi bi-link-45deg"></i>
                                <span>Copiar Enlace</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </section>
    </>
    );
}

export async function getServerSideProps(context){
    const {id} = await context.query; //obtener el id de la url

    const resToken = await fetch(process.env.url_front+"/back/api/auth/csrf-token",{
        headers:{
            Cookie:context.req.headers.cookie
        }
    }); //obtener el token csrf de nuevo ya que el que esta en httponly da error pq pertenece al del lado del cliente
    const {token:csrfToken} = await resToken.json();

    const response = await fetch(process.env.url_front+"/back/api/empleos-c/infoEmpleo/"+id);//obtener los datos del empleo
    const data = await response.json();

    const initFavorito = async(empleo)=>{ //verificar si este empleo es favorito. return: true o false
        const response = await fetch(process.env.url_front+"/back/api/usuarios-c/isFavorito",{
            method:"POST",
            body:JSON.stringify({
                id_recurso:empleo.id_empleo,
                tipo_recurso:"empleo"
            }),
            headers:{
                "Content-Type":"application/json",
                "X-XSRF-Token": csrfToken,
                "Cookie":context.req.headers.cookie
            }
        });
        const dataFav = await response.json();
        return dataFav;
    }
    const isFavorito=await initFavorito(data);
    return {
        props:{
            empleo:data,
            favorito:isFavorito
        }
    };
}