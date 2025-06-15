import path from "path"
import fs from "fs"
export function GET(request){
    const {searchParams} = new URL(request.url)
    const categoria =  searchParams.get('categoria')//obtener el parametro de la url
    const directorio = path.join(process.cwd(),"public/imagesCategorias/"); //obtener el directorio
    const files = fs.readdirSync(directorio); //obtener los archivos del directorio
    const image = files.find(file=>file.split('.')[0]===categoria); //buscar la imagen requeria segun categoria del parametro
    if(image){
        return Response.json({image:`/imagesCategorias/${image}`}); //retornar la imagen
    }
    else{
        return Response.json({image:`/imagesCategorias/OTROS.jpg`},{status:404}) //retornar default imagen si no se encuentra una
    }
}