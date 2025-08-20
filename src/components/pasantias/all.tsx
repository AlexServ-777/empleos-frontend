"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import Buscador from "@/components/1generales/buscador";
import OnePasantias from "./one";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "js-cookie";
import End_message_scroll from "../1generales/scrollable_tools/end_message";
import Hamster_loader_scroll from "../1generales/scrollable_tools/loader_scroll";

export default function MostrarPasantias({ pasantias, pages_availables, limit }) {
    const { csrf } = useContext(Context);

    const [showPasantia, setShowPasantia] = useState<any>({}); //para mostrar la pasantia
    const [pasantiasList_old, setPasantiasList_old] = useState(pasantias); //lista que se restaurara cada vez que no este en modo busqueda
    const [pasantiasList, setPasantiasList] = useState(pasantias);

    const [count_page, set_count_page] = useState(0); //contador de paginacion, para los indices o paginas ya creadas en pages_availabes

    const [count_page_search, set_count_page_search] = useState(2); //contador de paginacion de busqueda (2 ya que se usara directo en el scroll y el 1 esta en el fetch del efecto de cambio de busqueda)

    const [content_search, set_content_search] = useState(''); //contenido del input search

    const [favorito, setFavorito] = useState(false);    //establecer favoritos de cada uno

    const one_item_ref = useRef(null); //referencia el contenedor donde se muestra el item
    
    useEffect(() => { //mostrar la primera pasantia
        if (!csrf) return;
        if(pasantiasList.length<=limit&&pasantiasList.length>0) setShowPasantia(pasantiasList[0]);
    }, [csrf, pasantiasList]);
    
    useEffect(() => { //funcion para ver si es favorito un item seleccionado
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
        get_is_favorite();
    }, [showPasantia]);

    //cada que cambia content_search para restaurar busquedas
    useEffect(() => {
        set_has_more(true);
        if (!content_search) {
            setPasantiasList(pasantiasList_old); //si no esta en modo busqueda restaurar el array principal
        }
        else {
            const country = Cookies.get('country');
            fetch(`${urlBackGlobal}/api/pasantias-c/search/${country}?search=${content_search}&page=1&limit=${limit}`)
                .then(res => res.json())
                .then(new_items => {
                    if (Array.isArray(new_items)) {
                        setPasantiasList(new_items);
                    }
                    else {
                        setPasantiasList([]);
                        set_has_more(false);
                    }
                })
            set_count_page_search(2);
        }
    }, [content_search])

    const [has_more, set_has_more] = useState(true); //para la lib de react del scroll, si es true seguira scrollenado de lo contrario no (esta controlado en los metodos next de abajo);
   
    const next_pagination_origin = () => { //siguiente paginacion para los items originales
        const country = Cookies.get('country'); //obtener el pais de las cookies
        fetch(`${urlBackGlobal}/api/pasantias-c/search/${country}?page=${pages_availables[count_page]}&limit=${limit}&search=`) //llamada a la api
            .then(res => res.json()).then(new_items => {
                if (Array.isArray(new_items)&&count_page<pages_availables.length) { //si es array, ya que la api devuelve object 404 si no se encontro items
                    setPasantiasList(prev => [...prev, ...new_items]); //sumar a la lista
                    setPasantiasList_old(prev => [...prev, ...new_items]); //par mantener los items originales
                    set_count_page(count_page + 1); //subir de paginacikon
                }
                else {
                    set_has_more(false); //si el fetch devolvio 404, entonces dejar de scrollear por ende se deja de llamar este metodo
                }
            });
    }
    const next_pagination_search = () => { //siguiente paginacion de la busqueda
        const country = Cookies.get('country'); //pais
        fetch(`${urlBackGlobal}/api/pasantias-c/search/${country}?search=${content_search}&page=${count_page_search}&limit=${limit}`) //llamada a la api de search
            .then(res => res.json())
            .then(new_items => {
                //el mismo contexto del anterior metodo ^
                if (Array.isArray(new_items)) {
                    setPasantiasList(prev => [...prev, ...new_items]);
                    set_count_page_search(count_page_search + 1);
                } else {
                    set_has_more(false);
                }
            });
    }
    return (
        <section className="all-items">
            <div className="search-filters-container row mb-2">
                <div>
                    <Buscador set_content_search={set_content_search} />
                </div>
            </div>

            <div className="containerUl">
                <ul id="scrollableUl">
                    <InfiniteScroll dataLength={pasantiasList.length}
                        hasMore={has_more}
                        next={!content_search ? next_pagination_origin : next_pagination_search}
                        loader={<Hamster_loader_scroll/>}
                        endMessage={<End_message_scroll type={pasantiasList.length>0?"final":"empty"}/>}
                        scrollableTarget="scrollableUl">
                        {pasantiasList.map((pasantia: any, index: number) => (
                            <React.Fragment key={pasantia.id_pasantia}>
                                <li className={index === 0 ? "selected" : ""} onClick={(e) => {
                                    document.querySelectorAll('.containerUl li').forEach((li) => li.classList.remove('selected'));
                                    e.currentTarget.classList.add('selected');
                                    setShowPasantia(pasantia);
                                    one_item_ref.current.classList.add('show');
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
                                <hr />
                            </React.Fragment>
                        ))}
                    </InfiniteScroll>
                </ul>
                <OnePasantias setShowPasantia={setShowPasantia} pasantia={showPasantia} favorito={favorito} setFavorito={setFavorito} one_item_ref={one_item_ref} />
            </div>
        </section>
    );
}