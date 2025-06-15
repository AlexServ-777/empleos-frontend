"use client";
import React, { useContext } from 'react';
import { Context } from '@/app/providers';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { urlBackGlobal } from '@/constants/constants_backend';

export default function AccountActions() {
    const router = useRouter();
    const {csrf, setSession} = useContext(Context);
    const urlBack = urlBackGlobal;

    const cerrarSesion = async () => {
        const response = await fetch(urlBack+"/api/auth/logout",{
            method:"POST",
            headers:{
                "X-XSRF-Token":csrf,
            },
            credentials:"include"
        });
        if(response.ok){
            setSession(false);
            router.replace('/user/login');
        }
    }

    const eliminarUsuario = async () => {
            await Swal.fire({
                title: "SEGURO QUE DESEAS ELIMINAR TU CUENTA?",
                text: "No habra vuelta a tras despues de esta accion y tambien se eliminaran tus publicaciones",
                icon: "question",
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(urlBack + "/api/usuarios-c/eliminar", {
                            method: "DELETE",
                            headers: {
                                "X-XSRF-Token":csrf,
                            },
                            credentials:"include"
                        });
                        if (response.ok) {
                            await Swal.fire({
                                title: "CUENTA ELIMINADA",
                                text: "",
                                icon: "success"
                            });
                            cerrarSesion();
                        } else {
                            await Swal.fire({
                                title: "OCURRIO UN ERROR",
                                text: "Si el problema persiste contacte con soporte tecnico",
                                icon: "warning"
                            });
                        }
                    } catch (error) {
                        await Swal.fire({
                            title: "ERROR DE CONEXIÓN",
                            text: "No se pudo conectar con el servidor",
                            icon: "error"
                        });
                    }
                }
            });
        
    }

    return (
        <form>
            <div className='text-center' style={{display:"flex", gap:"5%", alignItems:"center", justifyContent:"center"}}>
                <button
                    type='button'
                    className="btn btn-warning wid-md-25"
                    onClick={async(e) => {
                        e.preventDefault();
                        await cerrarSesion()
                    }}
                >
                    CERRAR SESION
                </button>
                <button
                    type='button'
                    className="btn btn-danger wid-md-25"
                    onClick={async(e) => {
                    e.preventDefault();
                    await eliminarUsuario();
                }}>
                    ELIMINAR CUENTA
                </button>
            </div>
            <hr/>
        </form>
    );
} 