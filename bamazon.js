require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var consoletable = require("console.table");

var connection = mysql.createConnection({
    host: process.env.DB_HOST,

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: process.env.DB_USER,

    // Your password
    password: process.env.DB_PASS,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    console.log("-|- -|- Welcome to Bamazon -|- -|-\n");
    connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement

        console.table(res);

        askForId();    
    });
}

function askForId() {
    connection.query("SELECT * FROM inventory", function (err, res) {
        if (err) throw err;

        inquirer.prompt([

            {
                type: "input",
                name: "theID",
                message: "Which product would you like to purchase? (Enter ID# - Or Q to Quit)"
            }

        ]).then(function (answer) {


            if (answer.theID === "q") {
                connection.end();
            }


            var chosenItem;

            for (var i = 0; i < res.length; i++) {
                if (res[i].id == answer.theID) {
                    chosenItem = res[i];

                    inquirer.prompt([

                        {
                            type: "input",
                            name: "count",
                            message: "How many units would you like to purchase?"
                        }


                    ]).then(function (answer) {

                        let newStock = chosenItem.stock - parseInt(answer.count);

                        connection.query(
                            "UPDATE inventory SET ? WHERE ?",
                            [
                                {
                                    stock: newStock
                                },
                                {
                                    id: chosenItem.id
                                }
                            ],
                            function (error) {
                                if (error) throw err;
                                console.log("");
                                console.log("Thank you for your purchase! Your total is $" + chosenItem.price * answer.count + ". Thank you for choosing Bamazon.");
                                console.log("");
                                start();
                            }
                        );


                    });
                }

            }

        })

    });
}
