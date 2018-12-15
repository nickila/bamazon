var cTable = require('console.table');



var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",
    password: "coppeR##6531",
    database: "bamazonDB"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptChoice();
})
function promptChoice() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            choices: ["SALES BY DEPARTMENT", "CREATE NEW DEPARTMENT", "EXIT"]
        }
    ])
        .then(function (inquirerResponse) {

            if (inquirerResponse.choice == "SALES BY DEPARTMENT") {
                salesByDept();
            }
            if (inquirerResponse.choice == "CREATE NEW DEPARTMENT") {
                createDept();
            }
            if (inquirerResponse.choice == "EXIT") {
                connection.end();
            }

        });
}

// departments table should be taking the sales from the customer and adding them together.

function salesByDept() {
    connection.query("SELECT * FROM departments", function (err, res) {

        if (err) throw err;
        var price;
        items = res.length;
        var sales;
        console.log("=====================================================================");
        var tableArr = [];
        var profit;
        for (var i = 0; i < res.length; i++) {
            sales = parseFloat(res[i].product_sales).toFixed(2);
            price = parseFloat(res[i].price).toFixed(2);
            profit = (sales - res[i].over_head_costs).toFixed(2);
            tableArr.push(
                {
                    ID: res[i].department_id,
                    DEPARTMENT: res[i].department_name,
                    OVERHEAD_COSTS: res[i].over_head_costs,
                    SALES: sales,
                    PROFIT: profit
                }
            )
        }
        console.table(tableArr);
        console.log("=====================================================================");
        promptChoice();
    })
}
function createDept() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "DEPARTMENT NAME:"
        },
        {
            name: "overhead",
            type: "input",
            message: "OVERHEAD COSTS:"
        }
    ])
        .then(function (inquirerResponse) {
            var department = inquirerResponse.department;
            var overhead = inquirerResponse.overhead;
            //var sales = parseFloat(inquirerResponse.sales).toFixed(2);
            
            //var sales = parseInt(inquirerResponse.product_sales)
            connection.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                connection.query('INSERT INTO departments SET ?', { department_name: department, over_head_costs: overhead}, function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        }
                    });
                });
                promptChoice();

            });
        });

}