import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const controlModules = [
    'Análisis de Precios Unitarios (APU)',
    'Presupuestos',
    'Cronograma de Obra (Gantt)',
    'Control de Avance Físico y Financiero',
    'Costos Indirectos',
    'Programa Financiero (Flujo de Caja)',
    'Reportes y Exportación',
    'Control de Calidad y Bitácora de Obra (opcional)',
    'Dashboard Personalizable',
    'Módulo Offline / Modo Sin Conexión',
  ];

  const adminModules = [
    'Usuarios y Autenticación',
    'Control de Roles y Permisos',
    'Importación y Sincronización de Datos',
    'Integración con Otros Sistemas (API)',
    'Colaboración y Comunicación',
    'Control de Versiones y Auditoría',
    'Notificaciones y Alertas',
    'Módulo de Machine Learning (opcional)',
  ];

  return (
    // Dynamically apply width based on collapsed state
    <div className={`bg-gray-800 text-white p-4 fixed h-full ${isCollapsed ? 'w-16' : 'w-64'} transition-width duration-300`}>
      {/* Toggle button */}
      <button onClick={handleToggle} className="mb-4">
        {isCollapsed ? '>' : '<'}
      </button>
      {/* Conditionally render content based on collapsed state */}
      {!isCollapsed && (
        <div>
          <h3 className="text-lg font-bold mb-2">Módulos de Control de Obra</h3>
          <ul>
            {controlModules.map((module, index) => (
              <li key={index} className="mb-1"> {/* Replace with Link components later */}
                {module}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold mt-4 mb-2">Módulos Administrativos / de Gestión</h3> {/* Added mt-4 for spacing */}
          <ul>
            {adminModules.map((module, index) => (
              <li key={index} className="mb-1">
                {module}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;