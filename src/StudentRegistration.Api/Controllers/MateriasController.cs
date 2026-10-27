using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistration.Application.DTOs;
using StudentRegistration.Domain.Exceptions;
using StudentRegistration.Infrastructure.Data;

namespace StudentRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Todo este controlador requiere autenticación JWT
public class MateriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public MateriasController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var materias = await _context.Materias
            .Include(m => m.Profesor)
            .Select(m => new { m.Id, m.Nombre, m.Creditos, Profesor = m.Profesor.Nombre })
            .ToListAsync();
        return Ok(materias);
    }

    [HttpPost("inscribir")]
public async Task<IActionResult> Inscribir([FromBody] InscripcionRequest request)
{
    // 1. Buscar al estudiante CON sus inscripciones actuales
    var estudiante = await _context.Estudiantes
        .Include(e => e.Inscripciones) // <-- IMPORTANTE: Traemos sus materias actuales
        .FirstOrDefaultAsync(e => e.Id == request.EstudianteId);

    if (estudiante == null) return NotFound(new { message = "Estudiante no encontrado." });

    // 2. REGLA DE NEGOCIO: Validar si ya tiene 3 materias inscritas
    if (estudiante.Inscripciones.Count + request.MateriaIds.Count > 3)
    {
        return BadRequest(new { message = "El estudiante ya tiene materias inscritas. No puede superar las 3 materias en total." });
    }

    // 3. Buscar las materias seleccionadas
    var materias = await _context.Materias
        .Include(m => m.Profesor)
        .Where(m => request.MateriaIds.Contains(m.Id))
        .ToListAsync();

    if (materias.Count != request.MateriaIds.Count)
        return BadRequest(new { message = "Una o más materias no existen." });

    try
    {
        // 4. Validar reglas de negocio del dominio (Profesores repetidos y cantidad)
        // NOTA: Aquí deberíamos validar que los profesores de las NUEVAS materias no choquen con los de las materias YA inscritas.
        var todasLasMaterias = materias;
        if (estudiante.Inscripciones.Any())
        {
             var materiasPrevias = await _context.Materias
                .Where(m => estudiante.Inscripciones.Select(i => i.MateriaId).Contains(m.Id))
                .ToListAsync();
             todasLasMaterias.AddRange(materiasPrevias);
        }

        estudiante.ValidarInscripcion(todasLasMaterias);

        // 5. Guardar inscripciones
        foreach (var materia in materias)
        {
            _context.Inscripciones.Add(new Domain.Entities.Inscripcion(estudiante.Id, materia.Id));
        }
        await _context.SaveChangesAsync();

        return Ok(new { message = "Inscripción exitosa." });
    }
    catch (MaxSubjectsExceededException ex)
    {
        return BadRequest(new { message = ex.Message }); 
    }
    catch (DuplicateProfessorException ex)
    {
        return Conflict(new { message = ex.Message }); 
    }
}

    // Endpoint para la Regla 9: Ver nombres de compañeros por materia
    [HttpGet("companeros/{estudianteId}")]
    public async Task<IActionResult> VerCompaneros(long estudianteId)
    {
        // Lógica: Buscar las materias del estudiante, y para cada una, los nombres de otros inscritos
        var resultado = await _context.Inscripciones
            .Where(i => i.EstudianteId == estudianteId)
            .Select(i => new
            {
                Materia = i.Materia.Nombre,
                Companeros = _context.Inscripciones
                    .Where(ci => ci.MateriaId == i.MateriaId && ci.EstudianteId != estudianteId)
                    .Select(ci => ci.Estudiante.Nombre)
                    .ToList()
            })
            .ToListAsync();

        return Ok(resultado);
    }

        [HttpDelete("cancelar/{estudianteId}/{materiaId}")]
    public async Task<IActionResult> CancelarInscripcion(long estudianteId, long materiaId)
    {
        var inscripcion = await _context.Inscripciones
            .FirstOrDefaultAsync(i => i.EstudianteId == estudianteId && i.MateriaId == materiaId);

        if (inscripcion == null)
            return NotFound(new { message = "No se encontró la inscripción." });

        _context.Inscripciones.Remove(inscripcion);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Materia cancelada exitosamente." });
    }

        [HttpGet("mis-materias/{estudianteId}")]
    public async Task<IActionResult> MisMaterias(long estudianteId)
    {
        var inscripciones = await _context.Inscripciones
            .Where(i => i.EstudianteId == estudianteId)
            .Include(i => i.Materia)
            .Select(i => new { 
                i.MateriaId, 
                i.Materia.Nombre 
            })
            .ToListAsync();

        return Ok(inscripciones);
    }
}