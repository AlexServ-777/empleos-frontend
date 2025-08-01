"use client";
export const dynamic = 'force-dynamic';
import Buscador from "@/components/generales/buscador";
import React, { useContext, useEffect, useRef, useState } from "react";
import OneEmpleo from "./empleos/one";
import OnePasantias from "./pasantias/one";
import OneServicio from "./servicios/one";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import { useSearchParams } from "next/navigation";

export default function Home({ empleos, pasantias, servicios }) {
    const { csrf } = useContext(Context);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    const [showItem, setShowItem] = useState({});
    const [typeItem, setTypemItem] = useState('');
    const [favorito, setFavorito] = useState(false);
    const [isShare, setIsShare] = useState(false);

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
        switch (type) {
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
        switch (type) {
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
                const pasantiasData = pasantias;
                const pasantiasList = Array.isArray(pasantiasData) ? pasantiasData : [];
                const pasantiasWithType = pasantiasList.map(pasantia => ({
                    ...pasantia,
                    type: 'pasantia',
                    id: pasantia.id_pasantia,
                    link: `/pasantias/${pasantia.id_pasantia}`
                }));

                // Obtener servicios
                const serviciosData = servicios;
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

    {/*Mostrar la ventana del item compartido */ }
    const params = useSearchParams();
    useEffect(() => {
        const id_item = params.get('id');
        const tipo_item = params.get('type');
        if (!id_item || !tipo_item) return;
        const get_tipo_url = () => {
            if (tipo_item == 'empleo') return 'empleos-c/getEmpleo';
            if (tipo_item == 'pasantia') return 'pasantias-c/getPasantia';
            if (tipo_item == 'servicio') return 'servicios-c/getServicio';
        }
        const get_item = async () => {
            const response = await fetch(urlBackGlobal + `/api/${get_tipo_url()}/${id_item}`)
            const item = await response.json();
            setShowItem(item);
            setTypemItem(tipo_item);
            setIsShare(true)
        }
        get_item();
    }, []);
    {/*verificar si el item seleccionado es favorito */ }
    useEffect(() => {
        const get_is_favorite = async () => {
            try {
                if (!showItem.id_empleo && !showItem.id_pasantia && !showItem.id_servicio) return;
                const response = await fetch(urlBackGlobal + '/api/usuarios-c/isFavorito', {
                    method: 'POST', credentials: 'include',
                    headers: {
                        'x-csrf-token': csrf,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_recurso: `${typeItem === 'empleo' ? showItem.id_empleo :
                            typeItem === 'pasantia' ? showItem.id_pasantia :
                                showItem.id_servicio}`,
                        tipo_recurso: typeItem,
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
        get_is_favorite();
        if (Object.keys(showItem).length === 0) setIsShare(false);
    }, [showItem])
    const renderItem = () => {
        switch (typeItem) {
            case 'empleo': return <OneEmpleo favorito={favorito} setFavorito={setFavorito} empleo={showItem} />;
            case 'pasantia': return <OnePasantias favorito={favorito} setFavorito={setFavorito} pasantia={showItem} />
            case 'servicio': return <OneServicio favorito={favorito} setFavorito={setFavorito} servicio={showItem} />
            case '': return <div></div>
        }
    }
    useEffect(()=>{
        const id = params.get('id');
        if(!id&&csrf&&filteredItems.length>0){
            setTypemItem(filteredItems[0].type);
            setShowItem(filteredItems[0]);
        }
    },[filteredItems, csrf])
    return (
            <section className="all-items">
                <div className="search-filters-container mb-2 row">
                    <Buscador onSearch={handleSearch} placeholder="Buscar empleos, pasantías o servicios..." />
                </div>
                <div className="containerUl">
                    {/* ESTE ES UN MODAL TEMPORAL SOLO PARA PREVISUALIZAR UN ITEM COMPARTIDO*/}
                    <div className={`position-absolute ${!params.get('id') || Object.keys(showItem).length === 0 || isShare == false ? 'd-none' : ''}`} style={{ height: '100vh', width: "100%", zIndex: '15' }}>
                        {params.get('id') ? renderItem() : null}
                    </div>
                    <ul>
                        {filteredItems.map((item) => (
                            <React.Fragment key={`${item.type}-${item.id}`}>
                                <li
                                    onClick={() => {
                                        setTypemItem(item.type);
                                        setShowItem(item);
                                    }}>
                                    <div className="row-cols-12 row-cols-md-12 g-4 mb-2">
                                        <div className="col">
                                            <div className="card h-100 item-card">
                                                <div className="card-body text-white d-flex">
                                                    <div className="col-md-10 col-8">
                                                        <span className={`badge w-auto ${getTypeColor(item.type)} me-2 mb-1`}>
                                                            {getTypeLabel(item.type)}
                                                        </span>
                                                        <h5 className="card-title mb-0">
                                                            {item.titulo}
                                                        </h5>
                                                        <p className="card-text">
                                                            {item.type === 'empleo' && `Salario: ${item.salario}`}
                                                            {item.type === 'pasantia' && `Duración: ${item.duracion}`}
                                                            {item.type === 'servicio' && `Precio: ${item.precio}`}
                                                        </p>
                                                        <p className="card-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {item.descripcion}
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
                    {renderItem()}
                </div>
            </section>
    );
}
