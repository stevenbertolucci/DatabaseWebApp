// Get the objects we need to modify
let addOrderItemsForm = document.getElementById('add-orderItems-form-ajax');
let updateOrderItemForm = document.getElementById("update_order_item");
let table = document.getElementById("orderItems-table");
let selectMenu = [document.getElementById("mySelectedOrder"), document.getElementById("order_number"), document.getElementById("product_number")]

// add order item form submission
addOrderItemsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderNumber = document.getElementById("order-number");
    let inputProductNumber = document.getElementById("product-number");
    let inputQuantity = document.getElementById("input-quantity");
    let inputSellingPrice = document.getElementById("input-selling-price");
    let inputIsShipped = document.querySelector('input[name = "input-is-shipped"]:checked');

    // Get the values from the form fields
    let orderNumberValue = inputOrderNumber.value;
    let productNumberValue = inputProductNumber.value;
    let quantityValue = inputQuantity.value;
    let sellingPriceValue = inputSellingPrice.value;
    let isShippedValue = inputIsShipped.value;

    // Put our data we want to send in a javascript object
    let data = {
        order_number: orderNumberValue,
        product_number: productNumberValue,
        quantity: quantityValue,
        selling_price: sellingPriceValue,
        is_shipped: isShippedValue,
    }
    
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-orderItems-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderNumber.value = '';
            inputProductNumber.value = '';
            inputQuantity.value = '';
            inputSellingPrice.value = '';
            inputIsShipped.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// update order item form submission
updateOrderItemForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderNumber    = document.getElementById("order_number").value;
    let inputProductNumber  = document.getElementById("product_number").value;
    let inputQuantity       = document.getElementById("quantity").value;
    let inputSellingPrice   = document.getElementById("selling_price").value;
    let inputIsShipped      = document.querySelector('input[name="shipped"]:checked').value;

    // Put our data we want to send in a javascript object
    let data = {
    order_number    : inputOrderNumber,
    product_number  : inputProductNumber,
    quantity        : inputQuantity,
    selling_price   : inputSellingPrice,
    is_shipped      : inputIsShipped,
    }

    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-item", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // update the new data to the table
            updateRow(xhttp.response);

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

updateRow = (data) => {
    let parsedData = JSON.parse(data);

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
       //rows would be accessed using the "row" variable assigned in the for loop
       if ((table.rows[i].cells[0].innerHTML == parsedData[0].order_number) &&
           (table.rows[i].cells[1].innerHTML == parsedData[0].product_number)) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // updated data in table
            updateRowIndex.cells[2].innerHTML = parsedData[0].quantity;
            updateRowIndex.cells[3].innerHTML = parsedData[0].selling_price;
            updateRowIndex.cells[4].innerHTML = parsedData[0].is_shipped;

       }
    }
}

addRowToTable = (data) => {

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = table.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderNumberCell = document.createElement("TD");
    let productNumberCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let sellingPriceCell = document.createElement("TD");
    let isShippedCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderNumberCell.innerText = newRow.order_number;
    productNumberCell.innerText = newRow.product_number;
    quantityCell.innerText = newRow.quantity;
    sellingPriceCell.innerText = newRow.selling_price;
    isShippedCell.innerText = newRow.is_shipped;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrderItem(newRow.order_number, newRow.product_number);
    };

    // Add the cells to the row 
    row.appendChild(orderNumberCell);
    row.appendChild(productNumberCell);
    row.appendChild(quantityCell);
    row.appendChild(sellingPriceCell);
    row.appendChild(isShippedCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    table.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let orderOption = document.createElement("option");
    orderOption.text = newRow.order_number;
    orderOption.value = newRow.order_number;
    selectMenu[0].add(orderOption);
    selectMenu[1].add(orderOption);

    let productOption = document.createElement("option");
    productOption.text = newRow.product_number;
    productOption.value = newRow.product_number;
    selectMenu[2].add(productOption);
}

fillInUpdateForm = () => {

    // only fill in form if both select menus have been used
    if ((selectMenu[1].value == "test") || (selectMenu[2].value == "test")) {
        return;
    }

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
        // find table row matching selectMenu choices
        if (table.rows[i].cells[0].innerHTML == selectMenu[1].value &&
            table.rows[i].cells[1].innerHTML == selectMenu[2].value) {
            let info = table.getElementsByTagName("tr")[i];

            console.log(info);

            // fill in update form with information from table
            document.getElementById("quantity").value = info.cells[2].innerHTML;
            document.getElementById("selling_price").value = info.cells[3].innerHTML;

            if (info.cells[4].innerHTML == 1) {
                document.getElementById("is_shipped").checked = "checked";
                document.getElementById("not_shipped").checked = "";
            } else {
                document.getElementById("not_shipped").checked = "checked";
                document.getElementById("is_shipped").checked = "";
            }
            break;
        }   
    } 
}

deleteOrderItem = (order_number, product_number) => {
    let data = {
    order_number: order_number,
    product_number: product_number,
    };
    console.log("Delete Order Item: Order_number: " + order_number + " Product Number: " + product_number);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-item", true);
    xhttp.setRequestHeader("content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove data from table
            deleteRow(order_number, product_number);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

deleteRow = (order_number, product_number) => {
    for (let i = 0, row; row = table.rows[i]; i++) {
        // check each row for order_number and product_number, if found, delete row
        if (table.rows[i].cells[0].innerHTML == order_number) {
            if (table.rows[i].cells[1].innerHTML == product_number) {
                table.deleteRow(i);
                break;  
            }
        }
    }
}
