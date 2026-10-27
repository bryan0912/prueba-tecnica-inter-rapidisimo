namespace StudentRegistration.Domain.Entities;

public class Profesor
{
    public long Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public ICollection<Materia> Materias { get; private set; } = new List<Materia>();

    private Profesor() { }

    public Profesor(string nombre)
    {
        Nombre = nombre;
    }
}