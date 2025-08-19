'use client';
import { useRef } from 'react';


export default function Buscador({ set_is_searching, set_content_search }) {
    const ref_timeout = useRef(null); //timeout para el input
    const ref_input = useRef(null); //referencia del input search

    const changed_content_event=(e:React.ChangeEvent<HTMLInputElement>)=>{
        
        if (ref_timeout.current) clearTimeout(ref_timeout.current); //limpiear el timeout
        if(e.target.value==='') {
            
            set_content_search(e.target.value); //establecer el contenido del input
            set_is_searching(false) //establecer si se esta buscando como falso
            return; //salir de la funcion
        };
        //continuar saltando el if si value no es empty ''.
        ref_timeout.current = setTimeout(() => { //establecer el timeout
            set_content_search(e.target.value); //setear el contenido del input
            set_is_searching(true); //si se esta en modo busqueda establecer true
        }, 1000) //1 segundo de retraso para cada seteo que en cada seteo se ejecuta un fetch en su componenten all respectivo
    }
    return (
        <div className="buscador-container">
            <div className="search-input-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                    ref={ref_input}
                    type="text"
                    className="search-input"
                    placeholder="Buscar..."
                    onChange={(e) => changed_content_event(e)}
                />
                <button
                    type='button'
                    className="clear-button"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                        ref_input.current.value = '';   //limpiar el input
                        set_content_search(ref_input.current.value);    //establecer el contenido del search
                        set_is_searching(false);
                    }}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
        </div>
    );
}