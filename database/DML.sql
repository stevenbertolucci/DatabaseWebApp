-- Database Manipulation queries for a partially implemented Project Website
-- Using the The Potion Pharmaceutical Database
-- Authors: Steven Bertolucci and Ryan Kirkpatrick

-------------------------------------------------------------------
--           Customer Queries               -- 
-------------------------------------------------------------------

--get ALL customers and their info for the Customer page
SELECT * FROM Customers;

-- Display Search Results --
SELECT * FROM Customers WHERE customer_last_name LIKE :customer_last_name

-- Add new customer --
INSERT INTO Customers(first_name, last_name, email, address)
VALUES (:first_name_input, :last_name_input, :email_input, :address_input);

--Update Customer form --
SELECT Customers.customer_ID, Customers.customer_first_name, Customers.customer_last_name, 
Customer.customer_email, Customer.customer_address
FROM Customers
WHERE customer_ID = :customer_ID_selected_from_browse_customer_page
UPDATE customers
SET first_name = :new_first_name_input,
    last_name = :new_last_name_input,
    email = :new_email_input,
    address = :new_address_input;

-- Delete Customer-- 
DELETE FROM Customers
WHERE customer_ID = :customer_ID_selected_from_browse_customer_page;

-------------------------------------------------------------------
--           Orders Queries               -- 
-------------------------------------------------------------------

-- Display all Orders --
SELECT Orders.order_number, Customers.customer_ID, Orders.order_date, Orders.credit_card_number, Orders.credit_card_exp_date
FROM Orders
LEFT JOIN Customers ON Orders.customer_ID = Customers.customer_ID
ORDER BY Orders.order_number ASC;

-- Display Order numbers for Drop Down menu --
SELECT * FROM Orders;

-- Display Customer IDs for Drop Down Menu --
SELECT * FROM Customers;

-- Display Search Results --
SELECT * FROM Orders WHERE order_number LIKE :order_number;

-- Add New Order --
INSERT INTO Orders(customer_ID, order_date, credit_card_number, credit_card_exp_date)
VALUES (:customerID_input, :order_date_input, :credit_card_number_input, :credit_card_exp_date_input)
WHERE customer_ID = :customer_ID_selected_from_browse_order_page;

-- Update Order --
SELECT Orders.order_ID, Orders.customer_ID, Orders.order_date, Orders.credit_card_number, Orders.credit_card_exp_date
FROM Orders WHERE order_ID = :order_ID_selected_from_browse_order_page and customer_ID = :customer_ID_selected_from_browse_order_page
UPDATE FROM Orders
SET order_date = :new_order_date
    credit_card_number = :new_credit_card_number
    credit_card_exp_date = :new_credit_card_exp_date
WHERE order_ID = :order_ID_selected_from_browse_order_page and customer_ID = :customer_ID_selected_from_browse_order_page;

-- delete Order --
DELETE FROM Orders
WHERE order_ID = :order_ID_selected_from_browse_order_page;

-------------------------------------------------------------------
--           Credentials Queries               -- 
-------------------------------------------------------------------

-- Display Credentials that already have credentials --
SELECT Customers.customer_ID, Credentials.password 
FROM Credentials
LEFT JOIN Customers ON Credentials.customer_ID = Customers.customer_ID ORDER BY Credentials.customer_ID ASC;

-- Display ALL Credentials --
SELECT * FROM Credentials

-- Display the Customer IDs for the drop down menu when adding Credentials --
SELECT Customers.customer_ID, Customers.customer_first_name, Customers.customer_last_name FROM Customers LEFT JOIN Credentials ON Customers.customer_ID = Credentials.customer_ID WHERE Credentials.customer_ID IS NULL;


-- Display Search Results --
SELECT * FROM Credentials WHERE customer_ID LIKE :customer_ID_selected_from_browse_credentials_page


-- Add Credentials
INSERT INTO Credentials (customer_ID, password)
VALUES (:customer_ID_input, :password_input)
WHERE customer_ID = customer_ID_selected_from_browse_credentials_page;

-- Update Credentials
UPDATE Credentials
SET password = :password_input
WHERE customer_ID = customer_ID_selected_from_browse_credentials_page;

-- Delete Credentials
DELETE FROM Credentials
WHERE customer_ID = :customer_ID_selected_from_browse_credentials_page;

-------------------------------------------------------------------
--           Order_Items Queries               -- 
-------------------------------------------------------------------

-- Order_Items CRUD

-- Display Order Items --
SELECT Orders.order_number, Products.product_number, Order_Items.quantity, Order_Items.selling_price, Order_Items.is_shipped FROM Order_Items
LEFT JOIN Products on Products.product_number = Order_Items.product_number LEFT JOIN Orders ON Orders.order_number = Order_Items
ORDER BY Orders.order_number ASC; 

-- Display ALL Order Numbers for Drop Down menu --
SELECT * FROM Orders;

-- Display ALL Product Numbers for Drop Down Menu --
SELECT * FROM Products;

-- Display Search Results --
SELECT * FROM Order_Items WHERE order_ID_selected_from_browse_order_page LIKE order_ID_selected_from_browse_order_page;

-- Add Order items --
INSERT INTO Order_Items (
    order_number,
    product_number,
    quantity,
    selling_price,
    is_shipped
)
VALUES
(
    :order_number,
    :product_number,
    :quantity,
    :selling_price,
    :is_shipped
)
WHERE order_number = :order_number AND product_number = :product_number;

-- Update Order Items --
UPDATE Order_Items
SET quantity = :quantity, selling_price = :selling_price, is_shipped = :is_shipped
WHERE order_number = :order_number AND product_number = :product_number;

-- Delete Order Items --
DELETE FROM Order_Items
WHERE order_number = :order_number AND product_number = :product_number;


-------------------------------------------------------------------
--           Products Queries               -- 
-------------------------------------------------------------------

-- product CRUD
SELECT * FROM Products;

-- Display Search Results --
SELECT * FROM Products;
WHERE product_number = :product_number;

-- Add product --
INSERT INTO Products (
    product_type,
    title,
    retail_price,
    quantity_in_stock
)
VALUES
(
    :product_type,
    :title,
    :retail_price,
    :quantity_in_stock
);

--Update product--
UPDATE Products
SET product_type = :product_type, title = :title, retail_price = :retail_price, quantity_in_stock = :quantity_in_stock
WHERE product_number = :product_number;

--Delete product
DELETE FROM Products
WHERE product_number = :product_number;