using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMetricToText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // SQLite can't alter column types directly. Recreate CoursePrepItems table with metric as TEXT.
            // Suppress the ambient EF transaction because this SQL already contains
            // explicit BEGIN/COMMIT statements. Executing it inside EF's transaction
            // would cause a nested transaction error on SQLite.
            migrationBuilder.Sql(@"
PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS __CoursePrepItems_new (
    course_prep_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    item_img TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    metric TEXT NOT NULL DEFAULT '',
    deleted INTEGER NOT NULL,
    course_id INTEGER NOT NULL
);
INSERT INTO __CoursePrepItems_new (course_prep_item_id, title, description, item_img, type, amount, metric, deleted, course_id)
    SELECT course_prep_item_id, title, description, item_img, type, amount, CAST(metric AS TEXT), deleted, course_id
    FROM CoursePrepItems;
DROP TABLE CoursePrepItems;
ALTER TABLE __CoursePrepItems_new RENAME TO CoursePrepItems;
CREATE INDEX IF NOT EXISTS IX_CoursePrepItems_CourseId ON CoursePrepItems(course_id);
COMMIT;
PRAGMA foreign_keys=on;
", suppressTransaction: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Recreate the previous schema (metric as REAL) if rolling back
            migrationBuilder.Sql(@"
PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS __CoursePrepItems_old (
    course_prep_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    item_img TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    metric REAL,
    deleted INTEGER NOT NULL,
    course_id INTEGER NOT NULL
);
INSERT INTO __CoursePrepItems_old (course_prep_item_id, title, description, item_img, type, amount, metric, deleted, course_id)
    SELECT course_prep_item_id, title, description, item_img, type, amount, CASE WHEN metric GLOB '*[^0-9.-]*' THEN NULL ELSE CAST(metric AS REAL) END, deleted, course_id
    FROM CoursePrepItems;
DROP TABLE CoursePrepItems;
ALTER TABLE __CoursePrepItems_old RENAME TO CoursePrepItems;
CREATE INDEX IF NOT EXISTS IX_CoursePrepItems_CourseId ON CoursePrepItems(course_id);
COMMIT;
PRAGMA foreign_keys=on;
", suppressTransaction: true);
        }
    }
}
