"use client";

import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";
import { useContext, useEffect, useRef, useState } from "react";

export default function Reports() {
    const { reportData, setReportData, csrf } = useContext(Context);
    const report_ref = useRef(null);
    const form_ref = useRef(null);
    const [selected, setSelected] = useState('');
    const type_comment_reports = ['ESTAFA_O_FRAUDE', 'PUBLICACION_FALSA', 'PUBLICACION_CADUCADA', 'OTRO'];
    useEffect(() => {
        if (reportData.show == true) {
            report_ref.current.classList.add('show');
        } else {
            report_ref.current.classList.remove('show');
        }
    }, [reportData.show])

    const send_report=async(e)=>{
        e.preventDefault();
        if(!form_ref.current.reportValidity()) {alert('seleccione una opcion'); return};
        const form_data = new FormData(form_ref.current);
        const data = Object.fromEntries(form_data.entries());
        const body = {
            ...reportData,
            message:data.report,
        };
        delete body.show;
        //fetch
        const res = await fetch(urlBackGlobal+'/api/reports/set-report',{
            method:'POST', credentials:'include',
            headers:{
                'Content-Type':'application/json',
                'x-csrf-token':csrf
            },
            body:JSON.stringify(body)
        })
        if(res.ok){alert('reportado exito'); return;}
        else{alert('error'); return;}
    }
    return (
        <div className={`reports_container`} ref={report_ref}>
            <form ref={form_ref}>
                <button onClick={(e)=>{
                    e.preventDefault();
                    setReportData({show:false})
                }} className="btn-close">
                    <i className="bi bi-x-circle-fill"></i>
                </button>
                <div className="radio-buttons-container">
                    {type_comment_reports.map((item, i) => (
                        <div className="radio-button" key={i}>
                            <input name="report" id={i.toString()} className="radio-button__input" type="radio" required onChange={(e)=>setSelected(e.target.value)} defaultValue={item}/>
                            <label htmlFor={i.toString()} className="radio-button__label">
                                <span className="radio-button__custom"></span>
                                {item.replace(/_/g, ' ')}
                            </label>
                        </div>
                    ))}
                </div>
                <textarea name="report" className="form-control" maxLength={100} disabled={selected=='OTRO'?false:true} required/>
                <button className="fancy" type="button" onClick={(e)=>{
                    send_report(e);
                }}>
                    <span className="top-key"></span>
                    <span className="text">REPORTAR</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </button>
            </form>
        </div>
    )

}