// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form');
let addPersonForm = document.getElementById('add-person-form');
let table = document.getElementById("customer-table");

// Modify the objects we need
// addPersonForm.addEventListener("submit", function (e) {
    
//     // Prevent the form from submitting
//     e.preventDefault();

//     // Get form fields we need to get data from
//     let inputFirstName = document.getElementById("input-customer-first-name").value;
//     let inputLastName = document.getElementById("input-customer-last-name").value;
//     let inputCustomerEmail = document.getElementById("input-customer-email").value;
//     let inputCustomerAddress = document.getElementById("input-customer-address").value;

//     // Put our data we want to send in a javascript object
//     let data = {
//         customer_first_name: inputFirstName,
//         customer_last_name: inputLastName,
//         customer_email: inputCustomerEmail,
//         customer_address: inputCustomerAddress
//     }
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "/add-person", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 200) {

//             // Add the new data to the table
//             addRowToTable(xhttp.response);

//             // Clear the input fields for another transaction
//             inputFirstName.value = '';
//             inputLastName.value = '';
//             inputCustomerEmail.value = '';
//             inputCustomerAddress.value = '';
//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 200) {
//             console.log("There was an error with the input.")
//         }
//     }

//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));

// })

// Add row to customer table
addRowToTable = (data) => {

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = table.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    firstNameCell.innerText = newRow.fname;
    lastNameCell.innerText = newRow.lname;
    emailCell.innerText = newRow.customerEmail;
    addressCell.innerText = newRow.customerAddress;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomer(newRow.id);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailCell);
    row.appendChild(addressCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    table.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' +  newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}

// code for updating Customer
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName           = document.getElementById("customer").value;
    let inputCustomerFirstName  = document.getElementById("customer_first_name").value;
    let inputCustomerLastName   = document.getElementById("customer_last_name").value;
    let inputCustomerEmail      = document.getElementById("customer_email").value;
    let inputCustomerAddress    = document.getElementById("customer_address").value;


    // Put our data we want to send in a javascript object
    let data = {
    customer_ID         : inputFullName,
    customer_first_name : inputCustomerFirstName,
    customer_last_name  : inputCustomerLastName,
    customer_email      : inputCustomerEmail,
    customer_address    : inputCustomerAddress,
    }
    

    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // update the new data to the table
            updateRow(xhttp.response);

            // Update name in select menu
            updateSelectMenu(xhttp.response);

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Fill in the update form when users want to update certain customer
fillInUpdateForm = () => {
    let selectMenu = document.getElementById("customer");
    let table = document.getElementById("customer-table");

    // Iterate through the rows to search for the selected drop down item
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].cells[0].innerHTML == selectMenu.value) {
            let info = table.getElementsByTagName("tr")[i];

            document.getElementById("customer_first_name").value = info.cells[1].innerHTML;
            document.getElementById("customer_last_name").value = info.cells[2].innerHTML;
            document.getElementById("customer_email").value = info.cells[3].innerHTML;
            document.getElementById("customer_address").value = info.cells[4].innerHTML;
            break;
        }   
    } 
}

// Update the row in customers table
updateRow = (data) => {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerHTML == parsedData[0].customer_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.cells[0].innerHTML = parsedData[0].customer_ID;
            updateRowIndex.cells[1].innerHTML = parsedData[0].customer_first_name;
            updateRowIndex.cells[2].innerHTML = parsedData[0].customer_last_name;
            updateRowIndex.cells[3].innerHTML = parsedData[0].customer_email;
            updateRowIndex.cells[4].innerHTML = parsedData[0].customer_address;

       }
    }
}

// Update the select menu when user successfully update a customer
updateSelectMenu = (data) => {
    let parsedData = JSON.parse(data);

    let selectMenu = document.getElementById("customer");

    // Iterate through the table and update the values
    for (let i = 0; i < selectMenu.length; i++){
        if (selectMenu.options[i].value == parsedData[0].customer_ID){
            selectMenu[i].innerHTML = parsedData[0].customer_first_name + " " + parsedData[0].customer_last_name;
            break;
        } 
    }
}

// code for deleteing customer
deleteCustomer = (customer_ID) => {
    // Put our data we want to send in a javascript object
    let data = {customer_ID: customer_ID};
    console.log("Delete Customer: " + data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove data from table
            deleteRow(customer_ID);
            deleteDropDownMenu(customer_ID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Delete row 
deleteRow = (customer_ID) => {
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
      // check each row for customer_ID, if found, delete row
      if (table.rows[i].cells[0].innerHTML == customer_ID) {
          table.deleteRow(i);
          break;
      }
    }
}

// Delete item from drop down menu
deleteDropDownMenu = (customer_ID) => {
  let selectMenu = document.getElementById("customer");

  for (let i = 0; i < selectMenu.length; i++){
    if (selectMenu.options[i].value == customer_ID){
      selectMenu[i].remove();
      break;
    } 
  }
}