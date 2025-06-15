'use client';

import { useRef } from "react";

export default function ModificarUsuario({id,display,setDisplay, mostrarUsuariosHijo,datosUser}) {
    const formRef = useRef();
    const serverUsuarios = "https://6njc18qv-8000.brs.devtunnels.ms/api/usuarios-c";

    const modificarUser = async ({id}) => {
        const formDatas = new FormData(formRef.current);
        const data = Object.fromEntries(formDatas.entries());
        data.isActive = data.isActive === 'true';
        await fetch(serverUsuarios+"/modificar/"+id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        formRef.current.reset();
    }
    return(
        <>
            <section className="container">
                <form className="form row bg-info" ref={formRef} style={{display: display, position:'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'fit-content', backgroundColor: 'white', padding: '20px', borderRadius: '10px'}}>   
                    <h1 style={{ textAlign: "center" }} className="col-12">Modificar Usuario</h1>
                    <input name="id_usuario" type="hidden" value={id} />
                    <input name="nombre" type="text" placeholder="Nombre" className="form-control col-6" value={datosUser.nombre}/>
                    <input name="apellido" type="text" placeholder="Apellido" className="form-control col-6" value={datosUser.apellido}/>
                    <input name="email" type="email" placeholder="Email" className="form-control col-6" value={datosUser.email}/>
                    <input name="password" type="text" placeholder="Password" className="form-control col-6" value={datosUser.password}/>
                    <input name="publicaciones" type="number" placeholder="Publicaciones" className="form-control" value={datosUser.publicaciones}/>
                    <input name="edad" type="number" placeholder="Edad" className="form-control col-2" value={datosUser.edad}/>
                    <input name="rol" type="text" placeholder="Rol" className="form-control col-3" value={datosUser.tipo}/>
                    <select name='isActive' className='form-select col-2 ml-1 mr-2' selected={datosUser.isActive}>
                        <option value='true'>Activo</option>
                        <option value='false'>Inactivo</option>
                    </select>
                    <button onClick={async(e) => {e.preventDefault();await modificarUser({id});mostrarUsuariosHijo(); setDisplay('none')}} className='btn btn-success col-3 ml-2'>Modificar Usuario</button>
                    <button onClick={(e)=>{e.preventDefault(); setDisplay('none'); formRef.current.reset()}} className="btn btn-danger ml-2">Cancelar</button>
                </form>
            </section>
        </>
    );
}