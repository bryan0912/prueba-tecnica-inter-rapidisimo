using StudentRegistration.Domain.Exceptions;

namespace StudentRegistration.Domain.Entities;

public class Estudiante
{
    public long Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool Activo { get; private set; } = true;
    public ICollection<Inscripcion> Inscripciones { get; private set; } = new List<Inscripcion>();

    private Estudiante() { }

    public Estudiante(string nombre, string email, string passwordHash)
    {
        Nombre = nombre;
        Email = email;
        PasswordHash = passwordHash;
        Activo = true;
    }

    // Regla de Negocio Senior: Validación en el Dominio
    public void ValidarInscripcion(List<Materia> materiasSeleccionadas)
    {
        if (materiasSeleccionadas.Count > 3)
            throw new MaxSubjectsExceededException();

        var profesoresUnicos = materiasSeleccionadas.Select(m => m.ProfesorId).Distinct().Count();
        if (profesoresUnicos != materiasSeleccionadas.Count)
        {
            var profesorRepetidoId = materiasSeleccionadas
                .GroupBy(m => m.ProfesorId)
                .First(g => g.Count() > 1).Key;
                
            var nombreProfesor = materiasSeleccionadas.First(m => m.ProfesorId == profesorRepetidoId).Profesor.Nombre;
            throw new DuplicateProfessorException(nombreProfesor);
        }
    }
}