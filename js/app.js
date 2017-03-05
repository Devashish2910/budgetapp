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
    
    //Data structure for storing all activities
    var dataStructure = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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
        expensesList: ".expenses__list"
    };
    
    //Object for setting value global
    return {
        
       inputValues : function () {
        
        // values passed in an object
          return {
                type: document.querySelector(DOM.ddlType).value, // Will return inc or dec
                description: document.querySelector(DOM.txtDescription).value, //Will eturn description
                amount: document.querySelector(DOM.txtAmount).value //Will return amount
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
    
    // FUNCTION FOR ADD BUTTON CLICK EVENT/ENTER KEY PRESS
    function insertData() {
        var data,newItem;
        //1. GET INPUT DATA FROM UI
        data = UICtrl.inputValues();
      
        //2. ADD INPUT DATA TO BUDGET CONTROLLER DATA STRUCTURE
        newItem = budgetCtrl.insertData(data.type, data.description, data.amount);
        
        //3. ADD ITEM TO UI (ItemList) (BOTTOM SECTION)
        UICtrl.insertValuesToList(newItem, data.type);
        
        //4. Clear Fields
        UICtrl.clearAll();
        
        //5. CALCULATE OVERALL BUDGET
        
        //6. DISPLAY BUDGET IN UI (TOP SECTION)
    };
    
    
    
    return{
        init : function(){
            setEventListner();
          
        }
    }
})(UIController, budgetController);

controller.init();