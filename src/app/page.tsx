import Home from "@/components";
import random_int from "@/my_functios/random_int";
import suffle_array from "@/my_functios/suffle_Array";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'ENCUENTRA EMPLEOS, PASANTIAS Y SERVICIOS EN UN SOLO LUGAR | JobGet-Lat',
    description: 'Encuentra todas tus oportunidades aqui en un solo lugar, aqui en JobGet-Lat',
};
export default async function Page() {
    try {
        const cookie = await cookies();
        const pais = cookie.get('country').value;

        const pagination_emp = await count_itmes_fetch('empleos', pais);
        const responseEmp = await fetch(process.env.url_front + `/back/api/empleos-c/search/${pais}?page=${pagination_emp.init_page}&limit=${pagination_emp.limit}&search=`, {
            //next:{revalidate:1800}
        });
        const dataEmp = await responseEmp.json();
        const empleos = dataEmp.map(empleo=>{
            return {...empleo, type:"empleo", id:empleo.id_empleo}
        })

        //pasantias
        const pagination_pas = await count_itmes_fetch('pasantias', pais);
        const responsePas = await fetch(process.env.url_front + `/back/api/pasantias-c/search/${pais}?page=${pagination_pas.init_page}&limit=${pagination_pas.limit}&search=`,{
            //next:{revalidate:1800}
        });
        const dataPas = await responsePas.json();
        const pasantias = dataPas.map(pasantia=>{
            return{...pasantia,type:"pasantia", id:pasantia.id_pasantia}
        })

        //servicios
        const pagination_ser = await count_itmes_fetch('servicios', pais);
        const responseSer = await fetch(process.env.url_front + `/back/api/servicios-c/search/${pais}?page=${pagination_ser.init_page}&limit=${pagination_ser.limit}&search=`,{
            //next:{revalidate:1800}
        });
        const dataSer = await responseSer.json();
        const servicios = dataSer.map(servicio=>{
            return {...servicio, type:"servicio",id:servicio.id_servicio}
        })

        //renderizar los datos
        const items = [...empleos,...pasantias,...servicios]; //barajear el array
        suffle_array(items);
        return <Home items_ssr={items} 
        page_ava_emp={pagination_emp.pages_availables}
        page_ava_pas={pagination_pas.pages_availables}
        page_ava_ser={pagination_ser.pages_availables}
        limit={pagination_emp.limit}
        />
    }
    catch (error) {
        console.log("error xd:" + error)
    }
}

async function count_itmes_fetch(type_fetch:string, country:string) {
        const response = await fetch(process.env.url_front+`/back/api/${type_fetch}-c/count-${type_fetch}/${country}?search=`); //fetch para contar la cantidad de registros
        const count_items = await response.json();  //obvio se transforma en json la res
        const limit = 5;    //limite de cada fetch de la paginacion
        const total_pages = Math.ceil(count_items/limit);   //la cantidad de paginas disponibles calculadas a base del total de items
        const init_page = random_int(1,total_pages);    //inicializar una pagina random para el fetch de aqui (SSR)
        const pages_availables = [];    //para crear una lista de paginacion random
        for(let i=1;i<=total_pages;i++){
            if(i!=init_page){
                pages_availables.push(i);   //setear el numero de pagina si y solo si la pagina inicial es diferente a los demas para evitar que se repita en la lectura del componente posterior
            }
        }
        suffle_array(pages_availables); //revolver el listado de paginas
        return {
            init_page:init_page,
            pages_availables:pages_availables,
            limit:limit
        }
}