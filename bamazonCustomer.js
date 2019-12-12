const inquirer = require("inquirer")
const mysql = require("mysql")
const chalk = require("chalk")
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(connection);
    console.log("connected as id" + connection.threadId);
    displayItems()
})

function displayItems() {
    connection.query("select * from products", function (err, res) {
     if (err) throw err;
     const data = res.map ((products)=> [products.id, products.product_name, products.department_name, products.price, products.stock_quantity])
     console.log(data)
     connection.end();
    })
}