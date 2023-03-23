// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9670;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript

app.get('/products', function (req, res){

    // Display the products table if search form is not used
    let query1;

    if (req.query.product_number === undefined)
    {
        query1 = "SELECT * FROM Products;";
    }
    else
    // Display the product table if the search form is used
    {
        query1 = `SELECT * FROM Products WHERE product_number LIKE "${req.query.product_number}%"`
    }

    // Display all products
    let query2 = "SELECT * FROM Products;";
        
    // Run the second query
    db.pool.query(query1, (error, rows, fields) => {
        
        // Save the products
        let products = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            let productSearches = rows;

            // BEGINNING OF NEW CODE

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let productSearchmap = {}
            productSearches.map(productSearch => {
                let id = parseInt(productSearch, 10);

                productSearchmap[id] = productSearch["product-number"];
            })

            // Overwrite the product number with the name of the product in the product object
            products = products.map(product => {
                return Object.assign(product, {ProductSearch: productSearchmap[product.product_number]})
            })

            // END OF NEW CODE
            return res.render('products', {data: products, productSearches: productSearches});
        })
    })
});

app.get('/orderItems', function (req, res){
    let query1;

    // Display the order items if the search bar is not being used
    if (req.query.order_number === undefined)
    {
        query1 = "SELECT Orders.order_number, Products.product_number, Order_Items.quantity, Order_Items.selling_price, Order_Items.is_shipped FROM Order_Items LEFT JOIN Products ON Products.product_number = Order_Items.product_number LEFT JOIN Orders ON Orders.order_number = Order_Items.order_number ORDER BY Orders.order_number ASC;";
    }
    else
    // Display the order items for the search form
    {
        query1 = `SELECT * FROM Order_Items WHERE order_number LIKE "${req.query.order_number}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Orders;";
    // Used for drop down menu
    let query3 = "SELECT * FROM Products;";
        
    // Run the second query
    db.pool.query(query1, (error, rows, fields) => {
        
        // Save the orderItems
        let orderItems = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            let searchOrderItems = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let productItems = rows;
                // END OF NEW CODE
                return res.render('orderItems', {data: orderItems, searchOrderItems: searchOrderItems, productItems: productItems });
            })
        })
    })
});

app.get('/orders', function (req, res){

    // Query 1 is the same in both cases
    let query1;
    // Display the table if the search form is not being used
    if (req.query.order_number === undefined)
    {
        query1 = "SELECT Orders.order_number, Customers.customer_ID, DATE_FORMAT(Orders.order_date, '%Y-%m-%d') AS order_date, Orders.credit_card_number, Orders.credit_card_exp_date FROM Orders INNER JOIN Customers ON Orders.customer_ID = Customers.customer_ID ORDER BY Orders.order_number ASC;";
    }
    else
    // Display the search results
    {
        query1 = `SELECT * FROM Orders WHERE order_number LIKE "${req.query.order_number}%"`
    }

    // For drop down menu
    let query2 = "SELECT * FROM Orders;";
    let query3 = "SELECT * FROM Customers;";
        
    // Run the first query
    db.pool.query(query1, function(error, rows, fields){
        
        let orders = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {

            let searchOrders = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let customers = rows;

                let searchOrdermap = {}
                searchOrders.map(order => {
                    let id = parseInt(order, 10);
    
                    searchOrdermap[id] = order["order-number"];
                })
    
                orders = orders.map(order => {
                    return Object.assign(order, {SearchOrder: searchOrdermap[order.order_number]})
                })
    
                return res.render('orders', {data: orders, searchOrders: searchOrders, customers: customers});    
            })
        })
    })
});

app.get('/credentials', function (req, res){

    // Query 1 is the same in both cases
    let query1;

    // Display the table
    if (req.query.customer_ID === undefined)
    {
        query1 = "SELECT Customers.customer_ID, Credentials.password FROM Credentials LEFT JOIN Customers ON Credentials.customer_ID = Customers.customer_ID ORDER BY Credentials.customer_ID ASC";
    }

    else
    // Display the table if user used search form
    {
        query1 = `SELECT * FROM Credentials WHERE customer_ID LIKE "${req.query.customer_ID}%"`
    }

    // For drop down menu
    let query2 = "SELECT * FROM Credentials;";
    let query3 = "SELECT Customers.customer_ID, Customers.customer_first_name, Customers.customer_last_name FROM Customers LEFT JOIN Credentials ON Customers.customer_ID = Credentials.customer_ID WHERE Credentials.customer_ID IS NULL";

    db.pool.query(query1, function(error, rows, fields){

        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            let credentials = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let customers = rows;

                // let credentialmap = {}
                // credentials.map(credential => {
                //     let id = parseInt(credential, 10);

                //     credentialmap[id] = credential["customer-id"];
                // })

                // people = people.map(person => {
                //     return Object.assign(person, {Credential: credentialmap[person.customer_ID]})
                // })

                return res.render('credentials', {data: people, credentials: credentials, customers: customers,});

            })
        })
    })
});

app.get('/customers', function(req, res){
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.customer_last_name === undefined)
    {
        query1 = "SELECT * FROM Customers;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Customers WHERE customer_last_name LIKE "${req.query.customer_last_name}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Customers;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let people = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let customers = rows;

            // BEGINNING OF NEW CODE

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let customermap = {}
            customers.map(customer => {
                let id = parseInt(customer, 10);

                customermap[id] = customer["customer-last-name"];
            })

            // Overwrite the customer_ID with the name of the planet in the customer object
            people = people.map(person => {
                return Object.assign(person, {Customer: customermap[person.customer_last_name]})
            })

            // END OF NEW CODE
            return res.render('customers', {data: people, customers: customers});
        })
    })

});

app.get('/', function(req, res)
{
    // END OF NEW CODE
    return res.render('index');
});

app.post('/add-person', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

      // Capture NULL values
      let customer_email = parseInt(data['input-customer-email']);
      if (customer_email === undefined)
      {
          customer_email = 'NULL'
      }
  
      let customer_address = parseInt(data['input-customer-address']);
      if (customer_address === undefined)
      {
          customer_address = 'NULL'
      }


    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (customer_first_name, customer_last_name, customer_email, customer_address) VALUES ('${data['input-customer-first-name']}', '${data['input-customer-last-name']}', '${data['input-customer-email']}', '${data['input-customer-address']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM customers and
        // presents it on the screen
        else
        {
            res.redirect("/customers");
        }
    })
});

app.post('/add-credential-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Credentials (customer_ID, Credentials.password) VALUES ('${data.customer_ID}', '${data.password}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM credentials and
        // presents it on the screen
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Customers.customer_ID, Credentials.password FROM Credentials
            INNER JOIN Customers ON Customers.customer_ID = Credentials.customer_ID`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-orderItems-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Order_Items (order_number, product_number, Order_Items.quantity, Order_Items.selling_price, Order_Items.is_shipped) VALUES ('${data.order_number}', '${data.product_number}', '${data.quantity}', '${data.selling_price}', '${data.is_shipped}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on order_items
            query2 = `SELECT order_number, product_number, Order_Items.quantity, Order_Items.selling_price, Order_Items.is_shipped FROM Order_Items`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customer_ID, Orders.order_date, Orders.credit_card_number, Orders.credit_card_exp_date) VALUES ('${data.customer_ID}', '${data.order_date}', '${data.credit_card_number}', '${data.credit_card_exp_date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {

            query2 = `SELECT order_number, customer_ID, order_date, credit_card_number, credit_card_exp_date FROM Orders WHERE customer_ID = ? AND order_date = ? AND credit_card_number = ? AND credit_card_exp_date = ?`;
            query2vars = [data.customer_ID, data.order_date, data.credit_card_number, data.credit_card_exp_date];
            db.pool.query(query2, query2vars, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-product', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Products (product_type, title, retail_price, quantity_in_stock) VALUES ('${data.product_type}', '${data.title}', '${data.retail_price}', '${data.quantity_in_stock}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on products
            query2 = `SELECT * FROM Products`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-customer', function(req, res, next) {
    let data = req.body;
    console.log(data);

    let delete_customer = `DELETE FROM Customers WHERE customer_ID = ?`;

    // Run the 1st query
    db.pool.query(delete_customer, [data.customer_ID], function(error, rows, fields){
    if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
    } else {
        res.sendStatus(204);
    }
})});

app.delete('/delete-credentials', function (req, res) {
    let data = req.body;
    console.log(data);

    let delete_credentials = `DELETE FROM Credentials WHERE customer_ID = ?`;

    // Run query
    db.pool.query(delete_credentials, [data.customer_ID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {

            let delete_credential_items = `DELETE FROM Credentials WHERE customer_ID = ?`;

            db.pool.query(delete_credential_items, [data.customer_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Send status that order was deleted
                    res.sendStatus(204);
                }
            })
        }
})});

app.delete('/delete-order', function (req, res) {
    let data = req.body;
    console.log(data);

    let delete_order = `DELETE FROM Orders WHERE order_number = ?`;

    // Run query
    db.pool.query(delete_order, [data.order_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {

            let delete_order_items = `DELETE FROM Order_Items WHERE order_number = ?`;

            db.pool.query(delete_order_items, [data.order_number], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Send status that order was deleted
                    res.sendStatus(204);
                }
            })
        }
})});

