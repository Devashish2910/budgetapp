// Function for Calculations
var calculationController = (function() {
    
    // Function constructors for Income and Expense
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    // Prototype for the calculation of the individual percentage in expense list
    Expense.prototype.calculatePercentagesInExpenseList = function(totalIncome) {
      if ( totalIncome > 0) {
          this.percentage = Math.round((this.value / totalIncome) * 100);
          
      }  else {
          this.percentage = -1;
      };
        //console.log(this.percentage)
        return this.percentage;
    };
  
    // Data structure for adding details of user entry
    var data = {
        allData: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        percentage: -1
    };
    
    // Fuction for adding New User Entry details to data structure
    var addEntryToDataStructure = function(type, description, value) {
        var ID, newEntry;
        
        // Generate Id
        if ( data.allData[type].length > 0) {
            ID = data.allData[type][data.allData[type].length - 1].id + 1;
        }
        else {
            ID = 0;
        };
        
        // Create object
        if ( type === 'inc') {
            newEntry = new Income(ID, description, value);
        } else {
            newEntry = new Expense(ID, description, value);
        };
        
        // Add to data structure
        //console.log(newEntry);
        data.allData[type].push(newEntry);
        
        return newEntry;
        
    };
    
    var calculateBudget = function() {
      var totalIncome = 0,
          totalExpense = 0, 
          percentage = -1, 
          remainingTotal = 0;  
        
        // Count Total for income and expense
        data.allData.inc.forEach(function(cur) {
            totalIncome += cur.value;
        });
        //console.log(totalIncome);
        
        data.allData.exp.forEach(function(cur) {
            totalExpense += cur.value;
        });
        
        // Add totals to data Structure
        data.totals.inc = totalIncome;
        data.totals.exp = totalExpense;
        
        // Calculate remaing amount
        remainingTotal = totalIncome - totalExpense;
        
        // Calculate expense percentages
         if ( totalIncome > 0) {
            percentage = Math.round(( totalExpense / totalIncome ) * 100);
        } else {
            percentage = -1;
        }
        
        
        return {
            income: totalIncome,
            expense: totalExpense,
            percentage: percentage,
            remain: remainingTotal
        }
        
    };
    
    return {
        // Function for calling add new entry private function
        addNewEntryToDS: function(obj) {
            var newEntry = addEntryToDataStructure(obj.type, obj.description, obj.value);
            return newEntry;
        },
        
        // Function for getting data structure
        getDataStructure: function() {
            return data;
        },
        
        // Function for calling Budget Calculation
        calcBudget: function() {
            var result = calculateBudget();
            return result;
        },
        
        deleteEntryFromDataStructure: function(entryId, entryType) {
            var i = 0,
                arr = [];
            
            arr = data.allData[entryType];
            
            for( i = 0; i < arr.length; i++) {
                if ( arr[i].id === entryId ) {
                    arr.splice(i, 1)
                }
            };
        },
        
        percentageInExpenceList: function() {
            let totalIncome = 0;
            
            totalIncome = data.totals.inc;
            
            let percentageOfAllEntries = data.allData.exp.map(function(cur) {
               return cur.calculatePercentagesInExpenseList(totalIncome);
                
            });
           
            return percentageOfAllEntries;
        }
    }
    
})();

