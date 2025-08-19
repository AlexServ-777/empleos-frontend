export default function End_message_scroll({type}){
    return(
        <div className="text-center" style={{fontWeight:"bold"}}>
            <p>{type==='final'?"Llegaste al final!":"No se encontraron resultados!"}</p>
        </div>
    )
}