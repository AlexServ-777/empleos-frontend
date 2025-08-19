export default function suffle_array(array:any[]){
    for (let i = array.length - 1; i > 0; i--) {
        // escoges un índice random entre 0 e i
        const j = Math.floor(Math.random() * (i + 1));
        // swap, intercambio los valores
        [array[i], array[j]] = [array[j], array[i]];
      }
    return array;
}