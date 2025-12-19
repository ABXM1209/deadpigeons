using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("adminboard", Schema = "deadpigeons")]
public class AdminBoard
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("boardid")]
    public string BoardId { get; set; } = null!;

    [Column("winningnumbers")]
    public int[] WinningNumbers { get; set; } = null!;
}