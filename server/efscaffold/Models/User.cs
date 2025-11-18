using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace efscaffold.Models;

[Table("users", Schema = "deadpigeons")]
public partial class User
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("phone")]
    public string Phone { get; set; } = null!;

    [Column("email")]
    public string Email { get; set; } = null!;

    [Column("password")]
    public string Password { get; set; } = null!;

    [Column("balance")]
    public int Balance { get; set; }

    [Column("isactive")]
    public bool Isactive { get; set; }
}
