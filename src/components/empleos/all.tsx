"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import Buscador from "@/components/1generales/buscador";
import OneEmpleo from "./one";
import { Context } from "@/app/providers";
import { urlBackGlobal } from "@/constants/urls";
import Cookies from "js-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import End_message_scroll from "../1generales/scrollable_tools/end_message";
import Hamster_loader_scroll from "../1generales/scrollable_tools/loader_scroll";

export default function MostrarEmpleos({ empleos }) {
    const { csrf } = useContext(Context);

    const [empleosListOld, setEmpleosListOld] = useState(empleos); //mantener props de empleos intacto

    const [empleosList, setEmpleosList] = useState(empleos); //lista de empleos que se muestran con map
    const [showEmpleo, setShowEmpleo] = useState<any>({}); //mostrar detalles del empleo
    const [count_page, set_count_page] = useState(2); //contador de paginacion de empleos (original) 2 pq props ya es la 1

    const [is_searching, set_is_searching] = useState(false); //si se esta buscando o no
    const [count_page_search, set_count_page_search] = useState(2); //contador de paginacion del buscador
    const [content_search, set_content_search] = useState(''); //contenido del buscador

    const [has_more, set_has_more] = useState(true);

    const [favorito, setFavorito] = useState(false); //manejo de favoritos para cada item

    const one_item_ref = useRef(null); //ref del empleo del componente one.jsx

    useEffect(() => { 
        if(!csrf) return;
        if(empleosList.length<6&&empleosList.length>0){
            setShowEmpleo(empleosList[0]);
        }
     }, [empleosList,csrf]); //muetra el primer empleo al renderizar

    useEffect(() => {
        set_has_more(true);
        if (!is_searching) {
            setEmpleosList(empleosListOld); //setear la lista original si no se esta buscando
        }
        else {
            const country = Cookies.get('country');
            fetch(`${urlBackGlobal}/api/empleos-c/search/${country}?content=${content_search}&page=1`) //tomar la primera paginacion
                .then(res => res.json()).then(items => {
                    if (Array.isArray(items)) {
                        setEmpleosList(items);  //si hay items setear la lista
                    }
                    else {
                        setEmpleosList([]); //si no hay no mostrar nada
                        set_has_more(false);//ya que no hay nada setear false para prevenir errores del scroll
                    }
                })
        }
        set_count_page_search(2);//esto se ejecuta cada vez que se cambia la busqueda. 2 pq 1 es el primer fetch

    }, [content_search]) //cada vez que cambia la busqueda

    useEffect(() => { //setFavorito
        const get_is_favorite = async () => {
            const empleo = showEmpleo;
            if (!empleo.id_empleo) return;
            try {
                const response = await fetch(urlBackGlobal + '/api/usuarios-c/isFavorito', {
                    method: 'POST', credentials: 'include',
                    headers: {
                        'x-csrf-token': csrf,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_recurso: empleo.id_empleo,
                        tipo_recurso: 'empleo',
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
    }, [showEmpleo]) //cada vez que se cambie o seleccione un empleo

    const next_page_original = () => {
        const country = Cookies.get('country');
        fetch(`${urlBackGlobal}/api/empleos-c/getPublic/${country}?page=${count_page}`)
            .then(res => res.json())
            .then((new_items) => {
                if (Array.isArray(new_items)) {
                    setEmpleosList(prev => [...prev, ...new_items]); //setear la lista de empleos con los nuevos items
                    setEmpleosListOld(prev => [...prev, ...new_items]);   //esto es para guardar los items cargados del scroll en un array de no busqueda, para tener cargados los items scrolleados
                    set_count_page(count_page + 1);   //aumentar en 1 en la siguiente vuelta
                }
                else {
                    set_has_more(false); //setear esta var para definir que esta vacion
                }
            });
    }
    const next_page_search = () => {    //la misma weba de arriba ^
        const country = Cookies.get('country');
        fetch(`${urlBackGlobal}/api/empleos-c/search/${country}?content=${content_search}&page=${count_page_search}`)
            .then(res => res.json()).then((new_items) => {
                if (Array.isArray(new_items)) {
                    setEmpleosList(prev => [...prev, ...new_items]);
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
                    <Buscador set_is_searching={set_is_searching} set_content_search={set_content_search} />
                </div>
            </div>
            <div className="containerUl">
                <ul id="scrollableUl">
                    <InfiniteScroll
                        dataLength={empleosList.length}
                        next={!is_searching ? next_page_original : next_page_search}
                        scrollableTarget="scrollableUl"
                        hasMore={has_more}
                        loader={<Hamster_loader_scroll/>}
                        endMessage={<End_message_scroll type={empleosList.length>0?"final":"empty"}/>}>
                        {empleosList.length > 0 ? empleosList.map((empleo, index) => (
                            <React.Fragment key={empleo.id_empleo}>
                                <li className={index === 0 ? "selected" : ""} onClick={(e) => {
                                    document.querySelectorAll('.containerUl li').forEach((li) => li.classList.remove('selected'));
                                    e.currentTarget.classList.add('selected');
                                    setShowEmpleo(empleo);
                                    one_item_ref.current.classList.add('show');
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
                                                        <p className="card-text" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                        )) : null}
                    </InfiniteScroll>
                </ul>
                <OneEmpleo empleo={showEmpleo} favorito={favorito} setFavorito={setFavorito} one_item_ref={one_item_ref} setShowEmpleo={setShowEmpleo} />
            </div>
        </section>
    );
}