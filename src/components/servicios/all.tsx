"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import Buscador from "@/components/1generales/buscador";
import OneServicio from "./one";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "js-cookie";
import End_message_scroll from "../1generales/scrollable_tools/end_message";
import Hamster_loader_scroll from "../1generales/scrollable_tools/loader_scroll";

export default function MostrarServicios({ servicios }) {
    const { csrf } = useContext(Context)

    const [showServicio, setShowServicio] = useState<any>({}); //mostrar el servicio en el contenedor
    const [favorito, setFavorito] = useState(false); //manejo de favoritos
    const [serviciosList, set_ServiciosList] = useState(servicios); //lista de servicios a renderizar

    const [serviciosList_old, set_ServiciosList_old] = useState(servicios); //lista de servicios a renderizar con los datos del prop y scrolleados
    const [count_page, set_count_page] = useState(2); //contador de paginacion de servicios originales

    const one_item_ref = useRef(null); //referencia del contenedor donde se muestran los detalles de cada servicio

    const [count_page_search, set_count_page_search] = useState(2); //contador de paginacion de la busqueda
    const [is_searching, set_is_searching] = useState(false);   //si se esta en modo busqueda o no
    const [content_search, set_content_search] = useState('');  //contenido del input search

    const [has_more, set_has_more] = useState(true); //activar o desactivar scroll (al estar desactivado deja de llamar a sus metodos correspondiente de su props next)

    useEffect(() => {
        if (!csrf) return; //retornar ya que la siguiente funcion desencadena un fetch con csrf requerido
        if (serviciosList.length < 6 && serviciosList.length > 0) setShowServicio(serviciosList[0]); //mientras la primera lista o la primera carga sea 0 mostrar el primer elemento
    }, [serviciosList, csrf]);

    useEffect(() => {//verificar si es favtorio un item seleccionado
        const get_is_favorite = async () => {
            const servicio = showServicio;
            if (!servicio.id_servicio) return;
            try {
                const response = await fetch(urlBackGlobal + '/api/usuarios-c/isFavorito', {
                    method: 'POST', credentials: 'include',
                    headers: {
                        'x-csrf-token': csrf,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_recurso: servicio.id_servicio,
                        tipo_recurso: 'servicio',
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
    }, [showServicio]);

    useEffect(() => {
        set_has_more(true); //para scrollear
        if (!is_searching) { //si no esta en modo busqueda renderizar los servicios originales cargados
            set_ServiciosList(serviciosList_old);
        }
        else {
            const country = Cookies.get('country'); //pais cookies
            fetch(`${urlBackGlobal}/api/servicios-c/search/${country}?content=${content_search}&page=1`)
                .then(res => res.json()).then(new_items => {
                    if (Array.isArray(new_items)) {
                        set_ServiciosList(new_items);
                    }
                    else {
                        set_ServiciosList([]);
                        set_has_more(false);
                    }
                })
            set_count_page_search(2);
        }
    }, [content_search])

    //la misma doc de los demas
    const next_pagination_original = () => {
        const country = Cookies.get('country')
        fetch(`${urlBackGlobal}/api/servicios-c/getPublic/${country}?page=${count_page}`)
            .then(res => res.json()).then(new_items => {
                if (Array.isArray(new_items)) {
                    set_ServiciosList(prev => [...prev, ...new_items]);
                    set_ServiciosList_old(prev => [...prev, ...new_items]);
                    set_count_page(count_page + 1);
                }
                else {
                    set_has_more(false);
                }
            });
    }
    const next_pagination_search = () => {
        const country = Cookies.get('country');
        fetch(`${urlBackGlobal}/api/servicios-c/search/${country}?content=${content_search}&page=${count_page_search}`)
            .then(res => res.json()).then(new_items => {
                if (Array.isArray(new_items)) {
                    set_ServiciosList(prev => [...prev, ...new_items]);
                    set_count_page_search(count_page_search + 1);
                }
                else {
                    set_has_more(false);
                }
            })
    }
    return (
        <section className="all-items">
            <div className="search-filters-container row mb-2">
                <div>
                    <Buscador set_content_search={set_content_search} set_is_searching={set_is_searching} />
                </div>
            </div>
            <div className="containerUl">
                <ul id="scrollableUl">
                    <InfiniteScroll
                        dataLength={serviciosList.length}
                        hasMore={has_more}
                        next={!is_searching ? next_pagination_original : next_pagination_search}
                        scrollableTarget={'scrollableUl'}
                        endMessage={<End_message_scroll type={serviciosList.length>0?"final":"empty"}/>}
                        loader={<Hamster_loader_scroll/>}>
                        {serviciosList.map((servicio, index) => (
                            <React.Fragment key={servicio.id_servicio}>
                                <li className={index === 0 ? "selected" : ""} onClick={(e) => {
                                    document.querySelectorAll('.containerUl li').forEach((li) => li.classList.remove('selected'));
                                    e.currentTarget.classList.add('selected');
                                    setShowServicio(servicio);
                                    one_item_ref.current.classList.add('show')
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
                                                        <p className="card-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {servicio.descripcion}
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
                    </InfiniteScroll>
                </ul>
                <OneServicio setShowServicio={setShowServicio} servicio={showServicio} favorito={favorito} setFavorito={setFavorito} one_item_ref={one_item_ref} />
            </div>
        </section>
    );
}