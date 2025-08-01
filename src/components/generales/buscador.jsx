'use client';

import { useState, useEffect } from 'react';


export default function Buscador({ onSearch, placeholder = "Buscar..." }) {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        // Debounce para evitar demasiadas búsquedas mientras el usuario escribe
        const timeoutId = setTimeout(() => {
            onSearch(searchValue);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearch]);

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleClear = () => {
        setSearchValue("");
        onSearch("");
    };

    return (
        <div className="buscador-container">
            <div className="search-input-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={handleSearch}
                />
                {searchValue && (
                    <button 
                        className="clear-button"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        <i className="bi bi-x"></i>
                    </button>
                )}
            </div>
        </div>
    );
}