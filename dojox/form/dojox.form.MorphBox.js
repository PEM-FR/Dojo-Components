dojo.provide("dojox.form.MorphBox");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Textarea");

dojo.declare(
	"dojox.form.MorphBox",
	dijit._Contained,
	{
		// morphValidationTest : function
		//		prends en paramètre une fonction utilisée pour effectuer un test
		//		particulier non géré, ou difficile à gérer en regExp.
		//		En général il faut lui préférer regExp ou regExpGen.
		morphValidationTest : null,

		validate: function(/*Boolean*/ isFocused){
			// summary:
			//		Called by oninit, onblur, and onkeypress.
			// description:
			//		Show missing or invalid messages if appropriate, and highlight textbox field.
			// tags:
			//		protected
			var message = "";
			var isValid = this.disabled || this.isValid(isFocused);

			// here we add the morphValidationTest
			if(null != this.morphValidationTest){
				// il faut tester si la propriété est une fonction ou pas
				if(dojo.isFunction(this.morphValidationTest)){
					isValid = (this.morphValidationTest(this.textbox.value) && isValid);
				}
			}
			if(isValid){ this._maskValidSubsetError = true; }
			var isEmpty = this._isEmpty(this.textbox.value);
			var isValidSubset = !isValid && !isEmpty && isFocused && this._isValidSubset();
			this.state = ((isValid || ((!this._hasBeenBlurred || isFocused) && isEmpty) || isValidSubset) && this._maskValidSubsetError) ? "" : "Error";
			if(this.state == "Error"){ this._maskValidSubsetError = isFocused; } // we want the error to show up afer a blur and refocus
			this._setStateClass();
			dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
			if(isFocused){
				if(this.state == "Error"){
					message = this.getErrorMessage(true);
				}else{
					message = this.getPromptMessage(true); // show the prompt whever there's no error
				}
				this._maskValidSubsetError = true; // since we're focused, always mask warnings
			}
			this.displayMessage(message);
			return isValid;
		},

		setStateClass : function(/*string*/state){
			this._state = state;
			this._setStateClass();
		}
	}
);

dojo.declare(
	"dojox.form.MorphTextBox",
	[dijit.form.ValidationTextBox, dojox.form.MorphBox],
	{}
);

dojo.declare(
	"dojox.form.MorphTextareaBox",
	[dojox.form.MorphTextBox, dijit.form.Textarea],
	{
		validator: function(/*anything*/value, /*dijit.form.ValidationTextBox.__Constraints*/constraints){
			// summary:
			//		Overridable function used to validate the text input against the regular expression.
			//		Modified to accept \n and g line returns
			// tags:
			//		protected
			value = value.replace(new RegExp( "\\n", "g" ), " ");
			return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(value) &&
				(!this.required || !this._isEmpty(value)) &&
				(this._isEmpty(value) || this.parse(value, constraints) !== undefined); // Boolean
		}

	}
);