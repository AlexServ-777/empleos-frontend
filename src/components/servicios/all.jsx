"use client"
import React, {useContext, useEffect, useRef, useState } from "react";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import OneServicio from "./one";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";

export default function MostrarServicios({servicios}){
    const {csrf} = useContext(Context)

    const [showServicio, setShowServicio] = useState({});
    const [favorito, setFavorito] = useState(false);
    
    const [filteredServicios, setFilteredServicios] = useState([]);
    const [filters, setFilters] = useState({
        category: [],
        modalidad: [],
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
        let filtered = [...servicios];

        // Aplicar búsqueda por texto
        if (searchTerm) {
            filtered = filtered.filter(servicio => 
                servicio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.category.length > 0) {
            filtered = filtered.filter(servicio => 
                filters.category.includes(servicio.categoria)
            );
        }

        if (filters.modalidad.length > 0) {
            filtered = filtered.filter(servicio => 
                filters.modalidad.includes(servicio.modalidad)
            );
        }

        if (filters.ubicacion) {
            filtered = filtered.filter(servicio => 
                servicio.ciudad.toLowerCase().includes(filters.ubicacion.toLowerCase()) ||
                (servicio.ubicacion && servicio.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()))
            );
        }

        setFilteredServicios(filtered);
    };

    const clearFilters = () => {
        setFilters({
            category: [],
            modalidad: [],
            ubicacion: '',
            search: ''
        });
        setFilteredServicios(servicios??[]);
    };
    const get_is_favorite=async()=>{
        const servicio = showServicio;
        if(!servicio.id_servicio) return;
        try{
        const response = await fetch(urlBackGlobal+'/api/usuarios-c/isFavorito',{
            method:'POST',credentials:'include',
            headers:{
                'x-csrf-token':csrf,
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id_recurso:servicio.id_servicio,
                tipo_recurso:'servicio',
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
        if(csrf) setShowServicio(servicios[0]);
    },[csrf])
    useEffect(()=>{
        get_is_favorite();
    },[showServicio])
    return (
        <section className="all-items">
            <div className="search-filters-container row mb-2">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar servicios..." />
                </div>
                <div className="col-md-6 col-12">                
                    <Filters type="servicios" onFilterChange={handleFilterChange} />
                </div>
            </div>
            <div className="containerUl">
            <ul>
                {filteredServicios.map((servicio) => (
                    <React.Fragment key={servicio.id_servicio}>
                        <li onClick={()=>{
                            setShowServicio(servicio);
                        }}>
                            <div className="row-cols-12 row-cols-md-12 g-4 mb-2">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body text-white">
                                            <div className="content">
                                                <h5 className="card-title">
                                                    {servicio.titulo}
                                                </h5>
                                                <p className="card-text">Precio: {servicio.precio}</p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {servicio.descripcion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
            <OneServicio servicio={showServicio} favorito={favorito} setFavorito={setFavorito}/>
            </div>
        </section>
    );
}