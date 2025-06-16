"use client"
import React, { useState } from "react";
import Link from "next/link";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import {useRouter } from "next/navigation";

export default function MostrarEmpleos({empleos}){
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
    const router = useRouter()
    return (
        <section className="all-items container mb-5" style={{height:"100%"}}>
            <div className="search-filters-container  row mx-auto">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar empleos..."/>
                </div>
                <div className="col-md-6 col-12">
                    <Filters type="empleos" onFilterChange={handleFilterChange} />
                </div>
            </div>
            <ul>
                {filteredEmpleos.map((empleo) => (
                    <React.Fragment key={empleo.id_empleo}>
                        <li>
                            <div className="tarjeta container row-cols-12 row-cols-md-12 g-4 mb-2">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body text-white d-flex">
                                            <div className="col-md-10 col-8">
                                                <h5 className="card-title">
                                                    {empleo.titulo}
                                                </h5>
                                                <p className="card-text">Salario: {empleo.salario}</p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {empleo.descripcion}
                                                </p>
                                            </div>
                                            <div className="col-md-2 gap-1 col-4" style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                                <Link className="btn btn-info w-100 mx-auto" href={`/empleos/${empleo.id_empleo}`}>VER MAS</Link>
                                                <Link className="btn btn-success w-100 mx-auto" href={`https://wa.me/${empleo.num_telf}`} target="_blank">
                                                    <i className="bi bi-whatsapp"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        </section>
    );
}