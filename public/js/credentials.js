// Get the objects we need to modify
let addCredentialForm = document.getElementById('add-credential-form-ajax');
let updateCredentialForm = document.getElementById('update-credentials');
let selectMenu = [document.getElementById("customer_id")];
let table = document.getElementById("credentials-table");

// Modify the objects we need
addCredentialForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("customer-id");
    let inputPassword = document.getElementById("input-password");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let passwordValue = inputPassword.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_ID: customerIdValue,
        password: passwordValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-credential-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerId.value = '';
            inputPassword.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

updateCredentialForm.addEventListener("submit", function(e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("customer_id").value;
    let inputPassword = document.getElementById("password").value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_ID : inputCustomerId,
        password    : inputPassword,
    }

    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-credentials", true);
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

// Creates a single row from an Object representing a single record from 
// Credentials
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("credentials-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerIdCell = document.createElement("TD");
    let passwordCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIdCell.innerText = newRow.customer_ID;
    passwordCell.innerText = newRow.password;
    
    // Fill in the cell with Delete button and make it functional
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.customer-id);
    };


    
    // Add the cells to the row 
    row.appendChild(customerIdCell);
    row.appendChild(passwordCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.customer_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.customer_ID + ' ' +  newRow.password;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}

// For updating functionalty when user updates a customer with credential
updateRowOnTable = (data) => {
    let parsedData = JSON.parse(data);

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerHTML == parsedData[0].customer_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            updateRowIndex.cells[1].innerHTML = parsedData[0].password;

       }
    }
}

// For fill in when users want to update certain customers
fillInUpdateForm = () => {
    // Iterate through the rows 
    for (let i = 0, row; row = table.rows[i]; i++) {
        // If value matches, fill in the from
        if (table.rows[i].cells[0].innerHTML == selectMenu[0].value) {
            let info = table.getElementsByTagName("tr")[i];

            document.getElementById("password").value = info.cells[1].innerHTML;
            break;
        }   
    } 
}

// Clear update form after updating credentials
clearUpdateFields = () => {
    document.getElementById("customer_id").value = 'test';
    document.getElementById("password").value = '';
}

// Delete credential 
deleteCredential = (customer_ID) => {
    let data = {customer_ID: customer_ID};
    console.log("Delete Credential: " + customer_ID);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-credentials", true);
    xhttp.setRequestHeader("content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove data from table
            deleteRow(customer_ID);
            deleteDropDownMenu(customer_ID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Delete row
deleteRow = (customer_ID) => {
    for (let i = 0, row; row = table.rows[i]; i++) {
      // check each row for customer_ID, if found, delete row
      if (table.rows[i].cells[0].innerHTML == customer_ID) {
          table.deleteRow(i);
          break;
      }
    }
}

// Delete item from drop down menu when credential is deleted
deleteDropDownMenu = (customer_ID) => {
    // Iterate through the rows
    for (let i = 0; i < selectMenu[0].length; i++){
    // If it matches, delete it
      if (selectMenu[0].options[i].value == customer_ID){
        selectMenu[0][i].remove();
        break;
      } 
    }
    clearUpdateFields();
}