// Function for UI Controlling
var userInterfaceController = (function() {
    
    // Ids of the nodes on HTML Page
    var htmlIds = {
        addBtn: '.add__btn',
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        totalIncome: '.budget__income--value',
        totalExpense: '.budget__expenses--value',
        totalRemain: '.budget__value',
        totalPercent: '.budget__expenses--percentage',
        deleteContainer: '.container',
        expenceListpercentage: '.item__percentage',
        dateTime: '.budget__title--month'
    }
    
    // Function for getting new entry details from the HTML page
    var newEntryDetails = function() {
        return {
            type: document.querySelector(htmlIds.type).value,
            description: document.querySelector(htmlIds.description).value,
            value: parseFloat(document.querySelector(htmlIds.value).value)
        }
    };
    
    // Function for adding new entry in UI
    var addNewEntryToUserInterface = function(type, obj) {
        var html, newHtml, whereToAdd;
        
        // Make a string from Html nodes and put place holders
        if ( type === 'inc') {
            whereToAdd = htmlIds.incomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
        } else if ( type === 'exp') {
            whereToAdd = htmlIds.expenseList;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
        }
        
        // Replace place holders
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', descriptionFormat(obj.description));
        if ( type == 'inc') {
            newHtml = newHtml.replace('%value%', numberFormat(obj.value,'inc'));
        } else if ( type == 'exp') {
            newHtml = newHtml.replace('%value%', numberFormat(obj.value,'exp'));
        }
        
        
        // Add entry to UI
        document.querySelector(whereToAdd).insertAdjacentHTML('beforeend', newHtml);
    };
    
    // Number Formattiong
    var numberFormat = function(num, type) {
        var sign;
            
            // Fix the decimal point
            num = num.toFixed(2);
            
            // Split into parts
            num = num.split('.');
            
            // Add comma in the first part
            if(num[0].length < 7 && num[0].length > 3 ) {
                var index = num[0].length - 3;
                num[0] = num[0].slice(0, index) + ',' + num[0].slice(index);
            } else if ( num[0].length > 6 && num[0].length < 10 ) {
                var index1 = num[0].length - 6;
                var index2 = num[0].length - 3;
                num[0] = num[0].slice(0, index1) + ',' + num[0].slice(index1, index2) + ',' + num[0].slice(index2);
            }
            
            // Add +/-
            if (type === 'inc') {
                sign = '+ ';
                
            } else if (type === 'exp') {
                sign = '- ';
            }
            
            // Mix every thing and return the number
            return sign + num[0] + '.' + num[1];
    };
    
    // Description formatting
    var descriptionFormat = function(str) {
        
        let splitedSting, newString = '';
        splitedSting = str.split(' ');
        
        for ( let i = 0; i < splitedSting.length; i++) {
           // console.log(splitedSting[i].charAt[0]);
                splitedSting[i] = splitedSting[i].charAt(0).toUpperCase() + splitedSting[i].slice(1);
                newString = newString + ' ' + splitedSting[i];
        }
        return newString;
        
    };
    
    // Object for creating global methods
    return {
        
        // Function for returning htmlIds
        getIds: function() {
            return htmlIds;
        },
        
        //Function for calling newEntryDetails function
        newEntryDetail : function() {
            var objToBeReturned = newEntryDetails();
            return objToBeReturned;
        },
        
        //Function for calling private method to add new entry in UI
        addNewEntryToUI: function(type, obj) {
            addNewEntryToUserInterface(type, obj);            
        },
        
        // Clear All method
        clearAll: function() {
           // document.querySelector(htmlIds.type).value = 'inc';
            document.querySelector(htmlIds.description).value = '';
            document.querySelector(htmlIds.value).value = '';
            
            // Clear values then focus on the description
            document.querySelector(htmlIds.type).focus();
        },
        
        // Display overall budget
        displayOverallBudget: function(obj) {
            // console.log(obj.income);
            document.querySelector(htmlIds.totalIncome).innerHTML = numberFormat(obj.income, 'inc');
            document.querySelector(htmlIds.totalExpense).innerHTML = numberFormat(obj.expense, 'exp');
            
            if (obj.remain >= 0) {
                document.querySelector(htmlIds.totalRemain).innerHTML = numberFormat(obj.remain, 'inc');
            } else if (obj.remain < 0) {
                let rmn = obj.remain;
                document.querySelector(htmlIds.totalRemain).innerHTML = numberFormat(Math.abs(rmn), 'exp');
            }
            
            if (obj.percentage > 0) {
                document.querySelector(htmlIds.totalPercent).innerHTML = obj.percentage + '%';
            } else {
                document.querySelector(htmlIds.totalPercent).innerHTML = '---';
            }
        },
        
        // Delete entry from UI
        daleteEntryFromUI: function(entry) {
            var child;
            
            child = document.getElementById(entry);
            child.parentNode.removeChild(child);
        },
        
        // Show percentage in expense list
        displayPercentageOfExpenseList: function(caluclatedPercentage) {
            let nodeList;
            
            nodeList = document.querySelectorAll(htmlIds.expenceListpercentage);
            
            nodeList.forEach(function(cur, i) {
                //console.log(caluclatedPercentage[i]);
                if(caluclatedPercentage[i] > 0) {
                    cur.innerHTML = caluclatedPercentage[i] + '%';
                } else {
                    cur.innerHTML = '---';
                }
                
            });
        },
        
        // Display date,month,year
        displayDateTime: function(date, month, year) {
            
            let Month = [];
            Month = ['January',
                     'February',
                     'March',
                     'April',
                     'May',
                     'June',
                     'July',
                     'August',
                     'September',
                     'October',
                     'November',
                     'December']; 
            
            document.querySelector(htmlIds.dateTime).innerHTML = Month[month] + " " + date + ", " + year;
            console.log(document.querySelector(htmlIds.dateTime).innerHTML);
            
            
        }
        
   }
    
})();

