using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace efscaffold.Models
{
    [Table("userboardhistory", Schema = "deadpigeons")]
    public class UserBoardHistory
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = null!;

        [Column("userid")]
        public string UserId { get; set; } = null!;

        [Column("boardid")]
        public string BoardId { get; set; } = null!;

        [Column("iswinner")]
        public bool IsWinner { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }
    }
}