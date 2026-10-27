using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudentRegistration.Application.DTOs;
using StudentRegistration.Infrastructure.Data;

namespace StudentRegistration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var estudiante = await _context.Estudiantes
            .FirstOrDefaultAsync(e => e.Email == request.Email && e.Activo);

        if (estudiante == null || !BCrypt.Net.BCrypt.Verify(request.Password, estudiante.PasswordHash))
            return Unauthorized(new { message = "Credenciales inválidas." });

        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtSettings = _configuration.GetSection("JwtSettings");
       
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, estudiante.Id.ToString()),
                new Claim(ClaimTypes.Email, estudiante.Email),
                new Claim(ClaimTypes.Name, estudiante.Nombre)
            }),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"]!)),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Ok(new LoginResponse(tokenHandler.WriteToken(token), estudiante.Nombre, estudiante.Email, estudiante.Id));
    }
}