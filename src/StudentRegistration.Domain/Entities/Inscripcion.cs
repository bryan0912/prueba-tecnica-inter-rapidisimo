namespace StudentRegistration.Domain.Entities;

public class Inscripcion
{
    public long Id { get; private set; }
    public long EstudianteId { get; private set; }
    public long MateriaId { get; private set; }
    public DateTime FechaInscripcion { get; private set; } = DateTime.UtcNow;
    public Estudiante Estudiante { get; private set; } = null!;
    public Materia Materia { get; private set; } = null!;

    private Inscripcion() { }

    public Inscripcion(long estudianteId, long materiaId)
    {
        EstudianteId = estudianteId;
        MateriaId = materiaId;
    }
}