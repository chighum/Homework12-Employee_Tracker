USE employees_db;

INSERT INTO department (name)
VALUES ("Engineering"), ("Marketing"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Junior Engineer", 75000, 1), ("Senior Engineer", 200000, 1), ("Marketing Assistant", 60000, 2), ("Marketing Manager", 120000, 2), ("Sales Lead", 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Charlie", "Highum", 2, NULL), ("John", "Snow", 1, 1), ("Tyrion", "Lannister", 1, 1), ("Cersei", "Lannister", 4, null), ("Tywin", "Lannister", 3, 4), ("Rob", "Stark", 5, null);

