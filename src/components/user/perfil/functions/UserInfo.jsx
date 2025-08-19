"use client"
import React, { useContext, useRef } from 'react';
import { Context } from '@/app/providers';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { urlBackGlobal } from '@/constants/urls';
import AccountActions from './AccountActions';

export default function UserInfo({ userInf }) {
    const router = useRouter();
    const {csrf } = useContext(Context);
    const formUpdate = useRef();
    const urlBack = urlBackGlobal;

    const editarUsuario = async () => {
        if (!formUpdate.current.reportValidity()) return;
        const formUpdateData = new FormData(formUpdate.current);
        const data = Object.fromEntries(formUpdateData.entries());
        try {
            const response = await fetch(urlBack + "/api/usuarios-c/modificar", {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token": csrf,
                },
                credentials: 'include',
            });
            const dataResponse = await response.json();
            if (response.ok) {
                await Swal.fire({
                    title: "DATOS ACTUALIZADOS",
                    text: "",
                    icon: "success",
                })
                router.push(router.asPath);
            }
            if(response.status===409){
                await Swal.fire({
                    title: dataResponse.message,
                    icon:'warning'
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor",
                icon: "error",
            });
        }
    }

    return (
        <>
        <form className="text-white row gap-3" ref={formUpdate} >
            <div className="">
                <input name="id_usuario" defaultValue={userInf.id_usuario} disabled hidden />
            </div>
            <div className='col-12'>
                <hr/>
            </div>
            <h3>INFORMACION</h3>
            <div className="col-md-5 gap-3">
                <label className="my-auto">NOMBRE</label>
                <input defaultValue={userInf.nombre} maxLength="50" className="form-control my-auto" name="nombre" required />
            </div>
            <div className="col-md-5  gap-3">
                <label className="text-center my-auto">APELLIDO</label>
                <input defaultValue={userInf.apellido} className="form-control my-auto" name="apellido" required maxLength="50" />
            </div>
            <div className="col-md-4  gap-3">
                <label className="text-start my-auto">NOMBRE DE USUARIO</label>
                <input defaultValue={userInf.nom_usuario} className="form-control my-auto" name="nom_usuario" required maxLength="50" />
            </div>
            <div className="col-md-6 gap-3">
                <label className="text-start my-auto">CORREO ELECTRONICO</label>
                <input className="form-control my-auto" defaultValue={userInf.email} name="email" required maxLength="50" />
            </div>
            <div className="col-md-3 col-6 gap-3">
                <label className="my-auto text-center">Pais</label>
                <input className="form-control my-auto bg-dark" defaultValue={userInf.pais} disabled required/>
            </div>
            <div className="col-md-3 col-5 gap-3">
                <label className="my-auto">TIPO</label>
                <select className="form-select my-auto" defaultValue={userInf.rol} name="rol" required>
                    <option value="usuario">USUARIO</option>
                    <option value="empresa">EMPRESA</option>
                </select>
            </div>
            <div className="col-md-6 col-8 row mx-auto">
                <button className="btn btn-success" onClick={(e) => {
                    e.preventDefault();
                    editarUsuario();
                }}>
                    GUARDAR CAMBIOS
                </button>
            </div>
            <div className='col-12'>
                <hr/>
            </div>
        </form>
        <AccountActions/>
    </>
    );
} 