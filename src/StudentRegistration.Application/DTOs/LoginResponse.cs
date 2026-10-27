namespace StudentRegistration.Application.DTOs;

public record LoginResponse(string Token, string Nombre, string Email, long Id);