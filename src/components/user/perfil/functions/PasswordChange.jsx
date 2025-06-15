"use client"
import React, { useContext, useRef } from 'react';
import { Context } from '@/app/providers';
import Swal from "sweetalert2";
import { urlBackGlobal } from '@/constants/constants_backend';
import Link from 'next/link';

export default function PasswordChange() {
    const { csrf } = useContext(Context);
    const formPass = useRef();
    const urlBack = urlBackGlobal;

    const cambiarContrasena = async () => {
        if (!formPass.current.reportValidity()) return;
        const formData = new FormData(formPass.current);
        const datosForm = Object.fromEntries(formData.entries());
        if (datosForm.newPass !== datosForm.newPassConfirm) {
            await Swal.fire({
                title: "LAS NUEVAS CONTRASENAS NO COINCIDEN",
                text: "",
                icon: "warning",
            });
            return;
        }
        try {
            const response = await fetch(urlBack + "/api/usuarios-c/changePassword", {
                method: "PUT",
                body: JSON.stringify(datosForm),
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token":csrf
                },
                credentials:"include"
            });
            const data = await response.json();
            if (data.message === "exito") {
                await Swal.fire({
                    title: "Contrasena cambiada",
                    text: "",
                    icon: "success",
                });
            } else {
                await Swal.fire({
                    title: "Contrasena actual incorrecta",
                    text: "",
                    icon: "error",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "ERROR DE CONEXIÓN",
                text: "No se pudo conectar con el servidor",
                icon: "error",
            });
            console.error(error);
        }
    }

    return (
        <>
        <form className="text-white row" ref={formPass}>
            <div className="col-md-12">
                <hr/>
            </div>
            <h3 className="col-md-12 col-12 mb-4">CAMBIAR CONTRASENA</h3>
            <div className="col-md-4 col-12 mb-4">
                <label className="my-auto">CONTRASENA ACTUAL</label>
                <input className="form-control my-auto" name="oldPass" type="password" required maxLength="100"/>
            </div>
            <div className="col-md-4 col-12  mb-4">
                <label className="my-auto">NUEVA CONTRASENA</label>
                <input className="form-control my-auto" name="newPass" type="password" required minLength="8" maxLength="100" />
            </div>
            <div className="col-md-4 col-12 mb-4">
                <label className="my-auto">CONFIRMAR CONTRASENA</label>
                <input className="form-control my-auto" name="newPassConfirm" type="password" required minLength="8" maxLength="100"/>
            </div>
            <div className="col-8 col-md-4 row mx-auto">
                <button className="btn btn-primary" onClick={(e) => {
                    e.preventDefault();
                    cambiarContrasena();
                }}>
                    CAMBIAR CONTRASENA
                </button>
                <p className='p-0'>Olvidate tu contraseña? <Link href={""}>Reestablecer</Link></p>
            </div>
        </form>
        <hr/>
        </>
    );
} 