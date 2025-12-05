import sqlite3
import json

# Connect to the SQLite database to get all data into json.
db_path = "app.db"
output_path = "app.json"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

db_json = {}

for (table_name,) in tables:
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    # get column names
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [col[1] for col in cursor.fetchall()]

    # convert rows to dict
    db_json[table_name] = [dict(zip(columns, row)) for row in rows]

with open(output_path, "w") as f:
    json.dump(db_json, f, indent=4)

conn.close()
print("Done! Exported to app.json")
