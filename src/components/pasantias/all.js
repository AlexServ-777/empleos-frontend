"use client"
import React, { useState } from "react";
import Link from "next/link";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import { useRouter } from "next/navigation";

export default function MostrarPasantias({pasantias}){
    const [filteredPasantias, setFilteredPasantias] = useState([]);
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
        let filtered = [...pasantias];

        // Aplicar búsqueda por texto
        if (searchTerm) {
            filtered = filtered.filter(pasantia => 
                pasantia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pasantia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.category.length > 0) {
            filtered = filtered.filter(pasantia => 
                filters.category.includes(pasantia.categoria)
            );
        }

        if (filters.modalidad.length > 0) {
            filtered = filtered.filter(pasantia => 
                filters.modalidad.includes(pasantia.modalidad)
            );
        }

        if (filters.ubicacion) {
            filtered = filtered.filter(pasantia => 
                pasantia.ciudad.toLowerCase().includes(filters.ubicacion.toLowerCase()) ||
                (pasantia.ubicacion && pasantia.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase()))
            );
        }

        setFilteredPasantias(filtered);
    };

    const clearFilters = () => {
        setFilters({
            category: [],
            modalidad: [],
            ubicacion: '',
            search: ''
        });
        setFilteredPasantias(pasantias??[]);
    };
    const router = useRouter()
    return (
        <>
        <section className="all-items container mb-5" style={{height:"100%"}}>
            <div className="search-filters-container row mx-auto">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar pasantías..." />
                </div>
                <div className="col-md-6 col-12">
                    <Filters type="pasantias" onFilterChange={handleFilterChange} />
                </div>
            </div>
            <ul>
                {filteredPasantias.map((pasantia) => (
                    <React.Fragment key={pasantia.id_pasantia}>
                        <li>
                            <div className="tarjeta container row-cols-12 row-cols-md-12 g-4 mb-2">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body text-white d-flex">
                                            <div className="col-md-10 col-8">
                                                <h5 className="card-title">
                                                    {pasantia.titulo}
                                                </h5>
                                                <p className="card-text">Duración: {pasantia.duracion}</p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {pasantia.descripcion}
                                                </p>
                                            </div>
                                            <div className="col-md-2 gap-1 col-4" style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                                <Link className="btn btn-info w-100 mx-auto" href={`/pasantias/${pasantia.id_pasantia}`}>VER MAS</Link>
                                                <Link className="btn btn-success w-100 mx-auto" href={`https://wa.me/${pasantia.num_telf}`} target="_blank">
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
        </>
    );
}