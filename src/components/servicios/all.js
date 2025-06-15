"use client"
import React, {useState } from "react";
import Link from "next/link";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import SEO from "@/components/SEO";
import { useRouter } from "next/navigation";

export default function MostrarServicios({servicios}){
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
    const router = useRouter();
    return (
        <>
        <SEO title={'Encuentra Servicios'} description={'Encuentra cualquier tipo de servicios para tus necesidades en un solo lugar'} keywords={'servicios, trabajos, necesidad, necestio'} url={router.asPath}/>
        <section className="all-items container mb-5" style={{height:"100%"}}>
            <div className="search-filters-container row mx-auto">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar servicios..." />
                </div>
                <div className="col-md-6 col-12">                
                    <Filters type="servicios" onFilterChange={handleFilterChange} />
                </div>
            </div>
            <ul>
                {filteredServicios.map((servicio) => (
                    <React.Fragment key={servicio.id_servicio}>
                        <li>
                            <div className="tarjeta container row-cols-12 row-cols-md-12 g-4 mb-2">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body text-white d-flex">
                                            <div className="col-md-10 col-8">
                                                <h5 className="card-title">
                                                    {servicio.titulo}
                                                </h5>
                                                <p className="card-text">Precio: {servicio.precio}</p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {servicio.descripcion}
                                                </p>
                                            </div>
                                            <div className="col-md-2 gap-1 col-4" style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                                <Link className="btn btn-info w-100 mx-auto" href={`/servicios/${servicio.id_servicio}`}>VER MAS</Link>
                                                <Link className="btn btn-success w-100 mx-auto" href={`https://wa.me/${servicio.num_telf}`} target="_blank">
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