namespace StudentRegistration.Domain.Exceptions;

public class MaxSubjectsExceededException : DomainException
{
    public MaxSubjectsExceededException() : base("Un estudiante no puede inscribir más de 3 materias.") { }
}