using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using efscaffold.Models;
using DotNetEnv;

namespace efscaffold;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Board> Boards { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        DotNetEnv.Env.Load(); // load the .env file
        var connectionString = Environment.GetEnvironmentVariable("DbConnectionString");

        if (!string.IsNullOrEmpty(connectionString))
        {
            optionsBuilder.UseNpgsql(connectionString);
        }
        else
        {
            throw new InvalidOperationException("Connection string not found in environment variables.");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("admins_pkey");
        });

        modelBuilder.Entity<Board>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("boards_pkey");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("transactions_pkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
