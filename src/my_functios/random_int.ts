export default function random_int(min:number, max:number){
    //random es de 0 a 1. 0 puede ser exacto, pero 1 no, seria maximo 0.999999
    const num_generated = Math.floor(Math.random()*(max-min+1)+min) //multiplicamos el random por el resultado de max-min+1 y +min
    return num_generated;
}