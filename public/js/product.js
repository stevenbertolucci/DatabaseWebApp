// Get the objects we need to modify
let addProductForm = document.getElementById('add-product');
let updateProductForm = document.getElementById("update-order");
let table = document.getElementById("products-table");
let selectMenu = [document.getElementById("selectedProduct0"), document.getElementById("selectedProduct1")];

// add product form submission
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductType = document.getElementById("input-product-type");
    let inputTitle = document.getElementById("input-title");
    let inputRetailPrice = document.getElementById("input-retail-price");
    let inputQuantityInStock = document.getElementById("input-quantity-in-stock");

    // Get the values from the form fields
    let productTypeValue = inputProductType.value;
    let titleValue = inputTitle.value;
    let retailPriceValue = inputRetailPrice.value;
    let quantityInStockValue = inputQuantityInStock.value;

    // Put our data we want to send in a javascript object
    let data = {
        product_type: productTypeValue,
        title: titleValue,
        retail_price: retailPriceValue,
        quantity_in_stock: quantityInStockValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputProductType.value = '';
            inputTitle.value = '';
            inputRetailPrice.value = '';
            inputQuantityInStock.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// update product form submission
updateProductForm.addEventListener("submit", function(e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductNumber = document.getElementById("selectedProduct1").value;
    let inputProductType = document.getElementById("product_type").value;
    let inputTitle = document.getElementById("title").value;
    let inputRetailPrice = document.getElementById("retail_price").value;
    let inputQuantityInStock = document.getElementById("quantity_in_stock").value;

    // Put our data we want to send in a javascript object
    let data = {
        product_number      : inputProductNumber,
        product_type        : inputProductType,
        title               : inputTitle,
        retail_price        : inputRetailPrice,
        quantity_in_stock   : inputQuantityInStock,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product", true);
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

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let productTypeCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let retailPriceCell = document.createElement("TD");
    let quantityInStockCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.product_number;
    productTypeCell.innerText = newRow.product_type;
    titleCell.innerText = newRow.title;
    retailPriceCell.innerText = newRow.retail_price;
    quantityInStockCell.innerText = newRow.quantity_in_stock;
    
    deleteCell = document.createElement("button");
    deleteCell.className = "btnWarning";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteProduct(newRow.product_number);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(productTypeCell);
    row.appendChild(titleCell);
    row.appendChild(retailPriceCell);
    row.appendChild(quantityInStockCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    table.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let tempSelectMenu = document.getElementById("selectedProduct0");
    let option = document.createElement("option");
    option.text = newRow.product_number;
    option.value = newRow.product_number;
    tempSelectMenu.add(option);

    tempSelectMenu = document.getElementById("selectedProduct1");
    option = document.createElement("option");
    option.text = newRow.product_number;
    option.value = newRow.product_number;
    tempSelectMenu.add(option);
}

updateRowOnTable = (data) => {
    let parsedData = JSON.parse(data);

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[0].innerHTML == parsedData[0].product_number) {
 
             // Get the location of the row where we found the matching person ID
             let updateRowIndex = table.getElementsByTagName("tr")[i];
 
             // updated data in table
             updateRowIndex.cells[0].innerHTML = parsedData[0].product_number;
             updateRowIndex.cells[1].innerHTML = parsedData[0].product_type;
             updateRowIndex.cells[2].innerHTML = parsedData[0].title;
             updateRowIndex.cells[3].innerHTML = parsedData[0].retail_price;
             updateRowIndex.cells[4].innerHTML = parsedData[0].quantity_in_stock;
        }
    }

}

fillInUpdateForm = () => {

    //iterate through rows
    for (let i = 0, row; row = table.rows[i]; i++) {
        // find table row matching selectMenu chioce
        if (table.rows[i].cells[0].innerHTML == selectMenu[1].value) {
            let info = table.getElementsByTagName("tr")[i];

            // fill in update form with information from table
            document.getElementById("product_type").value = info.cells[1].innerHTML;
            document.getElementById("title").value = info.cells[2].innerHTML;
            document.getElementById("retail_price").value = info.cells[3].innerHTML;
            document.getElementById("quantity_in_stock").value = info.cells[4].innerHTML;
            break;
        }   
    } 
}

deleteProduct = (product_number) => {
    let data = {product_number: product_number};
    console.log("Delete Product: " + data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-product", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove data from table
            deleteRow(product_number);
            deleteDropDownMenu(product_number);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

deleteRow = (product_number) => {

    // check each row for customer_ID, if found, delete row
    for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].cells[0].innerHTML == product_number) {
          table.deleteRow(i);
          break;
      }
    }
}

deleteDropDownMenu = (product_number) => {
    
    // find product number in select menu and remove it
    for (let i = 0; i < selectMenu[0].length; i++){
        if (selectMenu[0].options[i].value == product_number){
          selectMenu[0][i].remove();
          selectMenu[1][i].remove();
          break;
        } 
    }
    clearUpdateFields();
}

clearUpdateFields = () => {
    // set all fields in update form to their default
    document.getElementById("selectedProduct1").value = 'test';
    document.getElementById("product_type").value = '';
    document.getElementById("title").value = '';
    document.getElementById("retail_price").value = '';
    document.getElementById("quantity_in_stock").value = '';
}
