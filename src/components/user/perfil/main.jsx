"use client"
import React, { useState } from "react";
import UserInfo from "@/components/user/perfil/functions/UserInfo";
import PasswordChange from "@/components/user/perfil/functions/PasswordChange";
import Publications from "@/components/user/perfil/functions/Publications";
import Favorites from "@/components/user/perfil/functions/Favorites";
import { BarPefilMovil, BarPerfil } from "@/components/user/perfil/functions/bar";

export default function Perfil({userInf}) {
    const [seccion,setSeccion]= useState('INFORMACION');
    const [showMenu, setShowMenu] = useState('none');
    const renderSeccion=()=>{
        switch (seccion){
            case "INFORMACION":
                return (<UserInfo userInf={userInf}/>);
            case "SEGURIDAD":
                return (<PasswordChange/>);
            case "PUBLICACIONES":
                return (<Publications userInf={userInf}/>);
            case "FAVORITOS":
                return (<Favorites/>);
        }
    }
    return (
        <>
        <meta name="robots" content="noindex, nofollow" />
        <section style={{display:"flex"}}>
            <BarPerfil setSeccion={setSeccion}/>
            <div className="container perfil-container d-flex" style={{justifyContent:"center", alignItems:"center"}}>
                <div className="h-auto w-100">

                <menu className="menu d-md-none d-flex" onClick={()=>{
                    if(showMenu==='none'){
                        setShowMenu('flex')
                    }else{setShowMenu('none')};
                }}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </menu>
                    {renderSeccion()}
                </div>
            </div>
            <BarPefilMovil setSeccion={setSeccion} show={showMenu} setShow={setShowMenu}/>
        </section>
        </>
    );
    
}

//obtener los datos preparados cuando el cliente entre al perfil
