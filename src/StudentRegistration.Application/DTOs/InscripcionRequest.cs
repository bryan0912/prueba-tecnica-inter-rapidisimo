namespace StudentRegistration.Application.DTOs;

public record InscripcionRequest(long EstudianteId, List<long> MateriaIds);
