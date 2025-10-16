using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Users",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "CourseID",
                table: "Courses",
                newName: "course_id");

            migrationBuilder.RenameColumn(
                name: "CourseName",
                table: "Courses",
                newName: "description");

            migrationBuilder.AddColumn<DateTime>(
                name: "DOB",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "category_id",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_AT",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_AT",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "first_name",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "gender",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "last_name",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "level_id",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "password",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "profile_img",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "usertype",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "category_id",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "cooking_time_min",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "course_img",
                table: "Courses",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "course_type",
                table: "Courses",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "deleted",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "level_id",
                table: "Courses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "rating",
                table: "Courses",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "Courses",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    cat_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    cat_banner = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "Levels",
                columns: table => new
                {
                    level_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Levels", x => x.level_id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_category_id",
                table: "Users",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_level_id",
                table: "Users",
                column: "level_id");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_category_id",
                table: "Courses",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_level_id",
                table: "Courses",
                column: "level_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Categories_category_id",
                table: "Courses",
                column: "category_id",
                principalTable: "Categories",
                principalColumn: "category_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Levels_level_id",
                table: "Courses",
                column: "level_id",
                principalTable: "Levels",
                principalColumn: "level_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Categories_category_id",
                table: "Users",
                column: "category_id",
                principalTable: "Categories",
                principalColumn: "category_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Levels_level_id",
                table: "Users",
                column: "level_id",
                principalTable: "Levels",
                principalColumn: "level_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Categories_category_id",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Levels_level_id",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Categories_category_id",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Levels_level_id",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Levels");

            migrationBuilder.DropIndex(
                name: "IX_Users_category_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_level_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Courses_category_id",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_level_id",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DOB",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "category_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "created_AT",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "deleted_AT",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "first_name",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "last_name",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "level_id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "password",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "profile_img",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "usertype",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "category_id",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "cooking_time_min",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "course_img",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "course_type",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "deleted",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "level_id",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "rating",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "title",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Users",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "course_id",
                table: "Courses",
                newName: "CourseID");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Courses",
                newName: "CourseName");
        }
    }
}
