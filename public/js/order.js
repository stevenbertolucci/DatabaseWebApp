// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order');
let updateOrderForm = document.getElementById('update-order');
let table = document.getElementById("orders-table");
let selectMenu = [document.getElementById("selectedOrder0"), document.getElementById("selectedOrder1")];

// add order form submission
addOrderForm.addEventListener("submit", function(e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("customer-id");
    let inputOrderDate = document.getElementById("input-order-date");
    let inputCreditCardNumber = document.getElementById("input-credit-card-number");
    let inputCreditCardExpDate = document.getElementById("input-credit-card-exp-date");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let orderDateValue = inputOrderDate.value;
    let creditCardNumberValue = inputCreditCardNumber.value;
    let creditCardExpDateValue = inputCreditCardExpDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_ID: customerIdValue,
        order_date: orderDateValue,
        credit_card_number: creditCardNumberValue,
        credit_card_exp_date: creditCardExpDateValue,
    }

    console.log(order_date);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerId.value = '';
            inputOrderDate.value = '';
            inputCreditCardNumber.value = '';
            inputCreditCardExpDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// update order form submission
updateOrderForm.addEventListener("submit", function(e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("selectedOrder1").value;
    let inputCustomerId = document.getElementById("selectedOrder2").value;
    let inputOrderDate = document.querySelector('input[name = input-order-date]').value;
    let inputCreditCardNumber = document.getElementById("credit_card_number").value;
    let inputCreditCardExpDate = document.getElementById("credit_card_exp_date").value;

    // Put our data we want to send in a javascript object
    let data = {
        order_number            : inputOrderId,
        customer_ID             : inputCustomerId,
        order_date              : inputOrderDate,
        credit_card_number      : inputCreditCardNumber,
        credit_card_exp_date    : inputCreditCardExpDate,
    }

    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log(xhttp.response);
            updateRowOnTable(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


addRowToTable = (data) => {

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = table.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow);

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let orderIdCell = document.createElement("TD");
    let customerIdCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let creditCardNumberCell = document.createElement("TD");
    let creditCardExpDateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIdCell.innerText = newRow.order_number;
    customerIdCell.innerText = newRow.customer_ID;
    orderDateCell.innerText = newRow.order_date;
    creditCardNumberCell.value = newRow.credit_card_number;
    creditCardExpDateCell.value = newRow.credit_card_exp_date;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.className = "btnWarning";
    deleteCell.onclick = function(){
        deleteOrder(newRow.order_number);
    };

    // Add the cells to the row 
    row.appendChild(orderIdCell);
    row.appendChild(customerIdCell);
    row.appendChild(orderDateCell);
    row.appendChild(creditCardNumberCell);
    row.appendChild(creditCardExpDateCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_number);

    // Add the row to the table
    table.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("selectedOrder0");
    let option = document.createElement("option");
    option.text = newRow.order_number;
    option.value = newRow.order_number;
    selectMenu.add(option);

    selectMenu = document.getElementById("selectedOrder1");
    option = document.createElement("option");
    option.text = newRow.order_number;
    option.value = newRow.order_number;
    selectMenu.add(option);
}

fillInUpdateForm = () => {

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
        // find table row matching selectMenu chioce
        if (table.rows[i].cells[0].innerHTML == selectMenu[1].value) {
            let info = table.getElementsByTagName("tr")[i];

            // fill in update form with information from table
            document.getElementById("selectedOrder2").value = info.cells[1].innerHTML;
            document.getElementById("order_date").value = info.cells[2].innerHTML;
            document.getElementById("credit_card_number").value = info.cells[3].innerHTML;
            document.getElementById("credit_card_exp_date").value = info.cells[4].innerHTML;
            break;
        }   
    } 
}

updateRowOnTable = (data) => {
    let parsedData = JSON.parse(data);

    console.log(parsedData);

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerHTML == parsedData[0].order_number) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // updated data in table
            updateRowIndex.cells[0].innerHTML = parsedData[0].order_number;
            updateRowIndex.cells[1].innerHTML = parsedData[0].customer_ID;
            updateRowIndex.cells[2].innerHTML = parsedData[0].order_date;
            updateRowIndex.cells[3].innerHTML = parsedData[0].credit_card_number;
            updateRowIndex.cells[4].innerHTML = parsedData[0].credit_card_exp_date;
       }
    }
}

deleteOrder = (order_number) => {
    let data = {order_number: order_number};
    console.log("Delete Order: " + order_number);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order", true);
    xhttp.setRequestHeader("content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove data from table
            deleteRow(order_number);
            deleteDropDownMenu(order_number);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

deleteRow = (order_number) => {
    for (let i = 0, row; row = table.rows[i]; i++) {
      // check each row for order_number, if found, delete row
      if (table.rows[i].cells[0].innerHTML == order_number) {
          table.deleteRow(i);
          break;
      }
    }
}

deleteDropDownMenu = (order_number) => {

    // find order_number in select menu and remove it
    for (let i = 0; i < selectMenu[0].length; i++){
      if (selectMenu[0].options[i].value == order_number){
        selectMenu[0][i].remove();
        selectMenu[1][i].remove();
        break;
      } 
    }
    clearUpdateFields();
}

clearUpdateFields = () => {
    // set all fields in update form to their default
    document.getElementById("selectedOrder1").value = 'test';
    document.getElementById("selectedOrder2").value = 'test';
    document.getElementById("order_date").value = '';
    document.getElementById("credit_card_number").value = '';
    document.getElementById("credit_card_exp_date").value = '';
}