import React, { useState, useEffect } from 'react';

// Componente principal de la aplicación
function App() {
  const [students, setStudents] = useState([]);
  const [studentToEdit, setStudentToEdit] = useState(null);

  // Cargar datos del localStorage al iniciar la aplicación
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(storedStudents);
  }, []);

  // Guardar datos en localStorage cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  /**
   * Función para agregar o actualizar un estudiante
   * @param {Object} studentData - Datos del estudiante (nombre, asignatura, promedio)
   */
  const addOrUpdateStudent = (studentData) => {
    if (studentToEdit) {
      // Actualizar estudiante existente
      setStudents(students.map(student =>
        student.id === studentToEdit.id 
          ? { ...student, ...studentData, escala: calculateScale(studentData.promedio) }
          : student
      ));
      setStudentToEdit(null);
    } else {
      // Agregar nuevo estudiante
      const newStudent = {
        id: Date.now(),
        ...studentData,
        escala: calculateScale(studentData.promedio)
      };
      setStudents([...students, newStudent]);
    }
  };

  /**
   * Función para calcular la escala de apreciación basada en el promedio
   * @param {number} promedio - Promedio del estudiante
   * @returns {string} - Escala de apreciación
   */
  const calculateScale = (promedio) => {
    const nota = parseFloat(promedio);
    if (nota >= 1.0 && nota <= 3.9) return "Deficiente";
    if (nota >= 4.0 && nota <= 5.5) return "Con mejora";
    if (nota >= 5.6 && nota <= 6.4) return "Buen trabajo";
    if (nota >= 6.5 && nota <= 7.0) return "Destacado";
    return "Fuera de rango";
  };

  /**
   * Función para eliminar un estudiante
   * @param {number} id - ID del estudiante a eliminar
   */
  const deleteStudent = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  /**
   * Función para seleccionar un estudiante para editar
   * @param {Object} student - Estudiante a editar
   */
  const editStudent = (student) => {
    setStudentToEdit(student);
  };

  /**
   * Función para cancelar la edición
   */
  const cancelEdit = () => {
    setStudentToEdit(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#fff', marginBottom: '10px' }}>
          📚 Aplicación de Evaluación de Alumnos
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Sistema de gestión y evaluación académica con escala de apreciación
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        {/* Formulario */}
        <StudentForm 
          addOrUpdateStudent={addOrUpdateStudent} 
          studentToEdit={studentToEdit}
          cancelEdit={cancelEdit}
        />
        
        {/* Lista de estudiantes */}
        <StudentList 
          students={students} 
          deleteStudent={deleteStudent} 
          editStudent={editStudent} 
        />
      </div>

      {/* Estadísticas */}
      <Statistics students={students} />
    </div>
  );
}