// Function for Application Controlling
var appController = (function(calcCtrl, UICtrl) {
    
    // Function for Eventlistners
    var eventListners = function() {
        var DOM;
        DOM = UICtrl.getIds();
        
        // On click of add button
       document.querySelector(DOM.addBtn).addEventListener('click', addNewEntry);
        
        // On click of enter button
        document.addEventListener('keypress', function(e) {
           if (e.keyCode === 13 || e.which === 13) {
               //console.log("Enter");
               e.preventDefault(); // To prevent duplicate entries
               addNewEntry();  
           } else if (e.keyCode === 45 || e.which === 45) {
               document.querySelector(DOM.type).focus();
               document.querySelector(DOM.type).value = 'exp';
               
           } else if (e.keyCode === 43 || e.which === 43) {
               document.querySelector(DOM.type).focus();
               document.querySelector(DOM.type).value = 'inc';
               
           }
        });
        
        // For deleting entry
        document.querySelector(DOM.deleteContainer).addEventListener('click', deleteEntry)
    };
    
    // Function for calculating Budget
    var calculateBudget = function() {
        
        // Calculate Totals & Percentage
        var res = calcCtrl.calcBudget();
        
        
        // Display to UI
        UICtrl.displayOverallBudget(res);
        
        // Calculate the percentage of individual expense entry
            // Calulations
            let percentageList = calcCtrl.percentageInExpenceList();
        
            // Show it in UI
            UICtrl.displayPercentageOfExpenseList(percentageList);
    };
    
    // Function for adding New Entry
    var addNewEntry = function() {
        
        // Get type, value and description from the page
            var userEntryDetails = UICtrl.newEntryDetail(); //type, description, value
            UICtrl.clearAll();
            //console.log(userEntryDetails);
      
        // Add new entry to data structure
        if ( userEntryDetails.description !== '' && userEntryDetails.value > 0)
           var entryDetailsFromDS = calcCtrl.addNewEntryToDS(userEntryDetails); // Id, description, value
            //console.log(entryDetailsFromDS);
        
        // Add new entry to UI
           UICtrl.addNewEntryToUI(userEntryDetails.type, entryDetailsFromDS);
        
        // Update budget
           calculateBudget();
    };
    
    // Function for deleting entry
    var deleteEntry = function(event) {
        var targetEntryId, splitedEntry, entryId, entryType;
       
        // Get id of the entry which is to be deleted
            targetEntryId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
            if(targetEntryId) {
                splitedEntry = targetEntryId.split('-');
                entryType = splitedEntry[0];
                entryId = parseInt(splitedEntry[1]);
            }
        
        // Delete entry from data structure
        calcCtrl.deleteEntryFromDataStructure(entryId, entryType);
        
        // Delete entry from UI
        UICtrl.daleteEntryFromUI(targetEntryId);
        
        // Update the overall budget
        calculateBudget();
        
    };
    
    // Function for date and time
    var dateTime = function() {
        let d,date, month, year;
        
        d = new Date();
        
        date = d.getDate();
        month = d.getMonth();
        year = d.getFullYear();
        
        UICtrl.displayDateTime(date, month, year);
        
        
    };
    
    return {
        init: function() {
            console.log("Application has been started..");
            eventListners();
            dateTime();
           
        }
    }
    
    
    
})(calculationController, userInterfaceController);

appController.init();