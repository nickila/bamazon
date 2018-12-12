// - Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
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
    displayProducts();




})


function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;
        items = res.length;
        console.log("=====================================================================");
        console.log("ID  PRODUCT     DEPARTMENT     PRICE     ON HAND")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity);

        }
        console.log("=====================================================================");
        chooseProduct();
    })
}
var item_id;
var units;
var total = 0;
var price;
function chooseProduct() {

    // -- The app should then prompt users with two messages.

    // -- The first should ask them the ID of the product they would like to buy.
    // -- The second message should ask how many units of the product they would like to buy.

    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Please enter the item ID."
        },
        {
            name: "units",
            type: "input",
            message: "Please enter the number of units."
        }
    ])
        .then(function (inquirerResponse) {

            item_id = parseInt(inquirerResponse.item_id);
            units = parseInt(inquirerResponse.units);

            console.log("ITEM ID: " + item_id);
            console.log("QUANTITY: " + units);
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;

                for (var j = 0; j < res.length; j++) {

                    if (item_id == res[j].item_id && units <= res[j].stock_quantity) {
                        price = parseFloat(res[j].price);
                        subtotal = price * units;
                        total = total + subtotal;
                        newQuantity = parseInt(res[j].stock_quantity) - units;
                        console.log("SUBTOTAL: $" + (total).toFixed(2));
                        console.log(newQuantity);
                        // Adjust quantities from schema using mysql npm
                        connection.beginTransaction(function (err) {
                            if (err) { throw err; }
                            connection.query("UPDATE products SET stock_quantity =(" + newQuantity + ") WHERE item_id = " + item_id + ";", function (error, results, fields) {
                                if (error) {
                                    //return connection.rollback(function() {
                                    throw error;
                                    //});
                                }

                            });
                            
                            inquirer.prompt([
                                {
                                    name: "choice",
                                    type: "list",
                                    choices: ["ADD ANOTHER ITEM", "PROCEED TO CHECKOUT"]
                                }
                            ])
                                .then(function (inquirerResponse) {

                                    if (inquirerResponse.choice == "ADD ANOTHER ITEM") {
                                        displayProducts();
                                        //chooseProduct();
                                    } else {
                                        console.log("Your total is $" + (total).toFixed(2));
                                        connection.end();
                                    }
                                })
                        });
                        
                    


                } else if (item_id == res[j].item_id && units > res[j].stock_quantity) {
                        console.log("Insufficient quantity!");
                        chooseProduct();

                    }
                }
            });
        });
        
}


// -- Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// -- If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// -- However, if your store does have enough of the product, you should fulfill the customer's order.

// -- This means updating the SQL database to reflect the remaining quantity.
// -- Once the update goes through, show the customer the total cost of their purchase.