// Componente del formulario para agregar/editar estudiantes
function StudentForm({ addOrUpdateStudent, studentToEdit, cancelEdit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    asignatura: '',
    promedio: ''
  });
  const [errors, setErrors] = useState({});

  // Llenar el formulario cuando se selecciona un estudiante para editar
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nombre: studentToEdit.nombre,
        asignatura: studentToEdit.asignatura,
        promedio: studentToEdit.promedio.toString()
      });
    } else {
      setFormData({ nombre: '', asignatura: '', promedio: '' });
    }
    setErrors({});
  }, [studentToEdit]);

  /**
   * Función para validar el formulario
   * @returns {boolean} - True si el formulario es válido
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.asignatura.trim()) {
      newErrors.asignatura = 'La asignatura es requerida';
    }
    
    if (!formData.promedio.trim()) {
      newErrors.promedio = 'El promedio es requerido';
    } else {
      const promedio = parseFloat(formData.promedio);
      if (isNaN(promedio) || promedio < 1.0 || promedio > 7.0) {
        newErrors.promedio = 'El promedio debe estar entre 1.0 y 7.0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Función para manejar el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = () => {
    if (validateForm()) {
      addOrUpdateStudent({
        nombre: formData.nombre.trim(),
        asignatura: formData.asignatura.trim(),
        promedio: parseFloat(formData.promedio)
      });
      setFormData({ nombre: '', asignatura: '', promedio: '' });
      setErrors({});
    }
  };

  /**
   * Función para manejar cambios en los inputs
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '25px', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        {studentToEdit ? '✏️ Editar Estudiante' : '➕ Agregar Estudiante'}
      </h2>
      
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>
            Nombre del Alumno:
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre completo"
            style={{
              width: '100%',
              padding: '10px',
              border: errors.nombre ? '2px solid #e74c3c' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          {errors.nombre && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.nombre}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>
            Asignatura:
          </label>
          <input
            type="text"
            name="asignatura"
            value={formData.asignatura}
            onChange={handleChange}
            placeholder="Ej: Matemáticas, Historia, etc."
            style={{
              width: '100%',
              padding: '10px',
              border: errors.asignatura ? '2px solid #e74c3c' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          {errors.asignatura && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.asignatura}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }}>
            Promedio (1.0 - 7.0):
          </label>
          <input
            type="number"
            name="promedio"
            value={formData.promedio}
            onChange={handleChange}
            placeholder="Ej: 6.5"
            min="1.0"
            max="7.0"
            step="0.1"
            style={{
              width: '100%',
              padding: '10px',
              border: errors.promedio ? '2px solid #e74c3c' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          {errors.promedio && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.promedio}</span>}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              flex: 1
            }}
          >
            {studentToEdit ? 'Actualizar' : 'Agregar'}
          </button>
          
          {studentToEdit && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                backgroundColor: '#FFFFFF',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar la lista de estudiantes
function StudentList({ students, deleteStudent, editStudent }) {
  if (students.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px',
        color: '#7f8c8d'
      }}>
        <h3>📝 No hay estudiantes registrados</h3>
        <p>Agrega el primer estudiante usando el formulario</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        👥 Lista de Estudiantes ({students.length})
      </h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {students.map(student => (
          <StudentCard 
            key={student.id}
            student={student}
            deleteStudent={deleteStudent}
            editStudent={editStudent}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para mostrar cada tarjeta de estudiante
function StudentCard({ student, deleteStudent, editStudent }) {
  /**
   * Función para obtener el color de la escala de apreciación
   * @param {string} escala - Escala de apreciación
   * @returns {string} - Color hex
   */
  const getScaleColor = (escala) => {
    switch (escala) {
      case 'Deficiente': return '#e74c3c';
      case 'Con mejora': return '#f39c12';
      case 'Buen trabajo': return '#f1c40f';
      case 'Destacado': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: `3px solid ${getScaleColor(student.escala)}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>
            👤 {student.nombre}
          </h3>
          <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
            <strong>📚 Asignatura:</strong> {student.asignatura}
          </p>
          <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
            <strong>📊 Promedio:</strong> {student.promedio.toFixed(1)}
          </p>
          <div style={{
            display: 'inline-block',
            padding: '5px 15px',
            backgroundColor: getScaleColor(student.escala),
            color: 'white',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}>
            {student.escala}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
          <button
            onClick={() => editStudent(student)}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => deleteStudent(student.id)}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar estadísticas
function Statistics({ students }) {
  if (students.length === 0) return null;

  // Calcular estadísticas
  const totalStudents = students.length;
  const averageGrade = students.reduce((sum, student) => sum + student.promedio, 0) / totalStudents;
  
  const scaleStats = students.reduce((acc, student) => {
    acc[student.escala] = (acc[student.escala] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ 
      marginTop: '40px', 
      padding: '25px', 
      backgroundColor: '#ecf0f1', 
      borderRadius: '10px' 
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
        📈 Estadísticas del Curso
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#3498db', margin: '0 0 10px 0' }}>Total Estudiantes</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
            {totalStudents}
          </p>
        </div>
        
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ color: '#9b59b6', margin: '0 0 10px 0' }}>Promedio General</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
            {averageGrade.toFixed(2)}
          </p>
        </div>
        
        {Object.entries(scaleStats).map(([scale, count]) => (
          <div key={scale} style={{ textAlign: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ color: '#34495e', margin: '0 0 10px 0', fontSize: '14px' }}>{scale}</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
              {count} ({((count / totalStudents) * 100).toFixed(1)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;