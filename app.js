
//BUDGET CONTOLLER
var budgetController=(function(){
	
    var Expences=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;		
	};
	
	  var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;		
	};
   
   var calculateTotal=function(type){
	   var sum=0;
	   data.allItems[type].forEach(function(c,i,a){
	   sum =sum+c.value;
	   data.totals[type] =sum;
	   });
	   
   };
   
   
   
   var data={
	   allItems:{
		   exp:[],
		   inc:[]
	   },
	   
	   totals:{
		exp:0,
        inc:0		
	   },
	   budget:0,
	   
	   percentage:-1
   };
   
   
   
   
	
	return{
	
     addItem : function(type,des,val){
		 
		 var newItem,ID;
		 
		 
		 
		 
	      if(data.allItems[type].length>0){
		    ID=data.allItems[type][data.allItems[type].length-1].id + 1;	  
		  } else{
			  ID=0;
		  }	   
		 
		 
		 if(type === 'exp'){
			 
		 newItem= new Expences(ID,des,val)
		 
		 }else if(type === 'inc'){
			 
			 newItem= new Income(ID,des,val)
		
		}
		
		data.allItems[type].push(newItem);
		
		
	   return newItem;	
	 },

	 
		
		
		
	calculateBudget:function(){
		calculateTotal('exp');
		
		calculateTotal('inc');
		
		data.budget = data.totals.inc - data.totals.exp;
		
		
		if(data.totals.inc>0){
		  data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
		}else{
			data.percentage=-1;
		}
		
		
		
	},
	
	getBudget:function(){
	
     return {
			budget:data.budget,
			totalInc:data.totals.inc,
			totalExp:data.totals.exp,
			totalPer:data.percentage
			
			
		};
		
	},
	
	
	testing: function(){
		console.log(data);
	}
		
	
	}
	
	
	
})();



//UI CONTOLLER
var UIController=(function(){
 
   var DOMstrings={
	   inputType:'.add__type',
	   inputValue:'.add__value',
	   inputDescription:'.add__description',
	   enterBtn:'.add__btn',
	   expensesContainer:'.expenses__list',
	   incomeContainer:'.income__list',
	   bugetValue:'.budget__value',
	   budgetIncomeValue:'.budget__income--value',
	   budgetExpValue:'.budget__expenses--value',
	   budgetPerValue:'.budget__expenses--percentage'
   }  

  return{
	  getInput:function(){
		  
		  return{
			 type: document.querySelector(DOMstrings.inputType).value,
			  value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
			 description: document.querySelector(DOMstrings.inputDescription).value
		  }	  
	  },
	  
	  appListItem:function(obj,type){
          var html,newHtml,element     
       		  
           
         if(type === 'inc'){
			 
           element=DOMstrings.incomeContainer;
		   
          html ='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">+%value%</div> <div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>'
		 }else if(type === 'exp'){		   
		   
		  element=DOMstrings.expensesContainer;
	   
		   html ='<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div><div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
		 }
		   
		  newHtml=html.replace('%id%',obj.id);
          newHtml=newHtml.replace('%description%',obj.description);
          newHtml=newHtml.replace('%value%',obj.value);  		  
		   		
				
		 document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);		
				
				
	  },	  

	  clearFields:function(){
		var fields,fieldArr
     
	     fields = document.querySelectorAll(DOMstrings.inputDescription + ' , ' + DOMstrings.inputValue);

         fieldArr = Array.prototype.slice.call(fields);

        fieldArr.forEach( function(c,i,a){
			c.value="";
			
			fieldArr[0].focus();
		});		 
				
	  },
	  
	  addUI:function(budgety){
		document.querySelector(DOMstrings.bugetValue).innerHTML= budgety.budget;	
		document.querySelector(DOMstrings.budgetIncomeValue).innerHTML=budgety.totalInc;
		document.querySelector(DOMstrings.budgetPerValue).innerHTML=budgety.totalPer;
		document.querySelector(DOMstrings.budgetExpValue).innerHTML= - budgety.totalExp;

				
	  },
	  
	  getDomStrings:function(){
		  return DOMstrings;
	  }
	  
  }
  

})();



//APP CONTOLLER
var appController=(function(budgetyCtrl,UICtrl){
    
	
	
	
	var setEventListeners=function(){
		
		var DOM=UICtrl.getDomStrings();
		
		document.querySelector(DOM.enterBtn).addEventListener('click',ctrlAddItem);	
   
    document.addEventListener('keypress',function(e){
	  if(e.keyCode === 13 || e.which === 13){
		  ctrlAddItem();
	  }
	  
      });
		
	};
	
	
	var updateBudget=function(){
		
		budgetyCtrl.calculateBudget();
		
    	var budget = budgetyCtrl.getBudget();
	
    	console.log(budget);
		UICtrl.addUI(budget);
		
	}
				

	
	var ctrlAddItem=function(){
           
        var input,newItem		   

		
		input = UICtrl.getInput();
		
		if( input.description !== "" && !isNaN(input.value) && input.value > 0 ){
		
		newItem = budgetyCtrl.addItem(input.type,input.description,input.value);
		
		UICtrl.appListItem(newItem,input.type);
		
		UICtrl.clearFields();
		
		updateBudget();
		
		
		
		}
		
		
		
		}
		
		
	
	
	return{
		init:function(){
			console.log("Appliocation has started");
			setEventListeners();
		}
		
	}
	
	
   
   
     
})(budgetController,UIController);


appController.init();

