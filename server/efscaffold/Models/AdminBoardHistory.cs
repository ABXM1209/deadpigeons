using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("adminboardhistory", Schema = "deadpigeons")]
public class AdminBoardHistory
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("boardid")]
    public string BoardId { get; set; } = null!;

    [Column("totalwinners")]
    public int TotalWinners { get; set; }

    [Column("winningusers")]
    public string[] WinningUsers { get; set; } = null!;

    [Column("date")]
    public DateTime Date { get; set; }
}