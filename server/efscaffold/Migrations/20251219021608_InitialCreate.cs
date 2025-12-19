using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace efscaffold.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "deadpigeons");

            migrationBuilder.CreateTable(
                name: "adminboard",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    boardid = table.Column<string>(type: "text", nullable: false),
                    winningnumbers = table.Column<int[]>(type: "integer[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("adminboard_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "adminboardhistory",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    boardid = table.Column<string>(type: "text", nullable: false),
                    totalwinners = table.Column<int>(type: "integer", nullable: false),
                    winningusers = table.Column<string[]>(type: "text[]", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("adminboardhistory_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "admins",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("admins_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "boards",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    isopen = table.Column<bool>(type: "boolean", nullable: false),
                    weeknumber = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("boards_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "transactions",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    username = table.Column<string>(type: "text", nullable: false),
                    userid = table.Column<string>(type: "text", nullable: false),
                    transactionid = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    balance = table.Column<int>(type: "integer", nullable: false),
                    transactiondate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("transactions_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "userboard",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    boardid = table.Column<string>(type: "text", nullable: false),
                    userid = table.Column<string>(type: "text", nullable: false),
                    guessingnumbers = table.Column<int[]>(type: "integer[]", nullable: false),
                    weekrepeat = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("userboard_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "userboardhistory",
                schema: "deadpigeons",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    userid = table.Column<string>(type: "text", nullable: false),
                    boardid = table.Column<string>(type: "text", nullable: false),
                    iswinner = table.Column<bool>(type: "boolean", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("userboardhistory_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: true),
                    Balance = table.Column<int>(type: "integer", nullable: false),
                    Isactive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("users_pkey", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adminboard",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "adminboardhistory",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "admins",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "boards",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "transactions",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "userboard",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "userboardhistory",
                schema: "deadpigeons");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
