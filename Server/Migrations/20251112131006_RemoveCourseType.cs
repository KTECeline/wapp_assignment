using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCourseType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // SQLite does not support DROP COLUMN directly. Recreate the table without the column.
            migrationBuilder.Sql(@"
PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS __Courses_new (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    badge_img TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    cooking_time_min INTEGER NOT NULL,
    course_img TEXT NOT NULL,
    deleted INTEGER NOT NULL,
    description TEXT NOT NULL,
    level_id INTEGER NOT NULL,
    quiz_badge_img TEXT NOT NULL,
    rating REAL NOT NULL,
    servings INTEGER NOT NULL,
    title TEXT NOT NULL,
    video TEXT NOT NULL
);
INSERT INTO __Courses_new (course_id, badge_img, category_id, cooking_time_min, course_img, deleted, description, level_id, quiz_badge_img, rating, servings, title, video)
    SELECT course_id, badge_img, category_id, cooking_time_min, course_img, deleted, description, level_id, quiz_badge_img, rating, servings, title, video
    FROM Courses;
DROP TABLE Courses;
ALTER TABLE __Courses_new RENAME TO Courses;
CREATE INDEX IF NOT EXISTS IX_Courses_CategoryId ON Courses(category_id);
CREATE INDEX IF NOT EXISTS IX_Courses_LevelId ON Courses(level_id);
COMMIT;
PRAGMA foreign_keys=on; 
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Recreate column if rolling back
            migrationBuilder.AddColumn<string>(
                name: "course_type",
                table: "courses",
                type: "TEXT",
                nullable: true);
        }
    }
}
