using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("userboard", Schema = "deadpigeons")]
public class UserBoard
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("boardid")]
    public string BoardId { get; set; } = null!;

    [Column("userid")]
    public string UserId { get; set; } = null!;

    [Column("guessingnumbers")]
    public int[] GuessingNumbers { get; set; } = null!;

    [Column("weekrepeat")]
    public int WeekRepeat { get; set; }
}