const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const firstQuestion = [
  "View All Employees",
  "Add Employee",
  "View All Roles",
  "Add Role",
  "Update Employee Role",
  "View All Departments",
  "Add Department",
  "Quit",
];

const startQuestions = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "firstQuestion",
      choices: firstQuestion,
    })
    .then((response) => {
      switch (response.firstQuestion) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

startQuestions();

const viewAllEmployees = () => {
  console.clear();
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id`,
    (err, response) => {
      if (err) throw err;
      console.table("Total Staff:", response);
    }
  );
  startQuestions();
};

let role = [];

const getRoles = () => {
  db.query("SELECT title FROM role", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      role.push(results[i].title);
    }
    return role;
  });
};

getRoles();

let managers = [];

const getManagers = () => {
  db.query(
    `SELECT CONCAT (first_name,' ', last_name) AS name FROM employee WHERE manager_id IS NULL`,
    function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        managers.push(results[i].name);
      }
      return managers;
    }
  );
};
getManagers();

const addEmployeeQuestions = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "firstName",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "lastName",
  },
  {
    type: "list",
    message: "What is the employee's role",
    name: "role",
    choices: role,
  },
  {
    type: "list",
    message: "Who is the employee's manager",
    name: "manager",
    choices: managers,
  },
];

const addEmployee = () => {
  console.clear();
  inquirer.prompt(addEmployeeQuestions).then((response) => {
    db.query("INSERT INTO employee SET ?", {
      first_name: response.firstName,
      last_name: response.lastName,
      role_id: response.role,
      manager_id: response.manager,
    });
    db.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id`,
      (err, response) => {
        if (err) throw err;

        console.table("Total Staff:", response);
      }
    );
  });
  //startQuestions();
};

const viewAllRoles = () => {
  console.clear();
  db.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
    (err, response) => {
      if (err) throw err;
      console.table("All Roles:", response);
    }
  );
};

let department = [];

const getDepartments = () => {
  db.query("SELECT name FROM department", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      department.push(results[i].name);
    }
    return department;
  });
};

getDepartments();

const addRoleQuestions = [
  {
    type: "input",
    message: "What is the title of the role?",
    name: "title",
  },
  {
    type: "input",
    message: "What is the role's salary?",
    name: "salary",
  },
  {
    type: "list",
    message: "What department is the role in?",
    name: "department",
    choices: department,
  },
];

const addRole = () => {
  console.clear();
  inquirer.prompt(addRoleQuestions).then((response) => {
    db.query("INSERT INTO role SET ?", {
      title: response.title,
      salary: response.salary,
      department_id: response.department,
    });
    db.query(
      `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
      (err, response) => {
        if (err) throw err;

        console.table("All Roles:", response);
      }
    );
  });
  //startQuestions();
};

// const updateEmployeeRole = () => {};

const viewAllDepartments = () => {
  console.clear();
  db.query(
    `SELECT id, name FROM department ORDER BY department.id`,
    (err, response) => {
      if (err) throw err;
      console.table("All Departments:", response);
    }
  );
  //startQuestions();
};

const addDepartmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "name",
  },
];

const addDepartment = () => {
  console.clear();
  inquirer.prompt(addDepartmentQuestions).then((response) => {
    db.query("INSERT INTO department SET ?", {
      name: response.name,
    });
    db.query(
      `SELECT department.id, department.name FROM department ORDER BY department.id`,
      (err, response) => {
        if (err) throw err;

        console.table("All Departments:", response);
      }
    );
    //startQuestions();
  });
};

// Function to get all employees from the database to present options to the user through inquirer
let employees = [];

const getEmployees = () => {
  db.query(
    `SELECT CONCAT (first_name,' ', last_name) AS name FROM employee`,
    function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        employees.push(results[i].name);
      }
      return employees;
    }
  );
};
getEmployees();

const updateEmployeeQuestions = [
  {
    type: "list",
    message: "Which employee would you like to update?",
    name: "employee",
    choices: employees,
  },
  {
    type: "list",
    message: "What is the employee's new role?",
    name: "role",
    choices: role,
  },
];

const updateEmployeeRole = () => {
  inquirer.prompt(updateEmployeeQuestions).then((response) => {
    let first_name = response.employee.split(" ")[0];
    let last_name = response.employee.split(" ")[1];
    db.query(
      `UPDATE employee SET role_id = ${response.role} WHERE first_name = ${first_name} AND last_name = ${last_name}`
    );
  });
};
