SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- CREATE A Customers Table
CREATE OR REPLACE TABLE Customers (
   customer_ID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
   customer_first_name varchar(75) NOT NULL,
   customer_last_name varchar(75) NOT NULL,
   customer_email varchar(75) NOT NULL UNIQUE,
   customer_address varchar(175) NOT NULL
);

-- CREATE An Orders Table
CREATE OR REPLACE TABLE Orders (
    order_number int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    customer_ID int,
    order_date Date NOT NULL,
    credit_card_number varchar(19),
    credit_card_exp_date varchar(8),
    FOREIGN KEY (customer_ID) REFERENCES Customers(customer_ID) ON DELETE SET NULL
);

-- CREATE A Products Table
CREATE OR REPLACE TABLE Products (
    product_number int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_type varchar(75) NOT NULL,
    title varchar(45) NOT NULL,
    retail_price float NOT NULL,
    quantity_in_stock int NOT NULL
);

-- CREATE A OrderItems Table
CREATE OR REPLACE TABLE Order_Items (
    order_number int NOT NULL,
    product_number int NOT NULL,
    quantity int NOT NULL,
    selling_price float NOT NULL,
    is_shipped tinyint(1),
    FOREIGN KEY (order_number) REFERENCES Orders(order_number) ON DELETE CASCADE,
    FOREIGN KEY (product_number) REFERENCES Products(product_number) ON DELETE CASCADE
);

-- CREATE A CREDENTIALS Table
CREATE OR REPLACE TABLE Credentials (
    customer_ID int NOT NULL,
    password varchar(24) NOT NULL,
    FOREIGN KEY (customer_ID) REFERENCES Customers(customer_ID) ON DELETE CASCADE
);

-- Describe each tables after creation
DESCRIBE Customers;
DESCRIBE Orders;
DESCRIBE Products;
DESCRIBE Order_Items;
DESCRIBE Credentials;

-- INSERT data into Customers table
INSERT INTO Customers (
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_address
)
VALUES
(
    "Clark",
    "Kent",
    "ckent@hello.com",
    "10 Superman Way, Kansas"
),
(
    "Frodo",
    "Baggins",
    "fbaggins@hello.com",
    "1 Shire Way, Middle Earth"
),
(
    "Tony",
    "Stark",
    "tstark@starkindustries.com",
    "10880 Malibu Point, California"
),
(
    "Jay",
    "Gatsby",
    "jgatsby@hello.com",
    "235 Middle Neck Road, New York"
),
(
    "Hermione",
    "Granger",
    "hgranger@hogwarts.edu",
    "1 Hogwarts Drive, Scotland"
);

-- INSERT data into Orders Table
INSERT INTO Orders (
    customer_ID,
    order_date,
    credit_card_number,
    credit_card_exp_date
)
VALUES
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 1),
    '2020-03-21',
    "1111-2222-3333-4444",
    "01/2029"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 1),
    '2020-03-29',
    "1111-2222-3333-4444",
    "01/2029"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 2),
    '2021-05-31',
    "5555-6666-7777-8888",
    "09/2027"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 2),
    '2021-09-21',
    "5555-6666-7777-8888",
    "09/2027"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 3),
    '2022-02-12',
    "7777-8888-4444-6666",
    "06/2023"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 4),
    '2022-04-04',
    "6666-2222-4444-7777",
    "07/2026"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 4),
    '2022-05-15',
    "6666-2222-4444-7777",
    "07/2026"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 5),
    '2023-01-24',
    "3333-7777-5555-4444",
    "01/2028"
);

-- INSERT data into Products table
INSERT INTO Products (
    product_number,
    product_type,
    title,
    retail_price,
    quantity_in_stock
)
VALUES
(
    1,
    "Cough Suppressant",
    "Robitussin",
    29.99,
    100
),
(
    2,
    "Pain Reliever",
    "Advil",
    19.99,
    250
),
(
    3,
    "Cough Suppressant",
    "Vick's VapoRub",
    9.99,
    55
),
(
    4,
    "Muscle Relaxant",
    "Flexeril",
    119.99,
    20
),
(
    5,
    "Antibiotics",
    "Amoxil",
    89.99,
    300
);

-- INSERT data into OrderItems table
INSERT INTO Order_Items (
    order_number,
    product_number,
    quantity,
    selling_price,
    is_shipped
)
VALUES
(
    (SELECT order_number FROM Orders WHERE order_number = 1),
    (SELECT product_number FROM Products WHERE product_number = 2),
    1,
    19.99,
    1
),
(
    (SELECT order_number FROM Orders WHERE order_number = 2),
    (SELECT product_number FROM Products WHERE product_number = 5),
    1,
    89.99,
    1
),
(
    (SELECT order_number FROM Orders WHERE order_number = 3),
    (SELECT product_number FROM Products WHERE product_number = 5),
    1,
    89.99,
    0
),
(
    (SELECT order_number FROM Orders WHERE order_number = 4),
    (SELECT product_number FROM Products WHERE product_number = 4),
    1,
    119.99,
    1
),
(
    (SELECT order_number FROM Orders WHERE order_number = 5),
    (SELECT product_number FROM Products WHERE product_number = 1),
    2,
    29.99 * 2,
    0
);

-- INSERT data into Credentials table
INSERT INTO Credentials (
    customer_ID,
    password
)
VALUES
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 1),
     "Password1234"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 2),
    "123456789"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 3),
    "CaptainAmerica1776"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 4),
    "cat"
),
(
    (SELECT customer_ID FROM Customers WHERE customer_ID = 5),
    "dog"
);

-- Retrieve all data from each table
select * from Customers;
select * from Orders;
select * from Products;
select * from Order_Items;
select * from Credentials;

-- SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
