// - Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
var mysql = require("mysql");
var inquirer = require("inquirer")
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





});

// -- The app should then prompt users with two messages.

// -- The first should ask them the ID of the product they would like to buy.
// -- The second message should ask how many units of the product they would like to buy.

inquirer.prompt([
    {
        name: "item_ID",
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
        //console.log(inquirerResponse);
        var choice = inquirerResponse.choice;
        console.log(choice);

        if (choice === "SONGS BY ARTIST") {
            byArtist();

        }
    });
function byArtist() {
    inquirer.prompt([
        {
            name: "artist",
            type: "input",
            message: "NAME OF ARTIST"
        }



    ]).then(function (promptResponse) {

        connection.query('SELECT * FROM `songs` WHERE `artist` = ?', [promptResponse.artist], function (error, res) {
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)

            console.log(error);
            // error will be an Error if one occurred during the query
            for (i = 0; i < res.length; i++) {
                console.log(res[i].title);
            }
            connection.end();
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
        });

    }).then(function (answer) {

        connection.query()

    });

}





// function multiSearch() {
//     var query = "SELECT artits FROM songs GROUP BY artist HAVING count(*) > 1"
//     connection.query(query, function (err, res) {
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].artist);
//         }

        
//     });
// }






// -- Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// -- If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// -- However, if your store does have enough of the product, you should fulfill the customer's order.

// -- This means updating the SQL database to reflect the remaining quantity.
// -- Once the update goes through, show the customer the total cost of their purchase.
