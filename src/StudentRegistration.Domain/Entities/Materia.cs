namespace StudentRegistration.Domain.Entities;

public class Materia
{
    public long Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public int Creditos { get; private set; } = 3;
    public long ProfesorId { get; private set; }
    public Profesor Profesor { get; private set; } = null!;

    private Materia() { }

    public Materia(string nombre, long profesorId)
    {
        Nombre = nombre;
        ProfesorId = profesorId;
        Creditos = 3; // Regla de negocio de la prueba
    }
}