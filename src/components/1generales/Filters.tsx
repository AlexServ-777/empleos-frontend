'use client';

import React, { useState } from 'react';

export default function Filters({ type, onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const categories = {
        empleos: [
            "INFORMATICA",
            "MEDICINA_Y_SALUD",
            "VETERINARIA",
            "COCINA",
            "INGENIERIA",
            "ARTE_Y_DISENOS",
            "AGRICULTURA",
            "OTROS"
        ],
        pasantias: [
            "INFORMATICA",
            "MEDICINA_Y_SALUD",
            "VETERINARIA",
            "COCINA",
            "INGENIERIA",
            "ARTE_Y_DISENOS",
            "AGRICULTURA",
            "OTROS"
        ],
        servicios: [
            "INFORMATICA",
            "MEDICINA_Y_SALUD",
            "CARPINTERIA",
            "HERRERIA",
            "VETERINARIA",
            "MECANICA",
            "COCINA",
            "PLOMERIA",
            "CONSTRUCCION",
            "OTROS"
        ]
    };

    const modalidades = ["Presencial", "Remoto", "Hibrido"];

    const handleApplyFilters = () => {
        onFilterChange('apply', true);
        // Esperamos un momento para asegurarnos que los resultados se hayan actualizado
        setTimeout(() => {
            const resultsList = document.querySelector('ul');
            if (resultsList) {
                resultsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <div className="filters-container">
            <div className="filters-header" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="filters-title">
                    <i className="bi bi-funnel-fill me-2"></i>
                    Filtros
                </h3>
                <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} filters-toggle`}></i>
            </div>

            <div className={`filters-content ${isOpen ? 'show' : ''}`}>
                <div className="filter-section">
                    <h4 className="filter-section-title">Categoría</h4>
                    <div className="filter-options">
                        {categories[type].map((category) => (
                            <label key={category} className="filter-option">
                                <input
                                    type="checkbox"
                                    name="category"
                                    value={category}
                                    onChange={(e) => onFilterChange('category', e.target.value)}
                                />
                                <span className="filter-label">{category.replace('_', ' ')}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h4 className="filter-section-title">Modalidad</h4>
                    <div className="filter-options">
                        {modalidades.map((modalidad) => (
                            <label key={modalidad} className="filter-option">
                                <input
                                    type="checkbox"
                                    name="modalidad"
                                    value={modalidad}
                                    onChange={(e) => onFilterChange('modalidad', e.target.value)}
                                />
                                <span className="filter-label">{modalidad}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {type === 'empleos' && (
                    <div className="filter-section">
                        <h4 className="filter-section-title">Rango de Salario</h4>
                        <div className="range-inputs row p-3">
                            <input
                                className='col-12 col-md-5'
                                type="number"
                                placeholder="Mínimo"
                                onChange={(e) => onFilterChange('salarioMin', e.target.value)}
                            />
                            <span className='col-12 col-md-1 text-center'>a</span>
                            <input
                                className='col-12 col-md-5'
                                type="number"
                                placeholder="Máximo"
                                onChange={(e) => onFilterChange('salarioMax', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="filter-section">
                    <h4 className="filter-section-title">Ubicación</h4>
                    <input
                        type="text"
                        placeholder="Ciudad o zona"
                        className="location-input"
                        onChange={(e) => onFilterChange('ubicacion', e.target.value)}
                    />
                </div>

                <div className="filters-actions">
                    <button 
                        className="btn-apply-filters"
                        onClick={handleApplyFilters}
                    >
                        Aplicar Filtros
                    </button>
                    <button 
                        className="btn-clear-filters"
                        onClick={() => onFilterChange('clear', true)}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
} 