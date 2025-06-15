"use client";
import NavBar from "@/components/generales/navBar";
import { urlBackGlobal } from "@/constants/constants_backend";
import React, { useState, createContext, useEffect } from "react";
import "@/utils/interceptorFETCH";

export const Context = createContext();

export function Providers({ children }) {
    const [session, setSession] = useState(false);
    const [csrf, setCsrf] = useState('');
    
    useEffect(() => {
        // Importar Bootstrap solo en el cliente
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        const verificarToken = async () => {
            const res = await fetch(urlBackGlobal+'/api/auth/verificar-token',{credentials:'include'});
            if(res.ok){setSession(true);}
            else{setSession(false);}
        }
        verificarToken();
        const obtenerCSRF=async()=>{
            try{
                const response = await fetch(urlBackGlobal+"/api/auth/csrf-token",{
                  credentials: 'include'
                });
                const data = await response.json();
                setCsrf(data.token);
            }catch(error){
              console.log("No se pudo validar el csrf"+error);
            }
        }
        obtenerCSRF();
    },[]);
    return (
        <Context.Provider value={{ session, setSession, csrf }}>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <NavBar />
            <div className='padd p-md-5 p-5'></div>
            <main style={{ flex: "1 0 auto" }}>
                {children}
            </main>
            </div>
        </Context.Provider>
    );
}