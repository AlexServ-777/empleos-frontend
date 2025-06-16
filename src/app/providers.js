"use client";
import NavBar from "@/components/generales/navBar";
import { urlBackGlobal } from "@/constants/constants_backend";
import React, { useState, createContext, useEffect } from "react";
import "@/utils/interceptorFETCH";
import AlertMessage from "@/components/generales/alertMessage";
import Footer from "@/components/generales/footer";

export const Context = createContext();

export function Providers({ children }) {
    const [session, setSession] = useState(false);
    const [csrf, setCsrf] = useState('');
    const [alertData, setAlertData] = useState({
        message: null,
        type: "success",
        show: "none"
    })  //alerta pequena

    useEffect(() => {
        // Importar Bootstrap solo en el cliente
        import('bootstrap/dist/js/bootstrap.bundle.min.js');

        document.documentElement.setAttribute('data-bs-theme', 'dark');

        const verificarToken = async () => {
            const res = await fetch(urlBackGlobal + '/api/auth/verificar-token', { credentials: 'include' });
            if (res.ok) { setSession(true); }
            else { setSession(false); }
        }
        verificarToken();
        const obtenerCSRF = async () => {
            try {
                const response = await fetch(urlBackGlobal + "/api/auth/csrf-token", {
                    credentials: 'include'
                });
                const data = await response.json();
                setCsrf(data.token);
            } catch (error) {
                console.log("No se pudo validar el csrf" + error);
            }
        }
        obtenerCSRF();
    }, []);

    useEffect(() => {
        if (alertData.show === "none" && alertData.message != null) {
            setAlertData(prev => ({
                ...prev,
                show: "flex"
            }));
        }
    }, [alertData.message])
    useEffect(() => {
        if (alertData.show === "flex") {
            setTimeout(() => {
                setAlertData(prev => ({
                    ...prev,
                    show: "none"
                }))
            }, 3000);
        }
    }, [alertData.show])
    return (
        <Context.Provider value={{ session, setSession, csrf, setAlertData}}>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <NavBar />
                <div className='padd p-md-5 p-5'></div>
                <main style={{ flex: "1 0 auto" }}>
                    {children}
                </main>
                <Footer/>
            </div>

            <div className='overlayAlert' style={{ display: alertData.show }}>
                <AlertMessage message={alertData.message} type={alertData.type} />
            </div>
        </Context.Provider>
    );
}