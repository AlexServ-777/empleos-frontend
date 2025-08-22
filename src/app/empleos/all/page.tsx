import MostrarEmpleos from "@/components/empleos/all";
import random_int from "@/my_functios/random_int";
import suffle_array from "@/my_functios/suffle_Array";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Empleos | JobGet-Lat',
    description: 'Encuentra las mejores oportunidades laborales en tu país, aqui en JobGet-Lat',
};

export default async function Page(){
    const cookie = await cookies();
    const pais = cookie.get('country').value;
    
    const res_total_rows = await fetch(process.env.url_front+`/back/api/empleos-c/count-empleos/${pais}?search=`); //contar la cantidad de registros hay dado el pais y busqueda null osea todos los registros
    const total_rows = await res_total_rows.json(); 
    
    const limit_rows = 10; //la cantidad de registro que tendra cada pagina
    const total_pages = Math.ceil(total_rows/limit_rows); //la cantidad de paginas que habra

    const init_page = random_int(1, total_pages); //obtener un numero random en el rango de (cantidad de paginas a 1)

    const response = await fetch(process.env.url_front+`/back/api/empleos-c/search/${pais}?page=${init_page}&limit=${limit_rows}&search=`, {
        //next:{revalidate:600} //10 minutos
    });
    const empleos= await response.json(); //obtencion de los empleos

    const pages_availabes = []; //crear un array vacio
    for(let i=1;i<=total_pages;i++){ //for para llenar un array de numeros de paginas [1,2,3,4,5,6,7...]
        if(i!==init_page) //para que no entre el numero de pagina que ya se mostro en el fetch de arriba ^
            {pages_availabes.push(i)}
    };
    suffle_array(pages_availabes);//revolver el array [3,1,2,4,6,4...] sin que se repitan
    return <MostrarEmpleos empleos={empleos} pages_availables={pages_availabes} limit_rows={limit_rows}/>
}