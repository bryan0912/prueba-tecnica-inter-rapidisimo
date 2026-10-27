using Microsoft.EntityFrameworkCore;
using StudentRegistration.Domain.Entities;

namespace StudentRegistration.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Profesor> Profesores => Set<Profesor>();
    public DbSet<Materia> Materias => Set<Materia>();
    public DbSet<Estudiante> Estudiantes => Set<Estudiante>();
    public DbSet<Inscripcion> Inscripciones => Set<Inscripcion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Estudiante>(entity =>
        {
            entity.ToTable("estudiantes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Materia>(entity =>
        {
            entity.ToTable("materias");
            entity.HasKey(m => m.Id);
            entity.HasOne(m => m.Profesor)
                  .WithMany(p => p.Materias)
                  .HasForeignKey(m => m.ProfesorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Inscripcion>(entity =>
        {
            entity.ToTable("inscripciones");
            entity.HasKey(i => i.Id);
            entity.HasIndex(i => new { i.EstudianteId, i.MateriaId }).IsUnique();

            entity.HasOne(i => i.Estudiante)
                  .WithMany(e => e.Inscripciones)
                  .HasForeignKey(i => i.EstudianteId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Materia)
                  .WithMany()
                  .HasForeignKey(i => i.MateriaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}