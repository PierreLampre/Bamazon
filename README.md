# Bamazon

Here we have a CLI app with two separate script files:

    - bamazon.js
    - bamazonMgr.js

In bamazon.js, the application walks a customer through placing a purchase order.  It initially displays a table of the available stock.  It then prompts the user to enter a product ID (r Q to quit).  Should the user enter an ID, a second question is asked, how many of the item the user would like to purchase.  Upon deciding and entering a quantity, the user's total is calculated an returned and the a new table is generated to show the change in stock.

bamazonMgr.js is a CLI app that gives a hypothetical manager the following editing options for the stock database:

    - View Inventory
    - View Low Inventory Items
    - Add to inventory
    - Create new item
    - Quit

The first option is a direct copy of the view inventory functionality of bamazon.js

The second option runs a query to only return the manager a table of items whose stock is under 5 units.

The third option 1) Shows the manager the available inventory.  2) Asks for the ID of the item the manager wishes to add to.  3) Asks how many units the manager would like to add.  4) Relists the inventory to reflect the changes made to the database.

The fourth option allows the manager to add a new item to the database.  It will first ask for the name, then the desired department, the price per unit, and the stock quantity.

Choosing to quit ends the connection and returns the user to a normal Bash window.

For this app I used the following languages/packages:

    - Node.js
    - Express
    - Console.table
    - MySQL