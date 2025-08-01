"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import Filters from "@/components/generales/Filters";
import Buscador from "@/components/generales/buscador";
import OnePasantias from "./one";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";

export default function MostrarPasantias({ pasantias }) {
    const { csrf } = useContext(Context);

    const [showPasantia, setShowPasantia] = useState({});
    const [favorito, setFavorito] = useState(false);

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
        setFilteredPasantias(pasantias ?? []);
    };
    const get_is_favorite = async () => {
        const pasantia = showPasantia;
        if (!pasantia.id_pasantia) return;
        try {
            const response = await fetch(urlBackGlobal + '/api/usuarios-c/isFavorito', {
                method: 'POST', credentials: 'include',
                headers: {
                    'x-csrf-token': csrf,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_recurso: pasantia.id_pasantia,
                    tipo_recurso: 'pasantia',
                })
            })
            if (response.ok) {
                const isFav = await response.json();
                setFavorito(isFav);
            }
            else {
                console.log('failed get favorite');
                setFavorito(false);
            }
        }
        catch (err) { console.error(err) }
    }
    useEffect(() => {
        if(csrf) setShowPasantia(pasantias[0]);
    },[csrf]);
    useEffect(() => {
        get_is_favorite();
    }, [showPasantia])
    return (
        <section className="all-items">
            <div className="search-filters-container row mb-2">
                <div className="col-md-6 col-12">
                    <Buscador onSearch={handleSearch} placeholder="Buscar pasantías..." />
                </div>
                <div className="col-md-6 col-12">
                    <Filters type="pasantias" onFilterChange={handleFilterChange} />
                </div>
            </div>

            <div className="containerUl">
                <ul>
                    {filteredPasantias.map((pasantia) => (
                        <React.Fragment key={pasantia.id_pasantia}>
                            <li onClick={() => {
                                setShowPasantia(pasantia);
                            }}>
                                <div className="row-cols-12 row-cols-md-12 g-4 mb-2">
                                    <div className="col">
                                        <div className="card h-100">
                                            <div className="card-body text-white">
                                                <div className="content">
                                                    <h5 className="card-title">
                                                        {pasantia.titulo}
                                                    </h5>
                                                    <p className="card-text">Duración: {pasantia.duracion}</p>
                                                    <p className="card-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {pasantia.descripcion}
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
                <OnePasantias pasantia={showPasantia} favorito={favorito} setFavorito={setFavorito} />
            </div>
        </section>
    );
}