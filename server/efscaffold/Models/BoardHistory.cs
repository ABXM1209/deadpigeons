using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace efscaffold.Models
{
    [Table("boardhistory", Schema = "deadpigeons")]
    public class BoardHistory
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = null!;

        [Column("userid")]
        public string UserId { get; set; } = null!;

        [Column("boardid")]
        public string BoardId { get; set; } = null!;

        [Column("won")]
        public bool Won { get; set; }

        [Column("playedat")]
        public DateTime PlayedAt { get; set; }
    }
}