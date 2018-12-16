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

// List a set of menu options:
var item_id;
var units;
function promptChoice() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADJUST INVENTORY", "ADD NEW PRODUCT", "EXIT"]
        }
    ])
        .then(function (inquirerResponse) {

            if (inquirerResponse.choice == "VIEW PRODUCTS FOR SALE") {
                displayForSale();
            }
            if (inquirerResponse.choice == "VIEW LOW INVENTORY") {
                lowInventory();
            }
            if (inquirerResponse.choice == "ADJUST INVENTORY") {
                addInventory();
            }
            if (inquirerResponse.choice == "ADD NEW PRODUCT") {
                addNewProduct();
            }
            if (inquirerResponse.choice == "EXIT") {
                connection.end();
            }

        });
}
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function displayForSale() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;
        var price;
        items = res.length;
        var sales;
        console.log("=====================================================================");
        var tableArr = [];
        for (var i = 0; i < res.length; i++) {
            sales = parseFloat(res[i].product_sales).toFixed(2);
            price = parseFloat(res[i].price).toFixed(2);
            tableArr.push(
                {
                    ID: res[i].item_id,
                    PRODUCT: res[i].product_name,
                    DEPARTMENT: res[i].department_name,
                    PRICE: price,
                    ONHAND: res[i].stock_quantity,
                    SALES: sales
                }
            )
        }
        console.table(tableArr);
        console.log("=====================================================================");
        promptChoice();
    })
}
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {

        if (err) throw err;
        items = res.length;
        console.log("=====================================================================");
        var lowArr = [];
        var price;
        for (var i = 0; i < res.length; i++) {
            price = parseFloat(res[i].price).toFixed(2);
            lowArr.push(
                {
                    ID: res[i].item_id,
                    PRODUCT: res[i].product_name,
                    DEPARTMENT: res[i].department_name,
                    PRICE: price,
                    ONHAND: res[i].stock_quantity
                }
            )

        }
        console.table(lowArr);
        console.log("=====================================================================");
        promptChoice();
    })
}
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "ID:"
        },
        {
            name: "units",
            type: "input",
            message: "UNITS:"
        }
    ])
        .then(function (inquirerResponse) {
            item_id = parseInt(inquirerResponse.item_id);
            units = parseInt(inquirerResponse.units);
            if (Number.isNaN(item_id) || Number.isNaN(units)) {
                console.log("INVALID ID OR QUANTITY");
                promptChoice();
            } else {
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    for (var j = 0; j < res.length; j++) {
                        if (item_id == res[j].item_id) {
                            newQuantity = parseInt(res[j].stock_quantity) + units;
                            console.log(newQuantity);
                            // Adjust quantities from schema using mysql npm
                            connection.beginTransaction(function (err) {
                                if (err) { throw err; }
                                connection.query("UPDATE products SET stock_quantity =(" + newQuantity + ") WHERE item_id = " + item_id + ";", function (error, results, fields) {
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
                        }
                    }
                });
            }
        });
}
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "PRODUCT NAME:"
        },
        {
            name: "department",
            type: "input",
            message: "DEPARTMENT:"
        },
        {
            name: "price",
            type: "input",
            message: "PRICE:"
        },
        {
            name: "stock",
            type: "input",
            message: "ON HAND:"
        }
    ])
        .then(function (inquirerResponse) {
            var name = inquirerResponse.name;
            var department = inquirerResponse.department;
            var price = parseFloat(inquirerResponse.price).toFixed(2);
            var stock = parseInt(inquirerResponse.stock);
            connection.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                connection.query('INSERT INTO products SET ?', { product_name: name, department_name: department, price: price, stock_quantity: stock, product_sales: 0.00 }, function (error, results, fields) {
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

