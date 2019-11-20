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

    function runTheProgram() {

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "list",
                    message: "What do you want to do?",
                    choices: [
                        "View Inventory",
                        "View Low Inv Items",
                        "Add to Inventory",
                        "Create New Item",
                        "Quit"
                    ]
                }
            ]).then(answer => {

                console.log(answer);


                switch (answer.list) {

                    case "View Inventory":
                        function start() {
                            console.log("-|- -|- Welcome to Bamazon -|- -|-\n");
                            connection.query("SELECT * FROM inventory", function (err, res) {
                                if (err) throw err;

                                console.table(res);
                            });
                        }
                        start();
                        console.log("");
                        setTimeout(runTheProgram, 3000);
                        break;

                    case "View Low Inv Items":
                        function lowInvItems() {
                            console.log("-|- -|- Low Inventory Items -|- -|-")
                            connection.query("SELECT * FROM inventory WHERE stock < 5", function (err, res) {
                                if (err) throw err;

                                console.table(res);
                            });
                        }
                        lowInvItems();
                        console.log("");
                        setTimeout(runTheProgram, 3000);
                        break;

                    case "Add to Inventory":

                        start();

                        function askForId() {
                            connection.query("SELECT * FROM inventory", function (err, res) {
                                if (err) throw err;

                                inquirer.prompt([

                                    {
                                        type: "input",
                                        name: "theID",
                                        message: "Which product would you like to edit? (Enter ID#)"
                                    }

                                ]).then(function (answer) {

                                    var chosenItem;

                                    for (var i = 0; i < res.length; i++) {
                                        if (res[i].id == answer.theID) {
                                            chosenItem = res[i];

                                            inquirer.prompt([

                                                {
                                                    type: "input",
                                                    name: "count",
                                                    message: "How many units would you like to add?"
                                                }


                                            ]).then(function (answer) {

                                                let newStock = chosenItem.stock + parseInt(answer.count);

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
                                                        console.log("Added Inventory for " + chosenItem.item_name + " by " + answer.count);
                                                        console.log("");
                                                        start();
                                                        console.log("");
                                                        setTimeout(runTheProgram, 3000);
                                                    }
                                                );


                                            });
                                        }

                                    }

                                })

                            });
                        }
                        askForId();

                        break;

                    case "Create New Item":

                        function createItem() {

                            inquirer
                                .prompt([
                                    {
                                        name: "item_name",
                                        type: "input",
                                        message: "What is the item you would like to submit?"
                                    },
                                    {
                                        name: "dept_name",
                                        type: "input",
                                        message: "What department would you like to place your item in?"
                                    },
                                    {
                                        name: "price",
                                        type: "input",
                                        message: "What is the price per unit?",
                                    },
                                    {
                                        name: "stock",
                                        type: "input",
                                        message: "What is the initial stock count?",
                                    }
                                ])
                                .then(function (answer) {
                                    // when finished prompting, insert a new item into the db with that info
                                    connection.query(
                                        "INSERT INTO inventory SET ?",
                                        {
                                            item_name: answer.item_name,
                                            dept_name: answer.dept_name,
                                            price: answer.price,
                                            stock: answer.stock
                                        },
                                        function (err) {
                                            if (err) throw err;
                                            console.log("Your item was created successfully!");
                                            console.log("");
                                            setTimeout(runTheProgram, 3000);
                                        }
                                    );
                                });
                        }
                        createItem();
                        break;
                        
                        case "Quit":

                        connection.end();
                }

            })
    }

    runTheProgram();
})

