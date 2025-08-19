"use client";
import Buscador from "@/components/1generales/buscador";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import OneEmpleo from "./empleos/one";
import OnePasantias from "./pasantias/one";
import OneServicio from "./servicios/one";
import { urlBackGlobal } from "@/constants/urls";
import { Context } from "@/app/providers";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import suffle_array from "@/my_functios/suffle_Array";
import InfiniteScroll from "react-infinite-scroll-component";
import Hamster_loader_scroll from "./1generales/scrollable_tools/loader_scroll";
import End_message_scroll from "./1generales/scrollable_tools/end_message";

export default function Home({ items_ssr }) {
    const { csrf } = useContext(Context);
    const one_item_ref = useRef<HTMLDivElement>(null);

    const [items, set_items] = useState(items_ssr);
    const [items_origin, set_items_origin] = useState(items_ssr);
    const [count_page, set_count_page] = useState(2);

    const [content_search, set_content_search] = useState('');
    const [is_searching, set_is_searching] = useState(false);
    const [count_page_search, set_count_page_search] = useState(2);
    const [has_more, set_has_more] = useState(true);

    const [showItem, setShowItem] = useState<any>({});
    const [typeItem, setTypemItem] = useState('');

    const [favorito, setFavorito] = useState(false);
    const [isShare, setIsShare] = useState(false);

    const getTypeLabel = (type) => { //para el icono de tipo de los items
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

    const getTypeColor = (type) => {    //para el color de los iconos de los items
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

    //Mostrar la ventana del item compartido
    const params = useSearchParams();
    useEffect(() => {
        const id_item = params.get('id');   //verificar el id compartido de la url
        const tipo_item = params.get('type'); //verificar el tipo, compartido de la url
        if (!id_item || !tipo_item) return; //si uno no esta entonces salir del efecto y no hacer nada
        const get_tipo_url = () => {    //funcion para obtener el fetch tipo de item
            if (tipo_item == 'empleo') return 'empleos-c/getEmpleo';
            if (tipo_item == 'pasantia') return 'pasantias-c/getPasantia';
            if (tipo_item == 'servicio') return 'servicios-c/getServicio';
        }
        const get_item = async () => { //obtener el item
            const response = await fetch(urlBackGlobal + `/api/${get_tipo_url()}/${id_item}`)   //obtener le item compartido
            const item = await response.json();
            setShowItem(item);  //mostrar el componente ONE respectivo 
            setTypemItem(tipo_item);    //setear el tipo para la funcion renderItem()
            setIsShare(true)    //definir si es share para renderizar un componente duplicado de ONE
        }
        get_item();
    }, []);

    /*verificar si el item seleccionado es favorito */
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
    }, [showItem]);

    useEffect(() => {
        if(Object.entries(showItem).length>0) one_item_ref.current.classList.add('show');
    }, [showItem]);
    //renderizar el componente ONE respectivo de cada tipo de item
    const renderItem = () => {
        switch (typeItem) {
            case 'empleo': return <OneEmpleo favorito={favorito} setFavorito={setFavorito} empleo={showItem} setShowEmpleo={setShowItem} one_item_ref={one_item_ref} />;
            case 'pasantia': return <OnePasantias favorito={favorito} setFavorito={setFavorito} pasantia={showItem} setShowPasantia={setShowItem} one_item_ref={one_item_ref} />
            case 'servicio': return <OneServicio favorito={favorito} setFavorito={setFavorito} servicio={showItem} setShowServicio={setShowItem} one_item_ref={one_item_ref} />
            default: return <div className="containerOne"></div>;
        }
    }
    //mostrar el primer item
    useEffect(() => {
        const id = params.get('id');
        const width_window= window.innerWidth; //para no mostrar el item en modo pc
        if (!id && csrf && items.length > 0&&width_window>992) {
            setTypemItem(items[0].type);
            setShowItem(items[0]);
        }
    }, [items, csrf]);

    //cada que cambia la busqueda de items
    useEffect(() => {
        set_has_more(true);
        if (!is_searching) {
            set_items(items_origin);
        }
        else {
            //se ejecuta cada vez que issearchin sea false, osea no este en modo busqueda, y se hace el primer fetch
            const fetch_search = async () => {
                const country = Cookies.get('country');

                const res_emp = await fetch(`${urlBackGlobal}/api/empleos-c/search/${country}?page=${1}&content=${content_search}`);
                const new_empleos = await res_emp.json();
                const res_pas = await fetch(`${urlBackGlobal}/api/pasantias-c/search/${country}?page=${1}&content=${content_search}`);
                const new_pasantias = await res_pas.json();
                const res_ser = await fetch(`${urlBackGlobal}/api/servicios-c/search/${country}?page=${1}&content=${content_search}`);
                const new_servicios = await res_ser.json();
                if (Array.isArray(new_empleos) || Array.isArray(new_pasantias) || Array.isArray(new_servicios)) {
                    const empleos = Array.isArray(new_empleos) ? new_empleos.map((empleo) => { return { ...empleo, type: "empleo", id: empleo.id_empleo } }) : [];
                    const pasantias = Array.isArray(new_pasantias) ? new_pasantias.map((pasantia) => { return { ...pasantia, type: "pasantia", id: pasantia.id_pasantia } }) : [];
                    const servicios = Array.isArray(new_servicios) ? new_servicios.map((servicio) => { return { ...servicio, type: "servicio", id: servicio.id_servicio } }) : [];

                    const items_search = [...empleos, ...pasantias, ...servicios];
                    suffle_array(items_search);
                    set_items(items_search);
                }
                else {
                    set_items([]); //si no hay nada en los fetch
                    set_has_more(false)
                }
            }
            fetch_search();
            set_count_page_search(2);
        }
    }, [content_search]);

    //paginacion para la lista original index
    const next_page_origin = async () => {  //siguiente paginacion de la lista orignal
        const country = Cookies.get('country');

        const res_emp = await fetch(`${urlBackGlobal}/api/empleos-c/getPublic/${country}?page=${count_page}`);
        const new_empleos = await res_emp.json();
        const res_pas = await fetch(`${urlBackGlobal}/api/pasantias-c/getPublic/${country}?page=${count_page}`);
        const new_pasantias = await res_pas.json();
        const res_ser = await fetch(`${urlBackGlobal}/api/servicios-c/getPublic/${country}?page=${count_page}`);
        const new_servicios = await res_ser.json();

        if (Array.isArray(new_empleos) || Array.isArray(new_pasantias) || Array.isArray(new_servicios)) { //por lo menos uno debe ser array para concatenar a la lista existente
            //agregarle los atributos extras correspondientes
            const empleos = new_empleos.map((empleo) => { return { ...empleo, type: "empleo", id: empleo.id_empleo } });
            const pasantias = new_pasantias.map((pasantia) => { return { ...pasantia, type: "pasantia", id: pasantia.id_pasantia } });
            const servicios = new_servicios.map((servicio) => { return { ...servicio, type: "servicio", id: servicio.id_servicio } });

            const new_items = [ //concatenar los 3 items en uno solo
                ...Array.isArray(empleos) ? empleos : [],   //si contiene algo concatenar ese algo, si no es asi entonces sera un vacio, osea no concatenar nada
                ...Array.isArray(pasantias) ? pasantias : [],   //^
                ...Array.isArray(servicios) ? servicios : [],   //^
            ]
            suffle_array(new_items); // barajear el nuevo array
            set_items(prev => [...prev, ...new_items]); //concatenar oficialmente a la lista
            set_items_origin(prev => [...prev, ...new_items]);
            set_count_page(count_page + 1); //aumentar el contador (no se ejecuta si se va a else)
        }
        else {   //si ninguno contiene nada quiere decir que no hay mas items que scrollear asi que fin de la funcion
            set_has_more(false);
        }
    }

    //paginacion para las busquedas
    const next_page_search = async () => { //sigueinte paginacion de la lista de busqueda
        const country = Cookies.get('country');

        const res_emp = await fetch(`${urlBackGlobal}/api/empleos-c/search/${country}?page=${count_page_search}&content=${content_search}`);
        const new_empleos = await res_emp.json();
        const res_pas = await fetch(`${urlBackGlobal}/api/pasantias-c/search/${country}?page=${count_page_search}&content=${content_search}`);
        const new_pasantias = await res_pas.json();
        const res_ser = await fetch(`${urlBackGlobal}/api/servicios-c/search/${country}?page=${count_page_search}&content=${content_search}`);
        const new_servicios = await res_ser.json();

        if (Array.isArray(new_empleos) || Array.isArray(new_pasantias) || Array.isArray(new_servicios)) {
            const empleos = Array.isArray(new_empleos) ? new_empleos.map((empleo) => { return { ...empleo, type: "empleo", id: empleo.id_empleo } }) : [];
            const pasantias = Array.isArray(new_pasantias) ? new_pasantias.map((pasantia) => { return { ...pasantia, type: "pasantia", id: pasantia.id_pasantia } }) : [];
            const servicios = Array.isArray(new_servicios) ? new_servicios.map((servicio) => { return { ...servicio, type: "servicio", id: servicio.id_servicio } }) : [];

            const _new_items = [...empleos, ...pasantias, ...servicios];
            suffle_array(_new_items);
            set_items(prev => [...prev, ..._new_items]);
            set_count_page_search(count_page_search + 1);
        }
        else {
            set_has_more(false);
        }
    }
    return (
        <section className="all-items">
            <div className="search-filters-container mb-2 row">
                <Buscador set_content_search={set_content_search} set_is_searching={set_is_searching} />
            </div>
            <div className={isShare ? `container_share_item` : null} onClick={() => setIsShare(false)}>
                <div className="item" onClick={(e) => e.stopPropagation()}> {/* detenener el evento del boton de arriba ^*/}
                    {isShare ? <button className="btn_close" type="button" onClick={() => setIsShare(false)}><i className="bi bi-x-circle-fill"></i></button> : null}
                    {isShare ? renderItem() : null}
                </div>
            </div>
            <div className="containerUl">
                <ul id="scrollableUl">
                    <InfiniteScroll
                        dataLength={items.length}
                        next={!is_searching ? next_page_origin : next_page_search}
                        hasMore={has_more}
                        loader={<Hamster_loader_scroll />}
                        endMessage={<End_message_scroll type={items.length > 0 ? "final" : "empty"} />}
                        scrollableTarget="scrollableUl">
                        {items.map((item, index) => (
                            <React.Fragment key={`${item.type}-${item.id}`}>
                                <li className={index === 0 ? "selected" : ""}
                                    onClick={(e) => {
                                        document.querySelectorAll('.containerUl li').forEach((li) => li.classList.remove('selected'));
                                        e.currentTarget.classList.add('selected');
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
                                <hr />
                            </React.Fragment>
                        ))}
                    </InfiniteScroll>
                </ul>
                {renderItem()}
            </div>
        </section>
    );
}
