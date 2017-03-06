// BUDGET CONTROLLER / BUDGET CALCULATIONS
var budgetController = (function () {
    //Function constructor for income
    var Income = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };
    //Function constructor for expense
    var Expense = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.percentage = -1;
    };
    Expense.prototype.calcPercent = function (totalAmt) {
        if (totalAmt > 0) {
            this.percentage = Math.round((this.amount / totalAmt) * 100);
        }
        else {
            this.percentage = 0;
        }
    };
    Expense.prototype.getPercent = function () {
        return this.percentage;
    };
    var calculateTotals = function (type) {
        var total = 0.00
            , i;
        for (i = 0; i < dataStructure.allItems[type].length; i++) {
            console.log(i + " = " + dataStructure.allItems[type][i].amount)
            total += parseFloat(dataStructure.allItems[type][i].amount);
        }
        dataStructure.totals[type] = parseFloat(total).toFixed(2);
    };
    //Data structure for storing all activities
    var dataStructure = {
        allItems: {
            inc: []
            , exp: []
        }
        , totals: {
            inc: 0.00
            , exp: 0.00
        }
        , budget: 0.00
        , percentage: -1
    }
    return {
        insertData: function (type, des, amt) {
            var newItem, ID;
            // Set value of ID
            if (dataStructure.allItems[type].length > 0) {
                ID = dataStructure.allItems[type][dataStructure.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            // Create new Item base on income or expenses
            if (type === 'inc') {
                newItem = new Income(ID, des, amt);
            }
            else {
                newItem = new Expense(ID, des, amt);
            }
            //Push new item into data structure
            dataStructure.allItems[type].push(newItem);
            //Return new item to use else where
            return newItem;
        }
        , calculateTotalBudget: function () {
            //Calculate total income and expense
            calculateTotals("exp");
            calculateTotals("inc");
            //Calculate total
            dataStructure.budget = (dataStructure.totals.inc - dataStructure.totals.exp).toFixed(2);
            //Calculate percentage
            if (dataStructure.totals.inc > 0) {
                dataStructure.percentage = Math.round((dataStructure.totals.exp / dataStructure.totals.inc) * 100);
            }
        }
        , calculatePercentage: function () {
            var totalIncome = dataStructure.totals.inc;
            dataStructure.allItems.exp.forEach(function (el) {
                el.calcPercent(totalIncome);
            })
        }
        , getPercentage: function () {
            var values;
            values = dataStructure.allItems.exp.map(function (el) {
                return el.getPercent();
            });
            return values;
        }
        , deleteData: function (type, id) {
            var ids, index;
            ids = dataStructure.allItems[type].map(function (el) {
                return el.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                dataStructure.allItems[type].splice(index, 1);
            }
            /*
            dataStructure.allItems[typeOfData].forEach(function(element){
                if(element.id  === IdOfData){
                    var index = dataStructure.allItems[typeOfData].indexOf(element.id);
                    dataStructure.allItems[typeOfData].splice(index, 1);
                }
            });*/
        }
        , getTotalBudget: function () {
            return {
                totalIncome: dataStructure.totals.inc
                , totalExpense: dataStructure.totals.exp
                , totalBudget: dataStructure.budget
                , totalPercent: dataStructure.percentage
            }
            // return dataStructure;
        }
        , testing: function () {
            return dataStructure;
        }
    }
})();
// UI CHANGES CONTROLLER
var UIController = (function () {
    // HTML Page Element id, element class
    var DOM = {
        addBtn: '.add__btn'
        , ddlType: ".add__type"
        , txtDescription: ".add__description"
        , txtAmount: ".add__value"
        , incomeList: ".income__list"
        , expensesList: ".expenses__list"
        , totalRemainingBudget: ".budget__value"
        , totalBudgetIncome: ".budget__income--value"
        , totalBudgetExpenses: ".budget__expenses--value"
        , totalExpensesPercent: ".budget__expenses--percentage"
        , container: '.container'
        , month: '.budget__title--month'
        , percentageInList: '.item__percentage'
    };
    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    //Object for setting value global
    return {
        inputValues: function () {
            var str = document.querySelector(DOM.txtDescription).value;
            // values passed in an object
            return {
                type: document.querySelector(DOM.ddlType).value, // Will return inc or dec
                description: str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(), //Will eturn description
                amount: parseFloat(document.querySelector(DOM.txtAmount).value) //Will return amount
            };
        }, // Method for adding dynamic component
        insertValuesToList: function (itemFromInputvalue, typeOfOperation) {
            var html, newHtml;
            //1. Create HTML elements by placing placeholder
            if (typeOfOperation === 'inc') {
                element = DOM.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (typeOfOperation === 'exp') {
                element = DOM.expensesList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value"> %amount%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //2.Replace placeholders with new data
            newHtml = html.replace('%id%', itemFromInputvalue.id);
            newHtml = newHtml.replace('%description%', itemFromInputvalue.description);
            newHtml = newHtml.replace('%amount%', formatNumber(itemFromInputvalue.amount, typeOfOperation));
            //3. Apply changes to HTML
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }
        , deleteValuesFromList: function (selectorId) {
            var el;
            el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        }
        , displayBudget: function (objectValuesFromBudgetController) {
            if (objectValuesFromBudgetController.totalBudget > 0) {
                document.querySelector(DOM.totalRemainingBudget).textContent = formatNumber(objectValuesFromBudgetController.totalBudget, 'inc');
            }
            else if (objectValuesFromBudgetController.totalBudget < 0) {
                document.querySelector(DOM.totalRemainingBudget).textContent = formatNumber(objectValuesFromBudgetController.totalBudget, 'exp');
            }
            else {
                document.querySelector(DOM.totalRemainingBudget).textContent = '00.00';
            }
            document.querySelector(DOM.totalBudgetIncome).textContent = formatNumber(objectValuesFromBudgetController.totalIncome, 'inc');
            document.querySelector(DOM.totalBudgetExpenses).textContent = formatNumber(objectValuesFromBudgetController.totalExpense, 'dec');
            if (objectValuesFromBudgetController.totalPercent >= 0) {
                document.querySelector(DOM.totalExpensesPercent).textContent = objectValuesFromBudgetController.totalPercent + "%";
            }
            else {
                document.querySelector(DOM.totalExpensesPercent).textContent = '---';
            }
        }
        , displayPercentInList: function (percentage) {
            var field = document.querySelectorAll(DOM.percentageInList);
            var nodeList = function (list, callbackfn) {
                for (var i = 0; i < list.length; i++) {
                    callbackfn(list[i], i);
                }
            };
            nodeList(field, function (el, ind) {
                if (percentage[ind] > 0) {
                    el.textContent = percentage[ind] + '%';
                }
                else {
                    el.textContent = '---';
                }
            });
        }
        , getDOM: function () {
            return DOM;
        }
        , displayMonth: function () {
            var month, year, date, monthArr;
            monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septmber', 'October', 'November', 'December'];
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            document.querySelector(DOM.month).textContent = monthArr[month] + ", " + year;
        }, // Set the default values of the elements
        clearAll: function () {
            /*
            document.querySelector(DOM.ddlType).value = "inc";
            document.querySelector(DOM.txtDescription).value = "";
            document.querySelector(DOM.txtAmount).value = "";
            */
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOM.txtDescription + ', ' + DOM.txtAmount);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            document.querySelector(DOM.txtDescription).focus();
        }
    , };
})();
// GLOBAL APP CONTROLLER
var controller = (function (UICtrl, budgetCtrl) {
    // Function to set all eventlistner
    function setEventListner() {
        //CALL METHOD FOR GETTING HTML PAGE ELEMENTS ID AND CLASS NAME
        var DOM = UICtrl.getDOM();
        // EVENT LISTNER FOR ADD BUTTON CLICK 
        document.querySelector(DOM.addBtn).addEventListener('click', insertData);
        // EVENT LISTNER FOR ANY KEY PRESS
        document.addEventListener('keypress', function (press) {
            //ENTER KEY PRESS
            if (press.keyCode === 13 || press.which === 13) {
                insertData();
                UICtrl.clearAll();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', deleteData);
    };
    // CALCULATING OVERALL BUDGET
    function updateOverallBudget() {
        var totalBudgetValues;
        //1. Calculations
        budgetCtrl.calculateTotalBudget();
        //2. Return Values
        totalBudgetValues = budgetCtrl.getTotalBudget();
        //3. Display In UI
        UICtrl.displayBudget(totalBudgetValues);
    };
    // FUNCTION FOR ADD DATA TO DATA STRUCTURE AND SHOWING IN LIST
    function insertData() {
        var data, newItem;
        //1. GET INPUT DATA FROM UI
        data = UICtrl.inputValues();
        if (data.amount > 0 && !isNaN(data.amount) && data.description !== "") {
            //2. ADD INPUT DATA TO BUDGET CONTROLLER DATA STRUCTURE
            newItem = budgetCtrl.insertData(data.type, data.description, data.amount);
            //3. ADD ITEM TO UI (ItemList) (BOTTOM SECTION)
            UICtrl.insertValuesToList(newItem, data.type);
            //4. Clear Fields
            UICtrl.clearAll();
            //5. CALCULATE & update OVERALL BUDGET
            updateOverallBudget();
            //6. Update Percentage in List
            updatePercentageInList();
        }
    };

    function updatePercentageInList() {
        // calculate Percentages
        budgetCtrl.calculatePercentage();
        // Return the value
        var percentages = budgetCtrl.getPercentage();
        // UI Updates
        console.log("Percent:" + percentages);
        UICtrl.displayPercentInList(percentages);
    };
    //Function for delete items from list
    function deleteData(event) {
        //1. Find ID,Type to identify element
        var itemId, type, ID, splitId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
        }
        //2. Delete It from data structure
        budgetCtrl.deleteData(type, ID);
        //3. Delete from UI
        UICtrl.deleteValuesFromList(itemId);
        //4. Update Budget
        updateOverallBudget();
        //5. Update Percentage in List
        updatePercentageInList();
    };
    return {
        init: function () {
            UICtrl.displayMonth();
            setEventListner();
        }
    }
})(UIController, budgetController);
controller.init();