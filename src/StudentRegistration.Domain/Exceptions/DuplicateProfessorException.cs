namespace StudentRegistration.Domain.Exceptions;

public class DuplicateProfessorException : DomainException
{
    public DuplicateProfessorException(string profesorNombre) 
        : base($"El estudiante no puede tener clases con el mismo profesor ({profesorNombre}).") { }
}