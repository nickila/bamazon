CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT PRIMARY KEY,
-- item_id (unique id for each product)
product_name VARCHAR(50) NOT NULL,
-- product_name (Name of product)
department_name VARCHAR(50) NOT NULL,
-- department_name
price DECIMAL(10, 2) NOT NULL,
-- price (cost to customer)
stock_quantity INTEGER(10) NOT NULL
-- stock_quantity (how much of the product is available in stores)
);

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
INSERT INTO products 
(product_name, department_name, price, stock_quantity)
VALUES 
	("hammer", "tools", 19.98, 400),
    ("hand saw", "tools", 25.40, 100),
    ("tape measure", "tools", 11.99, 250),
    ("nails 5 lb.", "hardware", 5.98, 300),
    ("drywall screws", "hardware", 17.98, 900),
    ("dining chair", "home goods", 49.99, 300),
    ("table", "home goods", 129.99, 30),
    ("iron ingot", "hardware", 30.00, 1000),
    ("pajama set", "clothing", 20.45, 700),
    ("couch", "home goods", 250.00, 70);
    
    SELECT * FROM products;
    
    UPDATE products SET stock_quantity = (399) WHERE item_id = 1;
    
    CREATE TABLE departments (
department_id INTEGER AUTO_INCREMENT PRIMARY KEY,

department_name VARCHAR(50) NOT NULL,

over_head_costs DECIMAL(10, 2) NOT NULL
);

INSERT INTO departments 
(department_name, over_head_costs)
VALUES 
	("tools", 400),
    ("home goods", 100),
    ("hardware", 250),
    ("clothing", 300);
    
    SELECT * FROM departments;
    
    UPDATE departments SET over_head_costs = (1500) WHERE department_id = 1;
    UPDATE departments SET over_head_costs = (2000) WHERE department_id = 2;
    UPDATE departments SET over_head_costs = (1000) WHERE department_id = 3;
    UPDATE departments SET over_head_costs = (1250) WHERE department_id = 4;
-- over_head_costs (A dummy number you set for each department)

-- Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.


-- The app should then prompt users with two messages.

-- The first should ask them the ID of the product they would like to buy.
-- The second message should ask how many units of the product they would like to buy.



-- Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

-- If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



-- However, if your store does have enough of the product, you should fulfill the customer's order.

-- This means updating the SQL database to reflect the remaining quantity.
-- Once the update goes through, show the customer the total cost of their purchase.










