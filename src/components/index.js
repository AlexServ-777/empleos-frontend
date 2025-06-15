"use client";
export const dynamic = 'force-dynamic';
import Buscador from "@/components/generales/buscador";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home({empleos,pasantias,servicios}) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
        setFilteredItems(items);
        return;
    }
    const filtered = items.filter(item => 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
};

const getTypeLabel = (type) => {
    switch(type) {
        case 'empleo':
            return 'Empleo';
        case 'pasantia':
            return 'Pasantía';
        case 'servicio':
            return 'Servicio';
        default:
            return '';
    }
};

const getTypeColor = (type) => {
    switch(type) {
        case 'empleo':
            return 'bg-primary';
        case 'pasantia':
            return 'bg-info';
        case 'servicio':
            return 'bg-success';
        default:
            return 'bg-secondary';
    }
};

useEffect(() => {
    const fetchAllItems = async () => {
        try {
            // Obtener empleos
            const empleosData = empleos;
            const empleosList = Array.isArray(empleosData) ? empleosData : [];
            const empleosWithType = empleosList.map(empleo => ({
                ...empleo,
                type: 'empleo',
                id: empleo.id_empleo,
                link: `/empleos/${empleo.id_empleo}`
            }));

            // Obtener pasantías
            const pasantiasData=pasantias;
            const pasantiasList = Array.isArray(pasantiasData) ? pasantiasData : [];
            const pasantiasWithType = pasantiasList.map(pasantia => ({
                ...pasantia,
                type: 'pasantia',
                id: pasantia.id_pasantia,
                link: `/pasantias/${pasantia.id_pasantia}`
            }));

            // Obtener servicios
            const serviciosData=servicios;
            const serviciosList = Array.isArray(serviciosData) ? serviciosData : [];
            const serviciosWithType = serviciosList.map(servicio => ({
                ...servicio,
                type: 'servicio',
                id: servicio.id_servicio,
                link: `/servicios/${servicio.id_servicio}`
            }));

            // Combinar y mezclar todos los items
            const allItems = [...empleosWithType, ...pasantiasWithType, ...serviciosWithType];
            // Mezclar aleatoriamente el array
            const shuffledItems = allItems.sort(() => Math.random() - 0.5);
            
            setItems(shuffledItems);
            setFilteredItems(shuffledItems);
        } catch (error) {
            console.log(error);
            setItems([]);
            setFilteredItems([]);
        }
    };

    fetchAllItems();
}, [empleos, pasantias, servicios]);
  return (
    <div>
      <section className="all-items container mb-5" style={{height:"100%",}}>
            <div className="search-filters-container mb-4 container">
                <Buscador onSearch={handleSearch} placeholder="Buscar empleos, pasantías o servicios..." />
            </div>
            <ul>
                {filteredItems.map((item) => (
                    <React.Fragment key={`${item.type}-${item.id}`}>
                        <li>
                            <div className="tarjeta container row-cols-12 row-cols-md-12 g-4 mb-2">
                                <div className="col">
                                    <div className="card h-100 item-card">
                                        <div className="card-body text-white d-flex">
                                            <div className="col-md-10 col-8">
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className={`badge ${getTypeColor(item.type)} me-2`}>
                                                        {getTypeLabel(item.type)}
                                                    </span>
                                                    <h5 className="card-title mb-0">
                                                        {item.titulo}
                                                    </h5>
                                                </div>
                                                <p className="card-text">
                                                    {item.type === 'empleo' && `Salario: ${item.salario}`}
                                                    {item.type === 'pasantia' && `Duración: ${item.duracion}`}
                                                    {item.type === 'servicio' && `Precio: ${item.precio}`}
                                                </p>
                                                <p className="card-text" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                                                    {item.descripcion}
                                                </p>
                                            </div>
                                            <div className="col-md-2 gap-1 col-4" style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                                <Link className="btn btn-info w-100 mx-auto" href={item.link}>VER MAS</Link>
                                                <Link className="btn btn-success w-100 mx-auto" href={`https://wa.me/${item.num_telf}`} target="_blank">
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

    </div>
  );
}
