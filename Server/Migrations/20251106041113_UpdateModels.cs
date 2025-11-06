using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "badge_img",
                table: "Courses",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "quiz_badge_img",
                table: "Courses",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AdminActivities",
                columns: table => new
                {
                    activity_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    action_type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    entity = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    entity_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminActivities", x => x.activity_id);
                    table.ForeignKey(
                        name: "FK_AdminActivities_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Announcements",
                columns: table => new
                {
                    ann_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    ann_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    visible = table.Column<bool>(type: "INTEGER", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcements", x => x.ann_id);
                });

            migrationBuilder.CreateTable(
                name: "Badges",
                columns: table => new
                {
                    badge_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    entity_id = table.Column<int>(type: "INTEGER", nullable: false),
                    requirement = table.Column<int>(type: "INTEGER", nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    badge_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badges", x => x.badge_id);
                });

            migrationBuilder.CreateTable(
                name: "CoursePrepItems",
                columns: table => new
                {
                    course_prep_item_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    item_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    amount = table.Column<float>(type: "REAL", nullable: false),
                    metric = table.Column<float>(type: "REAL", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoursePrepItems", x => x.course_prep_item_id);
                    table.ForeignKey(
                        name: "FK_CoursePrepItems_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseStats",
                columns: table => new
                {
                    course_stats_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false),
                    total_enrollments = table.Column<int>(type: "INTEGER", nullable: false),
                    completion_rate = table.Column<int>(type: "INTEGER", nullable: false),
                    average_rating = table.Column<int>(type: "INTEGER", nullable: false),
                    total_reviews = table.Column<int>(type: "INTEGER", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseStats", x => x.course_stats_id);
                    table.ForeignKey(
                        name: "FK_CourseStats_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseSteps",
                columns: table => new
                {
                    course_step_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    step = table.Column<int>(type: "INTEGER", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    course_step_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseSteps", x => x.course_step_id);
                    table.ForeignKey(
                        name: "FK_CourseSteps_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseTips",
                columns: table => new
                {
                    course_tip_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseTips", x => x.course_tip_id);
                    table.ForeignKey(
                        name: "FK_CourseTips_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseUserActivities",
                columns: table => new
                {
                    activity_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false),
                    quiz_status = table.Column<string>(type: "TEXT", nullable: false),
                    quiz_start_time = table.Column<DateTime>(type: "TEXT", nullable: true),
                    quiz_end_time = table.Column<DateTime>(type: "TEXT", nullable: true),
                    quiz_total_time = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    quiz_mistake = table.Column<int>(type: "INTEGER", nullable: false),
                    quiz_progress = table.Column<int>(type: "INTEGER", nullable: false),
                    bookmark = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseUserActivities", x => x.activity_id);
                    table.ForeignKey(
                        name: "FK_CourseUserActivities_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseUserActivities_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HelpSessions",
                columns: table => new
                {
                    session_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    start_session = table.Column<DateTime>(type: "TEXT", nullable: false),
                    end_session = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HelpSessions", x => x.session_id);
                    table.ForeignKey(
                        name: "FK_HelpSessions_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    question_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    question = table.Column<string>(type: "TEXT", nullable: false),
                    question_type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.question_id);
                    table.ForeignKey(
                        name: "FK_Questions_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFeedbacks",
                columns: table => new
                {
                    feedback_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false),
                    rating = table.Column<int>(type: "INTEGER", nullable: false),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    created_AT = table.Column<DateTime>(type: "TEXT", nullable: false),
                    edited_AT = table.Column<DateTime>(type: "TEXT", nullable: true),
                    deleted_AT = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFeedbacks", x => x.feedback_id);
                    table.ForeignKey(
                        name: "FK_UserFeedbacks_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFeedbacks_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLoginActivities",
                columns: table => new
                {
                    activity_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    login_date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    logout_date = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLoginActivities", x => x.activity_id);
                    table.ForeignKey(
                        name: "FK_UserLoginActivities_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPosts",
                columns: table => new
                {
                    post_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    course_id = table.Column<int>(type: "INTEGER", nullable: false),
                    title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", nullable: false),
                    post_img = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    approve_status = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    created_AT = table.Column<DateTime>(type: "TEXT", nullable: false),
                    deleted_AT = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPosts", x => x.post_id);
                    table.ForeignKey(
                        name: "FK_UserPosts_Courses_course_id",
                        column: x => x.course_id,
                        principalTable: "Courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPosts_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserStatistics",
                columns: table => new
                {
                    stats_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    total_courses_done = table.Column<int>(type: "INTEGER", nullable: false),
                    total_posts = table.Column<int>(type: "INTEGER", nullable: false),
                    total_likes_received = table.Column<int>(type: "INTEGER", nullable: false),
                    updated_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStatistics", x => x.stats_id);
                    table.ForeignKey(
                        name: "FK_UserStatistics_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    message_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    session_id = table.Column<int>(type: "INTEGER", nullable: false),
                    content = table.Column<string>(type: "TEXT", nullable: false),
                    sent_date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    sent_by_admin = table.Column<bool>(type: "INTEGER", nullable: false),
                    view_by_user = table.Column<bool>(type: "INTEGER", nullable: false),
                    view_by_admin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.message_id);
                    table.ForeignKey(
                        name: "FK_Messages_HelpSessions_session_id",
                        column: x => x.session_id,
                        principalTable: "HelpSessions",
                        principalColumn: "session_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DragDropQuestions",
                columns: table => new
                {
                    dragdrop_id = table.Column<int>(type: "INTEGER", nullable: false),
                    Item_1 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Item_2 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Item_3 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Item_4 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_1 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_2 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_3 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_4 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DragDropQuestions", x => x.dragdrop_id);
                    table.ForeignKey(
                        name: "FK_DragDropQuestions_Questions_dragdrop_id",
                        column: x => x.dragdrop_id,
                        principalTable: "Questions",
                        principalColumn: "question_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "McqQuestions",
                columns: table => new
                {
                    question_id = table.Column<int>(type: "INTEGER", nullable: false),
                    question_media = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_1 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_2 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_3 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    option_4 = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    question_answer = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_McqQuestions", x => x.question_id);
                    table.ForeignKey(
                        name: "FK_McqQuestions_Questions_question_id",
                        column: x => x.question_id,
                        principalTable: "Questions",
                        principalColumn: "question_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostLikes",
                columns: table => new
                {
                    like_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    post_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLikes", x => x.like_id);
                    table.ForeignKey(
                        name: "FK_PostLikes_UserPosts_post_id",
                        column: x => x.post_id,
                        principalTable: "UserPosts",
                        principalColumn: "post_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostLikes_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminActivities_user_id",
                table: "AdminActivities",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_CoursePrepItems_course_id",
                table: "CoursePrepItems",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseStats_course_id",
                table: "CourseStats",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseSteps_course_id",
                table: "CourseSteps",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseTips_course_id",
                table: "CourseTips",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseUserActivities_course_id",
                table: "CourseUserActivities",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseUserActivities_user_id",
                table: "CourseUserActivities",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_HelpSessions_user_id",
                table: "HelpSessions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_session_id",
                table: "Messages",
                column: "session_id");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_post_id",
                table: "PostLikes",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_user_id",
                table: "PostLikes",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_course_id",
                table: "Questions",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_course_id",
                table: "UserFeedbacks",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_user_id",
                table: "UserFeedbacks",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginActivities_user_id",
                table: "UserLoginActivities",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserPosts_course_id",
                table: "UserPosts",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserPosts_user_id",
                table: "UserPosts",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserStatistics_user_id",
                table: "UserStatistics",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminActivities");

            migrationBuilder.DropTable(
                name: "Announcements");

            migrationBuilder.DropTable(
                name: "Badges");

            migrationBuilder.DropTable(
                name: "CoursePrepItems");

            migrationBuilder.DropTable(
                name: "CourseStats");

            migrationBuilder.DropTable(
                name: "CourseSteps");

            migrationBuilder.DropTable(
                name: "CourseTips");

            migrationBuilder.DropTable(
                name: "CourseUserActivities");

            migrationBuilder.DropTable(
                name: "DragDropQuestions");

            migrationBuilder.DropTable(
                name: "McqQuestions");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "PostLikes");

            migrationBuilder.DropTable(
                name: "UserFeedbacks");

            migrationBuilder.DropTable(
                name: "UserLoginActivities");

            migrationBuilder.DropTable(
                name: "UserStatistics");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "HelpSessions");

            migrationBuilder.DropTable(
                name: "UserPosts");

            migrationBuilder.DropColumn(
                name: "badge_img",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "quiz_badge_img",
                table: "Courses");
        }
    }
}
