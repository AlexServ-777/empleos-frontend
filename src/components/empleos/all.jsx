"use client"
import React, { useContext, useEffect, useState } from "react";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import OneEmpleo from "./one";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";

export default function MostrarEmpleos({empleos}){
    const {csrf} = useContext(Context);
    const [showEmpleo, setShowEmpleo] = useState({});
    const [favorito, setFavorito] = useState(false);

    const [filteredEmpleos, setFilteredEmpleos] = useState([]);
    const [filters, setFilters] = useState({
        category: [],
        modalidad: [],
        salarioMin: '',
        salarioMax: '',
        ubicacion: '',
        search: ''
    });
    const handleSearch = (searchTerm) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm
        }));
        applyFilters(searchTerm);
    };

    const handleFilterChange = (type, value) => {
        if (type === 'category' || type === 'modalidad') {
            setFilters(prev => ({
                ...prev,
                [type]: prev[type].includes(value)
                    ? prev[type].filter(item => item !== value)
                    : [...prev[type], value]
            }));
        } else if (type === 'apply') {
            applyFilters();
        } else if (type === 'clear') {
            clearFilters();
        } else {
            setFilters(prev => ({
                ...prev,
                [type]: value
            }));
        }
    };

    const applyFilters = (searchTerm = filters.search) => {
        let filtered = [...empleos];

        // Aplicar búsqueda por texto
        if (searchTerm) {
            filtered = filtered.filter(empleo => 
                empleo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                empleo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.category.length > 0) {
            filtered = filtered.filter(empleo => 
                filters.category.includes(empleo.categoria)
            );
        }

        if (filters.modalidad.length > 0) {
            filtered = filtered.filter(empleo => 
                filters.modalidad.includes(empleo.modalidad)
            );
        }

        if (filters.salarioMin) {
            filtered = filtered.filter(empleo => 
                parseInt(empleo.salario) >= parseInt(filters.salarioMin)
            );
        }

        if (filters.salarioMax) {
            filtered = filtered.filter(empleo => 
                parseInt(empleo.salario) <= parseInt(filters.salarioMax)
            );
        }

        if (filters.ubicacion) {
            filtered = filtered.filter(empleo => 
                empleo.ciudad.toLowerCase().includes(filters.ubicacion.toLowerCase()) ||
                (empleo.ubicacion && empleo.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()))
            );
        }

        setFilteredEmpleos(filtered);
    };

    const clearFilters = () => {
        setFilters({
            category: [],
            modalidad: [],
            salarioMin: '',
            salarioMax: '',
            ubicacion: '',
            search: ''
        });
        setFilteredEmpleos(empleos??[]);
    };
    const get_is_favorite=async()=>{
        const empleo = showEmpleo;
        if(!empleo.id_empleo) return;
        try{
        const response = await fetch(urlBackGlobal+'/api/usuarios-c/isFavorito',{
            method:'POST',credentials:'include',
            headers:{
                'x-csrf-token':csrf,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id_recurso:empleo.id_empleo,
                tipo_recurso:'empleo',
            })
        })
        if(response.ok){
            const isFav = await response.json();
            setFavorito(isFav);
        }
        else{
            console.log('failed get favorite');
            setFavorito(false);
        }}
        catch(err){console.error(err)}
    }
    useEffect(()=>{
        if(csrf) {setShowEmpleo(empleos[0])};
    },[csrf]);
    useEffect(()=>{
        get_is_favorite();
    },[showEmpleo])
    return (
        <section className="all-items">
            <div className="search-filters-container row mb-2">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar empleos..."/>
                </div>
                <div className="col-md-6 col-12">
                    <Filters type="empleos" onFilterChange={handleFilterChange} />
                </div>
            </div>
            <div className="containerUl">
                <ul>
                {filteredEmpleos.map((empleo) => (
                    <React.Fragment key={empleo.id_empleo}>
                        <li onClick={()=>{
                            setShowEmpleo(empleo);
                        }}>
                            <div className="row-cols-12 row-cols-md-12">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body text-white">
                                            <div className="content">
                                                <h5 className="card-title">
                                                    {empleo.titulo}
                                                </h5>
                                                <p className="card-text">Salario: {empleo.salario}</p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {empleo.descripcion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <hr />
                    </React.Fragment>
                ))}
                </ul>
                <OneEmpleo empleo={showEmpleo} favorito={favorito} setFavorito={setFavorito} />
            </div>
        </section>
    );
}