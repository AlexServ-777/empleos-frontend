import { urlBackGlobal } from "@/constants/constants_backend";
import { State } from 'country-state-city';

/**
 * Obtiene los estados/provincias del país del usuario
 * @param {string} csrf - Token de autenticación
 * @param {function} setEstados - Función para actualizar el estado de los estados/provincias
 */
export const getEstadosFromApi = async (setEstados, csrf) => {
    try {
        const response = await fetch(`${urlBackGlobal}/api/usuarios-c/pais`, {
            method: "GET",
            credentials: 'include',
            headers: { "X-XSRF-Token": csrf }
        });
        
        const data = await response.json();
        const countryCode = (data.pais).slice(0, 2).toUpperCase();
        const statesData = State.getStatesOfCountry(countryCode);
        statesData.forEach(element => {
            element.name=element.name.replace('Department','').trim();
        });
        if (statesData && statesData.length > 0) {
            setEstados(statesData);
        } else {
            console.error("No se encontraron estados/provincias para el país:", countryCode);
        }
    } catch (error) {
        console.error("Error al obtener estados/provincias:", error);
    }
}; 