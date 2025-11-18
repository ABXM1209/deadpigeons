using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace efscaffold.Models;

[Table("boards", Schema = "deadpigeons")]
public partial class Board
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("weeknumber")]
    public DateTime? Weeknumber { get; set; }

    [Column("totalwinners")]
    public int Totalwinners { get; set; }

    [Column("winningnumbers")]
    public string Winningnumbers { get; set; } = null!;

    [Column("winningusers")]
    public string Winningusers { get; set; } = null!;

    [Column("isopen")]
    public bool Isopen { get; set; }
}
