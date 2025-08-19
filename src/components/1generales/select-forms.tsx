'use client';

export function SelectPasantias({categoria}){
    return(<select className="form-select" name="categoria" defaultValue={categoria} required>
        <option value="INFORMATICA">INFORMATICA</option>
        <option value="MEDICINA_Y_SALUD">MEDICINA Y SALUD</option>
        <option value="DERECHO_Y_CIENCIAS_JURIDICAS">DERECHO</option>
        <option value="VETERINARIA">VETERINARIA</option>
        <option value="COCINA">COCINA</option>
        <option value="INGENIERIA">INGENIERIA</option>
        <option value="ARTE_Y_DISENOS">ARTE Y DISENOS</option>
        <option value="AGRICULTURA">AGRICULTURA</option>
        <option value="OTROS">OTROS</option>
    </select>
    );
}
export function SelectServicios({categoria}){
    return(
    <select className="form-select form-select" defaultValue={categoria} name="categoria">
        <option value="INFORMATICA">INFORMÁTICA</option>
        <option value="MEDICINA_Y_SALUD">MEDICINA Y SALUD</option>
        <option value="CARPINTERIA">CARPINTERÍA</option>
        <option value="DERECHO">DERECHO</option>
        <option value="HERRERIA">HERRERÍA</option>
        <option value="VETERINARIA">VETERINARIA</option>
        <option value="MECANICA">MECÁNICA</option>
        <option value="COCINA">COCINA</option>
        <option value="PLOMERIA">PLOMERÍA</option>
        <option value="CONSTRUCCION">CONSTRUCCIÓN</option>
        <option value="OTROS">OTROS</option>
    </select>
    );
}
export function SelectEmpleos({categoria}){
    return(
    <select className="form-select" name="categoria" defaultValue={categoria} required>
        <option value="INFORMATICA">INFORMATICA</option>
        <option value="MEDICINA_Y_SALUD">MEDICINA Y SALUD</option>
        <option value="VETERINARIA">VETERINARIA</option>
        <option value="COCINA">COCINA</option>
        <option value="INGENIERIA">INGENIERIA</option>
        <option value="ARTE_Y_DISENOS">ARTE Y DISENOS</option>
        <option value="AGRICULTURA">AGRICULTURA</option>
        <option value="OTROS">OTROS</option>
    </select>
    )
}