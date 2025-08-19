'use client';

export default function AlertMessage({message, type}){
    return(
    <div className={`alert alert-${type}`} role="alert">
        {message}
    </div>)
}