using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class MakeCourseIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPosts_Courses_course_id",
                table: "UserPosts");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPosts_Courses_course_id",
                table: "UserPosts",
                column: "course_id",
                principalTable: "Courses",
                principalColumn: "course_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPosts_Courses_course_id",
                table: "UserPosts");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPosts_Courses_course_id",
                table: "UserPosts",
                column: "course_id",
                principalTable: "Courses",
                principalColumn: "course_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
