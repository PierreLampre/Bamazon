var inquirer = require("inquirer");
var mysql = require("mysql");
var consoletable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "stayoutmyshit3#",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    console.log("-|- -|- Welcome to Bamazon -|- -|-\n");
    connection.query("SELECT * FROM inventory", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
     
      console.table(res);

      connection.end();
    });
}