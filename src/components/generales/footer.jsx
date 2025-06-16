'use client';

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";

export default function Footer() {
    const [pais, setPais] = useState('Chile');
    useEffect(() => {
        const country = Cookies.get('country');
        setPais(country);
    }, [])
    return (
        <footer className="footer">
            <div className="sub-foot d-flex container">
                <div className="box row mx-auto">
                    <ul className="col-12 col-md-6">
                        <li><Link href={'/about/support'}>SOPORTE TECNICO</Link></li>
                        <li><Link href={'/about/contactDev'}>CONTACAR DESARROLLADOR</Link></li>
                    </ul>
                    <ul className="col-12 col-md-6">
                        <li><Link href={'/empleos/new'}>PUBLICAR EMPLEO</Link></li>
                        <li><Link href={'/pasantia/new'}>PUBLICAR PASANTIA</Link></li>
                        <li><Link href={'/servivios/new'}>PUBLICAR SERVICIO</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center">
                <span>© 2025 Copyright: AlexServCorp</span>
                <a href="https://jobget.vercel.app/">JobGet-Lat.com</a>
            </div>
            
            <p>PAIS: <Flag code={pais.slice(0,2)} style={{width:'1.5rem'}}/></p>
        </footer>
    );
}