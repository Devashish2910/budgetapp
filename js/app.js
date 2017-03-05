// BUDGET CONTROLLER / BUDGET CALCULATIONS
var budgetController = (function () {
    
    //Function constructor for income
    function Income(id, description, amount){
        
        this.id = id;
        this.description = description;
        this.amount = amount; 
    };
    
    //Function constructor for expense
    function Expense(id, description, amount){
        
        this.id = id;
        this.description = description;
        this.amount = amount; 
    };
    
    var calculateTotals = function (type){
        var total = 0.00, i;
        for(i = 0; i < dataStructure.allItems[type].length; i++ ){
            console.log(i + " = " + dataStructure.allItems[type][i].amount)
            total += dataStructure.allItems[type][i].amount;
        }
        dataStructure.totals[type] = total;
       
    };
    
    //Data structure for storing all activities
    var dataStructure = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0.00,
            exp: 0.00
        },
        budget: 0,
        percentage: -1
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
        },
        calculateTotalBudget: function () {
                //Calculate total income and expense
                calculateTotals("exp");
                calculateTotals("inc");
                //Calculate total
                dataStructure.budget = (dataStructure.totals.inc - dataStructure.totals.exp).toFixed(2);
                //Calculate percentage
                dataStructure.percentage = Math.round((dataStructure.totals.exp / dataStructure.totals.inc ) * 100 );
            }
            , getTotalBudget: function () {
               return {
                    totalIncome: dataStructure.totals.inc,
                    totalExpense: dataStructure.totals.exp,
                    totalBudget: dataStructure.budget,
                    totalPercent: dataStructure.percentage
                }
               // return dataStructure;
            }
        }
})();

// UI CHANGES CONTROLLER
var UIController = (function () {
    
    // HTML Page Element id, element class
    var DOM = {
        addBtn: '.add__btn',
        ddlType: ".add__type",
        txtDescription: ".add__description",
        txtAmount: ".add__value",
        incomeList: ".income__list",
        expensesList: ".expenses__list",
        totalRemainingBudget: ".budget__value",
        totalBudgetIncome: ".budget__income--value",
        totalBudgetExpenses: ".budget__expenses--value",
        totalExpensesPercent: ".budget__expenses--percentage"
    };
    
    //Object for setting value global
    return {
        
       inputValues : function () {
        
        // values passed in an object
          return {
                type: document.querySelector(DOM.ddlType).value, // Will return inc or dec
                description: document.querySelector(DOM.txtDescription).value, //Will eturn description
                amount: parseFloat(document.querySelector(DOM.txtAmount).value) //Will return amount
            };
           
        // Values passed in an array
           /*
            var type = document.querySelector(DOM.ddlType).value; // Will return inc or dec
            var description = document.querySelector(DOM.txtDescription).value; //Will eturn description
            var amount = document.querySelector(DOM.txtAmount).value; //Will return amount
            var arr = [type, description, amount];
                return arr; */
        },
        
        // Method for adding dynamic component
        insertValuesToList: function (itemFromInputvalue, typeOfOperation) {
       var html, newHtml;
       //1. Create HTML elements by placing placeholder
       if (typeOfOperation === 'inc') {
           element = DOM.incomeList;
           html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }
       else if (typeOfOperation === 'exp') {
           element = DOM.expensesList;
           html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">- %amount%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }
       //2.Replace placeholders with new data
            newHtml = html.replace('%id%', itemFromInputvalue.id);
            newHtml  = newHtml.replace('%description%', itemFromInputvalue.description);
            newHtml  = newHtml.replace('%amount%', itemFromInputvalue.amount);
       //3. Apply changes to HTML
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        displayBudget: function(objectValuesFromBudgetController){
            
            if(objectValuesFromBudgetController.totalBudget > 0){
                 document.querySelector(DOM.totalRemainingBudget).textContent = "+ " + objectValuesFromBudgetController.totalBudget;
            }else{
                document.querySelector(DOM.totalRemainingBudget).textContent = "- " + objectValuesFromBudgetController.totalBudget;
            }
            document.querySelector(DOM.totalBudgetIncome).textContent = "+ " + objectValuesFromBudgetController.totalIncome;
            document.querySelector(DOM.totalBudgetExpenses).textContent = "- " + objectValuesFromBudgetController.totalExpense;
            
            if(objectValuesFromBudgetController.totalPercent >= 0){
            document.querySelector(DOM.totalExpensesPercent).textContent = objectValuesFromBudgetController.totalPercent + " %";
            }
            else{
                document.querySelector(DOM.totalExpensesPercent).textContent = '---';
            }
            
        },
        getDOM : function () {
            return DOM;
        },
        
        // Set the default values of the elements
        clearAll : function(){
            /*
            document.querySelector(DOM.ddlType).value = "inc";
            document.querySelector(DOM.txtDescription).value = "";
            document.querySelector(DOM.txtAmount).value = "";
            */
            
            var fields,fieldsArr;
            
            fields = document.querySelectorAll(DOM.txtDescription + ', ' + DOM.txtAmount);
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
           document.querySelector(DOM.txtDescription).focus();
            
        }
        
       
        
    };
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
   
        
 };
    
    // CALCULATING OVERALL BUDGET
    function updateOverallBudget(){
        
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
        var data,newItem;
        //1. GET INPUT DATA FROM UI
        data = UICtrl.inputValues();
      
        if(data.amount > 0 && !isNaN(data.amount) && data.description !== ""){ 
            
        //2. ADD INPUT DATA TO BUDGET CONTROLLER DATA STRUCTURE
        newItem = budgetCtrl.insertData(data.type, data.description, data.amount);
        
        //3. ADD ITEM TO UI (ItemList) (BOTTOM SECTION)
        UICtrl.insertValuesToList(newItem, data.type);
        
        //4. Clear Fields
        UICtrl.clearAll();
        
        //5. CALCULATE & update OVERALL BUDGET
        updateOverallBudget();
        
        }
    };
    
    
    
    return{
        init : function(){
            setEventListner();
            
          
        }
    }
})(UIController, budgetController);

controller.init();