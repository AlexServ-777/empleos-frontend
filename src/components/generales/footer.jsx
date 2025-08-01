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
            <div className="sub-foot">
                    <ul className="d-flex gap-5">
                        <li><Link href={'/about/support'}>SOPORTE TECNICO</Link></li>
                        <li><Link href={'/about/contactDev'}>CONTACAR DESARROLLADOR</Link></li>
                    </ul>
            </div>
            <div className="text-center">
                <span>© 2025 Copyright: AlexServCorp</span>
                <a href="https://jobget.vercel.app/"> JobGet-Lat.com</a>
            </div>
            
            <p>PAIS: <Flag code={pais.slice(0,2)} style={{width:'1.5rem'}}/></p>
        </footer>
    );
}