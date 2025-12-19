using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("boards", Schema = "deadpigeons")]
public partial class Board
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = null!;

    [Column("isopen")]
    public bool IsOpen { get; set; }

    [Column("weeknumber")]
    public int WeekNumber { get; set; }
}