app.delete('/delete-order-item', function (req, res) {
    let data = req.body;

    console.log(data);

    let delete_order_item = `DELETE FROM Order_Items WHERE order_number = ? AND product_number = ?`;

    // Run query
    db.pool.query(delete_order_item, [data.order_number, data.product_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Send status that order was deleted
            res.sendStatus(204);
        }
})});

app.delete('/delete-product', function (req, res) {
    let data = req.body;
    console.log(data);

    let delete_product = `DELETE FROM Products WHERE product_number = ?`;

    // Run query
    db.pool.query(delete_product, [data.product_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Send status that order was deleted
            res.sendStatus(204);
        }
})});

app.put('/put-person', function(req, res) {                                   
    let data = req.body;

    console.log(data);

    let customer_ID = parseInt(data.customer_ID);
    console.log(customer_ID);
    let customer_first_name = (data.customer_first_name);
    let customer_last_name = (data.customer_last_name);
    let customer_email = (data.customer_email);
    let customer_address = (data.customer_address);

    queryUpdateCustomer = `UPDATE Customers SET customer_first_name = ?, customer_last_name = ?, customer_email = ?, customer_address = ? WHERE Customers.customer_ID = ?`;
    
    
    // Run query
    db.pool.query(queryUpdateCustomer, [customer_first_name, customer_last_name, customer_email, customer_address, customer_ID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } 
        
        else 
        {
            selectCustomer = `SELECT * FROM Customers WHERE customer_ID = ?`;
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            db.pool.query(selectCustomer, [customer_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    red.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});

app.put('/put-credentials', function(req, res) {                                   
    let data = req.body;

    let customer_ID = (data.customer_ID);
    let password = (data.password);
    
    queryUpdateCustomer = `UPDATE Credentials SET password = ? WHERE customer_ID = ?`;
    
    
    // Run query
    db.pool.query(queryUpdateCustomer, [password, customer_ID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } 
        
        else 
        {
            selectOrder = `SELECT * FROM Credentials WHERE customer_ID = ?`;
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            db.pool.query(selectOrder, [customer_ID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    red.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});

app.put('/put-order', function(req, res) {                                   
    let data = req.body;

    let order_number = parseInt(data.order_number);
    let customer_ID = parseInt(data.customer_ID);
    let order_date = (data.order_date);
    let credit_card_number = (data.credit_card_number);
    let credit_card_exp_date = (data.credit_card_exp_date);

    queryUpdateCustomer = `UPDATE Orders SET customer_ID = ?, order_date = ?, credit_card_number = ?, credit_card_exp_date = ? WHERE order_number = ?`;
    
    
    // Run query
    db.pool.query(queryUpdateCustomer, [customer_ID, order_date, credit_card_number, credit_card_exp_date, order_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } 
        
        else 
        {
            selectOrder = `SELECT * FROM Orders WHERE order_number = ?`;
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            db.pool.query(selectOrder, [order_number], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    red.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});

app.put('/put-order-item', function(req, res) {                                   
    let data = req.body;

    let order_number    = parseInt(data.order_number);
    let product_number  = parseInt(data.product_number);
    let quantity        = parseInt(data.quantity);
    let selling_price   = parseFloat(data.selling_price);
    let is_shipped      = parseInt(data.is_shipped);

    queryUpdateCustomer = `UPDATE Order_Items SET quantity = ?, selling_price = ?, is_shipped = ? WHERE order_number = ? AND product_number = ?`;
    
    
    // Run query
    db.pool.query(queryUpdateCustomer, [quantity, selling_price, is_shipped, order_number, product_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } 
        
        else 
        {
            selectOrder = `SELECT * FROM Order_Items WHERE order_number = ? AND product_number = ?`;
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            db.pool.query(selectOrder, [order_number, product_number], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    red.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});

app.put('/put-product', function(req, res) {                                   
    let data = req.body;

    let product_number = parseInt(data.product_number);
    let product_type = (data.product_type);
    let title = (data.title);
    let retail_price = parseFloat(data.retail_price);
    let quantity_in_stock = parseInt(data.quantity_in_stock);

    queryUpdateProduct = `UPDATE Products SET product_type = ?, title = ?, retail_price = ?, quantity_in_stock = ? WHERE product_number = ?`;
    
    
    // Run query
    db.pool.query(queryUpdateProduct, [product_type, title, retail_price, quantity_in_stock, product_number], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } 
        
        else 
        {
            selectProduct = `SELECT * FROM Products WHERE product_number = ?`;
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            db.pool.query(selectProduct, [product_number], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    red.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});