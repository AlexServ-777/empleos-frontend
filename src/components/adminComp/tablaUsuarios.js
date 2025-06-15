'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ModificarUsuario from "./modifyUsuario";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function TablaUsuarios() {
    const serverUsuarios = "https://6njc18qv-8000.brs.devtunnels.ms/api/usuarios-c";
    const router = useRouter();
    const [usuarios, setUsuarios] = useState([]);
    const [token,setToken] = useState("none");
    
    const mostrarUsuarios = useCallback(async () => {//actualizar tabla usuarios
        const response = await fetch(serverUsuarios+"/listar",{
            method:"GET",
            headers:{"Authorization":`Bearer ${token}`}
        });
        const data = await response.json();
        if(!Array.isArray(data)) {router.push('/warning?code=401'); return;} //si no esta au
        // .torizado por token entonces del back devolvera un objeto y no un array. Asi que sirve para verificar si el usuario no tiene permiso o hubo un error en el server
        setUsuarios(data);
    }, [token, router]);

    useEffect(() => {
        const initToken = Cookies.get('token');
        setToken(initToken);
    }, []);
    useEffect(()=>{
        if(token!='none')mostrarUsuarios();
    },[token, mostrarUsuarios]);
    useEffect(() => {
        mostrarUsuarios();
    }, [mostrarUsuarios]);
    //crear usuario
    const formRef = useRef();
    const crearUsuario = async () => {
        const formDatas = new FormData(formRef.current);
        const data = Object.fromEntries(formDatas.entries());
        data.isActive = data.isActive === 'true';
        await fetch(serverUsuarios+"/registerAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        formRef.current.reset();
        mostrarUsuarios();
    }
    //eliminar usuario 
    const eliminarUsuario = async (id) => {
        const response = await fetch(serverUsuarios+"/eliminar/"+id,{
            method: "DELETE",
            headers:{"Authorization":`Bearer ${token}`}
        });
        const res = await response.json();
        console.log(res.statusCode);
        if (!response.ok){
            router.push(`/warning?code=${res.statusCode}`);
        } 
        mostrarUsuarios();
    }
    //modificar usuario
    const [display, setDisplay] = useState('none');
    const [id, setId] = useState(0);
    const [usuarioModi, setUsuarioModi] = useState([]);
    
    return (
           <section>
                <ModificarUsuario id={id} display={display} setDisplay={setDisplay} mostrarUsuariosHijo={mostrarUsuarios} datosUser={usuarioModi}/>
               <input placeholder="BUSCAR" className="form-control"></input>
               <h1 style={{ textAlign: "center" }}>USUARIOS</h1>
               <form ref={formRef}>
                   <table className="table">
                       <thead>
                           <tr>
                               <th>Id</th><th>Nombre</th><th>Apellido</th><th>Nombre Usuario</th><th>Email</th>
                               <th>Password</th><th>Pais</th>
                               <th>Publicaciones</th><th>ROL</th><th>Fecha Registro</th><th>Activo</th>
                           </tr>
                       </thead>
                       <tbody>
                           {usuarios ? usuarios.map((user) => (
                               <tr key={user.id_usuario}>
                                   <td>{user.id_usuario}</td>
                                   <td>{user.nombre}</td>
                                   <td>{user.apellido}</td>
                                   <td>{user.nom_usuario}</td>
                                   <td>{user.email}</td>
                                   <td>{user.password}</td>
                                   <td>{user.pais}</td>
                                   <td>{user.publicaciones}</td>
                                   <td>{user.rol}</td>
                                   <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                                   <td>{user.isActive ? "Sí" : "No"}</td>
                                   <td><button className="btn btn-info" onClick={(e)=>{e.preventDefault(); 
                                   if(display==='none'){
                                        setDisplay('flex');
                                        setUsuarioModi(user);
                                   }else{setDisplay('none');
                                    mostrarUsuarios();
                                   }
                                      setId(user.id_usuario);
                                   }}>EDITAR</button>
                                   </td>
                                   <td>
                                       <button className="btn btn-danger" onClick={(e) => {eliminarUsuario(user.id_usuario); e.preventDefault();}}>
                                           ELIMINAR
                                       </button>
                                   </td>
                               </tr>
                           )): []}
                           <tr>
                               <td>NUEVO</td>
                               <td><input className="form-control" placeholder="Nombre" name="nombre" /></td>
                               <td><input className="form-control" placeholder="Apellido" name="apellido" /></td>
                               <td><input className="form-control p-0" placeholder="Usuario" name="nom_usuario" /></td>
                               <td><input className="form-control" placeholder="Email" name="email" /></td>
                               <td><input className="form-control" placeholder="Password" name="password" /></td>
                               <td><input className="form-control" placeholder="Pais" name="pais"/></td>
                               <td><input className="form-control" disabled /></td>
                               <td><select name="rol" className="">
                                <option selected value="usuario">usuario</option>
                                <option value="empresa">empresa</option>
                                <option value="admin">admin</option>
                               </select>
                               </td>
                               <td><input className="form-control" disabled /></td>
                               <td><select className="form-control p-0" name="isActive">
                                   <option selected value='true'>T</option>
                                   <option value='false'>F</option>
                               </select>
                               </td>
                               <td><button className="btn btn-warning" onClick={(e)=>{crearUsuario();e.preventDefault();}}>CREAR</button></td>
                           </tr>
                       </tbody>
                   </table>
               </form>
           </section>
       ); 
}