using Microsoft.EntityFrameworkCore;
using efscaffold.Models;

namespace efscaffold;

public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options) { }

    public virtual DbSet<Admin> Admins { get; set; }
    public virtual DbSet<Board> Boards { get; set; }
    public virtual DbSet<Transaction> Transactions { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserBoardHistory> UserBoardHistory { get; set; }
    public virtual DbSet<AdminBoard> AdminBoard { get; set; }
    public virtual DbSet<UserBoard> UserBoard { get; set; }
    public virtual DbSet<AdminBoardHistory> AdminBoardHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>().HasKey(e => e.Id).HasName("admins_pkey");
        modelBuilder.Entity<Board>().HasKey(e => e.Id).HasName("boards_pkey");
        modelBuilder.Entity<Transaction>().HasKey(e => e.Id).HasName("transactions_pkey");
        modelBuilder.Entity<User>().HasKey(e => e.Id).HasName("users_pkey");
        modelBuilder.Entity<UserBoardHistory>().HasKey(e => e.Id).HasName("userboardhistory_pkey");
        modelBuilder.Entity<AdminBoard>().HasKey(e => e.Id).HasName("adminboard_pkey");
        modelBuilder.Entity<UserBoard>().HasKey(e => e.Id).HasName("userboard_pkey");
        modelBuilder.Entity<AdminBoardHistory>().HasKey(e => e.Id).HasName("adminboardhistory_pkey");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}