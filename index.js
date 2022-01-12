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

// array of options for user to start the application
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

// inquirer.prompt function to run the firstQuestion array and then run the appropriate function based on user response
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
// call the function to initialize the app
startQuestions();

// function to view all employees, returning the data as a table
const viewAllEmployees = () => {
  console.clear();
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id`,
    (err, data) => {
      if (err) throw err;
      console.table("Total Staff:", data);
    }
  );
  startQuestions();
};

// function to get all role titles from database in one array
let roleTitles = [];
const getRoleTitles = () => {
  db.query("SELECT title FROM role ORDER BY id", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleTitles.push(results[i].title);
    }
    return roleTitles;
  });
};
getRoleTitles();

// function to get all role IDs from database in one array
let roleIDs = [];
const getRoleIDs = () => {
  db.query("SELECT id FROM role ORDER BY id", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleIDs.push(results[i].id);
    }
    return roleIDs;
  });
};
getRoleIDs();

// function to get all manager names from database in one array
let managerNames = [];
const getManagerNames = () => {
  db.query(
    `SELECT CONCAT (first_name,' ', last_name) AS name FROM employee WHERE manager_id IS NULL ORDER BY id`,
    function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        managerNames.push(results[i].name);
      }
      return managerNames;
    }
  );
};
getManagerNames();

// function to get all manager IDs from database in one array
let managerIDs = [];
const getManagerIDs = () => {
  db.query(
    `SELECT id FROM employee WHERE manager_id IS NULL ORDER BY id`,
    function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        managerIDs.push(results[i].id);
      }
      return managerIDs;
    }
  );
};
getManagerIDs();

// questions that will be presented to user after they select "Add Employee" option
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
    choices: roleTitles,
  },
  {
    type: "list",
    message: "Who is the employee's manager",
    name: "manager",
    choices: managerNames,
  },
];

// function to run addEmployeeQuestions with inquirer.prompt
// adds the employee with correct role ID and manager ID from title and name inputs
const addEmployee = () => {
  console.clear();
  inquirer
    .prompt(addEmployeeQuestions)
    .then((response) => {
      let data = [];
      let first_name = response.firstName;
      let last_name = response.lastName;
      let roleID;
      let managerID;
      for (let i = 0; i < roleIDs.length; i++) {
        if (response.role === roleTitles[i]) {
          roleID = roleIDs[i];
        }
      }
      for (let i = 0; i < managerIDs.length; i++) {
        if (response.manager === managerNames[i]) {
          managerID = managerIDs[i];
        }
      }
      data.push(first_name);
      data.push(last_name);
      data.push(roleID);
      data.push(managerID);
      return data;
    })
    .then((data) => {
      db.query("INSERT INTO employee SET ?", {
        first_name: data[0],
        last_name: data[1],
        role_id: data[2],
        manager_id: data[3],
      });
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id`,
        (err, data) => {
          if (err) throw err;

          console.table("Total Staff:", data);
        }
      );
    });
  startQuestions();
};

// function to view all roles with appropriate table join on department id
const viewAllRoles = () => {
  console.clear();
  db.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
    (err, data) => {
      if (err) throw err;
      console.table("All Roles:", data);
    }
  );
};

// function to get all department names from database in one array
let departmentNames = [];
const getDepartmentNames = () => {
  db.query("SELECT name FROM department ORDER BY id", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      departmentNames.push(results[i].name);
    }
    return departmentNames;
  });
};
getDepartmentNames();

// function to get all department IDs from the database in one array
let departmentIDs = [];
const getDepartmentIDs = () => {
  db.query("SELECT id FROM department ORDER BY id", function (err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      departmentIDs.push(results[i].id);
    }
    return departmentIDs;
  });
};
getDepartmentIDs();

// questions presented to the user after they select the option to "Add Role"
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
    choices: departmentNames,
  },
];

// function to run the addRoleQuestions using inquirer.prompt
// new role is then added to the database with department id value corresponding to user input for department name
const addRole = () => {
  console.clear();
  inquirer
    .prompt(addRoleQuestions)
    .then((response) => {
      let data = [];
      let title = response.title;
      let salary = response.salary;
      let departmentID;
      for (let i = 0; i < departmentIDs.length; i++) {
        if (response.department === departmentNames[i]) {
          departmentID = departmentIDs[i];
        }
      }
      data.push(title);
      data.push(salary);
      data.push(departmentID);
      return data;
    })
    .then((data) => {
      db.query("INSERT INTO role SET ?", {
        title: data[0],
        salary: data[1],
        department_id: data[2],
      });
      db.query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
        (err, data) => {
          if (err) throw err;

          console.table("All Roles:", data);
        }
      );
    });
  startQuestions();
};

// function to view all departments
const viewAllDepartments = () => {
  console.clear();
  db.query(
    `SELECT id, name FROM department ORDER BY department.id`,
    (err, data) => {
      if (err) throw err;
      console.table("All Departments:", data);
    }
  );
  startQuestions();
};

// questions presented to the user when they select the option to "Add Department"
const addDepartmentQuestions = [
  {
    type: "input",
    message: "What is the name of the department?",
    name: "name",
  },
];

// function to run addDepartmentQuestions with inquirer.prompt
// and add the department to the database
const addDepartment = () => {
  console.clear();
  inquirer.prompt(addDepartmentQuestions).then((response) => {
    db.query("INSERT INTO department SET ?", {
      name: response.name,
    });
    db.query(
      `SELECT department.id, department.name FROM department ORDER BY department.id`,
      (err, data) => {
        if (err) throw err;

        console.table("All Departments:", data);
      }
    );
    startQuestions();
  });
};

// Function to get all employees from the database to present options to the user through inquirer
let employees = [];
const getEmployees = () => {
  db.query(
    `SELECT CONCAT (first_name,' ', last_name) AS name FROM employee ORDER BY id`,
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

// questions presented to the user when they select the "Update Employee Role" option
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
    choices: roleTitles,
  },
];

// function to run the updateEmployeeQuestions using inquirer.prompt
// and update the correct employee's employee's role_id based on the employee name and role title input
const updateEmployeeRole = () => {
  inquirer
    .prompt(updateEmployeeQuestions)
    .then((response) => {
      let data = [];
      let first_name = response.employee.split(" ")[0];
      let last_name = response.employee.split(" ")[1];
      let roleID;
      for (let i = 0; i < roleIDs.length; i++) {
        if (response.role === roleTitles[i]) {
          roleID = roleIDs[i];
        }
      }
      data.push(roleID);
      data.push(first_name);
      data.push(last_name);
      return data;
    })
    .then((data) => {
      console.log(data);
      db.query(
        `UPDATE employee SET role_id = ${data[0]} WHERE first_name = '${data[1]}' AND last_name = '${data[2]}'`
      );
    });
};
