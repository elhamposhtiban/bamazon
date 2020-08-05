
// starting with require files

const inquirer = require("inquirer")
const mysql = require("mysql")
const {table} = require("table")
const chalk = require("chalk")

//connecting mysql to the js file
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {

    if (err) throw err;
    // console.log(connection);
    console.log("connected as id" + connection.threadId);

    //here we execute this function inorder to have the table and data in cli

    displayItems(); 
})

function displayItems() {

    connection.query("select * from products", function (err, res) {

     if (err) throw err;
    const data = res.map ((products)=> [products.id, products.product_name, products.department_name, products.price, products.stock_quantity])
   
    const tableData = [
        ['id', 'product_name', 'department_name', 'price', 'stock_quantity']
        , ...data ]
   
    //  console.log(data)

    console.log("\n");
    console.log(chalk.yellow.inverse("*************welcome to bamazon shop***********"));
    console.log("\n");

     console.log(chalk.blue(table(tableData)))



     inquirer.prompt({
     
       type: 'confirm',
       name: 'confirm',
       message: chalk.magenta.inverse('Are you ready for shopping ??')

     }).then(function (answer) {
       if (answer.confirm === true) {
        start();
       } else {
         console.log(chalk.red.inverse('\n NOPE ! next time ######'));
         connection.end();
       }
     });

    })
}

//here we starting the app by asking two question from user 

 function start() {

       
    inquirer.prompt([

        {

            name : "productId",
            type : "input",
            message :chalk.inverse.cyan("select id of the product that you would like to buy?"),
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
      
        {
            name : "quantity",
            type : "input",
            message : chalk.inverse.yellow(" how many units of the product you would like to buy?"),
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
   

         ])

      .then(function(response){


      const itemId = response.productId;
      const quantityProduct = response.quantity;

      const query = "select * from products where ?";

        connection.query(

            query,
        
            { id: itemId },
            
            function (err, res) {
        
            if (err) throw err;

            const data = res.map ((products)=> [products.id, products.product_name, products.department_name, products.price, products.stock_quantity])

            let chosenItem ;

            for (let i = 0; i < res.length; i++ ) {

              if ( res[i].id === parseInt(itemId) ) {

              chosenItem = res[i];
                
            }
            
             }
             
           
            if (chosenItem.stock_quantity < parseInt(quantityProduct)) {

              console.log(`\n \n ooppss! so sorry there is not enough quantity of ${chosenItem.product_name}`)
          
              displayItems()
           
            } else {

                const query = "update products set ? where ?"
                connection.query (

                    query,
                    [
                       
                        {stock_quantity : (parseInt(chosenItem.stock_quantity) - parseInt(quantityProduct))} ,

                        {id : itemId}
                    ],

                    function(err) {
                        if (err) throw err;
                
                        let totalPrice = parseInt(chosenItem.price) * parseInt(quantityProduct)
                        console.log(chalk.magenta.inverse(`\n YOUR TOTAL IS : ${totalPrice}
                        \n YOUR PURCHASED : ${chosenItem.product_name}` + `\n ${quantityProduct}`))

                      displayItems()
                      }


                       )
               }
        })

     })

}


