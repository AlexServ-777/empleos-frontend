"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useRef } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import GoogleLoginButton from "@/components/user/perfil/functions/googleButtonLogin";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/constants_backend";

export default function Login() {
    const {setSession } = useContext(Context);
    const router = useRouter();
    const formRef = useRef();
    const { csrf } = useContext(Context);
    const loginUser = async () => {
        //validar y obtener datos del formulario
        if (!formRef.current.reportValidity()) { return; }
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        //logear usuario
        const response = await fetch(urlBackGlobal + "/api/auth/login", {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': csrf,
            }
        });
        if (response.ok) {
            setSession(true);
            await Swal.fire({
                title: "SESIÓN INICIADA",
                text: "",
                icon: "success"
            });
            router.push('/');
        }
        if(response.status===404){
            await Swal.fire({
                title: "Correo o Contraseña Incorrectos",
                text: "",
                icon: "error"
            });
        }
    }
    return (
        <section className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <form className="login-form" autoComplete="off" ref={formRef}>
                <h1 style={{ fontWeight: "bold" }} className="text-dark">Iniciar Sesión</h1>

                <div className="inputb">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        required
                        className="forminput"
                        type="email"
                        id="email"
                        name="email"
                        onFocus={(e) => e.target.classList.add("focus")}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                e.target.classList.remove("focus");
                            }
                        }}
                    />
                    <span data-placeholder-1="Correo Electrónico" data-placeholder-2="Correo Electrónico:"></span>
                </div>

                <div className="inputb">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        required
                        className="forminput hide-pwd"
                        type="password"
                        id="password"
                        name="password"
                        onFocus={(e) => e.target.classList.add("focus")}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                e.target.classList.remove("focus");
                            }
                        }}
                    />
                    <span data-placeholder-1="Contraseña" data-placeholder-2="Contraseña:"></span>
                </div>
                <button
                    className="loginbtn"
                    onClick={(e) => {
                        e.preventDefault();
                        loginUser();
                    }}
                >
                    INICIAR SESIÓN
                </button>
                <GoogleLoginButton/>

                <div className="bottom-text">
                    <span className="forgotpwd">
                        ¿Olvidaste tu contraseña?{" "}
                        <a className="link" style={{cursor:'pointer'}} onClick={()=>{
                            Swal.fire({
                                text:`Por ahora no tenemos una restauracion de contraseñas automatizadas, pero lo implementaremos lo antes posible.
                                Por favor tenga paciencia y contacte con soporte tecnico para reestablcer su contraseña. Se le dara una respuesta lo antes posible. O puede probar a iniciar sesion con Google`
                                ,icon:'info'
                            })
                        }}>
                            Restablecer
                        </a>
                    </span>
                    <span className="signup">
                        ¿No tienes una cuenta?
                        <Link className="link" href="/user/register">
                            Registrarse
                        </Link>
                    </span>
                </div>
            </form>
        </section>
    );
}
