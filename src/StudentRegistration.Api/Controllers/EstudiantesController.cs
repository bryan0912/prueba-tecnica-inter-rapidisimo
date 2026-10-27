using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistration.Application.DTOs;
using StudentRegistration.Domain.Entities;
using StudentRegistration.Infrastructure.Data;

namespace StudentRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstudiantesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EstudiantesController(AppDbContext context) => _context = context;

    [HttpPost("registro")]
    public async Task<IActionResult> Registrar([FromBody] RegistroRequest request)
    {
        // 1. Verificar si el email ya existe
        if (await _context.Estudiantes.AnyAsync(e => e.Email == request.Email))
            return BadRequest(new { message = "El email ya está registrado." });

        // 2. Hashear contraseña con BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        
        // 3. Crear entidad (usando el constructor del dominio)
        var estudiante = new Estudiante(request.Nombre, request.Email, passwordHash);
        
        _context.Estudiantes.Add(estudiante);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(ObtenerPorId), new { id = estudiante.Id }, new { id = estudiante.Id, message = "Estudiante registrado exitosamente." });
    }

    [HttpGet("{id}")]
    [Authorize] // Requiere Token JWT
    public async Task<IActionResult> ObtenerPorId(long id)
    {
        var estudiante = await _context.Estudiantes
            .Select(e => new { e.Id, e.Nombre, e.Email, e.Activo })
            .FirstOrDefaultAsync(e => e.Id == id);

        return estudiante == null ? NotFound() : Ok(estudiante);
    }
}