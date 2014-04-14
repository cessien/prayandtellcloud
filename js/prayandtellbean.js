var mainBean;
$(window).load(function(){
  //Start with the input box
  mainBean = new PrayerRequestBean($(".prayer-prompt:first"));
});


function PrayerRequestBean(elem){
	var _this = this;
	
	if(elem){
		this.contextElem = elem.get(0);
		this.addToBank($(elem).find(".input").get(0));
		$(elem).find("input").autoGrowInput({comfortZone: _this.zoning, minWidth: 0, maxWidth: 2000});
		
		//forward clicks to the correct input box
		$(elem).click(function(event){
			event.preventDefault();
			if(_this.bank.length == 1) {
				$(_this.bank[_this.bank.length - 1]).find("input").focus();
			}
		});
		
		//attach the autocomplete
		$(elem).children().last().after(this.autocomplete);
		this.autocomplete.hide();
	}
};
PrayerRequestBean.prototype.contextElem;
PrayerRequestBean.prototype.bank = new Array();
PrayerRequestBean.prototype.text = "";
PrayerRequestBean.prototype.categoryCache = new Array();
PrayerRequestBean.prototype.location = "";
PrayerRequestBean.prototype.zoning = 50;
PrayerRequestBean.prototype.wordPointer = 0;
PrayerRequestBean.prototype.wordCount = 0;
PrayerRequestBean.prototype.manualCategories  = new Array();
PrayerRequestBean.prototype.autocomplete = $("<div class='autocomplete'><ul></ul></div>");
PrayerRequestBean.prototype.ac_active = function(){return !this.autocomplete.is(":hidden");};


PrayerRequestBean.prototype.addToBank = function addToBank(elem){
	var _this = this;
	this.bank.push(elem);
	$(elem).on("keypress keydown",function(event){_this.handleKeypress(this,event);});
}

PrayerRequestBean.prototype.handleKeypress = function handleKeypress(elem,event) {
	var _this = this;
	var index = this.bank.indexOf(elem);
	var cursorPos = $(event.target).caret();
	var text = $(event.target).val();
	var length = text.length;
	var charKey = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	if(event.type == "keypress") {
		switch(event.which){
			case 35: //# key
				if(text == "#" || text == "##" || text =="" || text == " ") { //you haven't written anything yet
					if($(elem).hasClass("hashtag")){
						$(event.target).val("");
					} else {
						this.unregisterInput(index);
						this.createInput("hashtag",index - 1).find("input:first").val("").caret(-1);
					}					
				} else if(cursorPos >= (length - 1)) { //you are at the end of the textbox
					this.createInput("hashtag",index).find("input:first").caret(-1);
					setTimeout(function(){
						event.target.value = text.substring(text.indexOf("#"));
					},10);
					
				} else if(cursorPos < (length - 1)) { //you are in the middle of the text
					if($(elem).hasClass("hashtag")){
					} else {
					}
				}
				
				break;
			case 32: //spacebar
				if(text == "#" || text == "# " || text =="" || text == " ") { //you haven't written anything yet
					if($(elem).hasClass("hashtag") && index != 0){
						//unregister the input, and create a new normal input
						this.unregisterInput(index);
						this.createInput("normal",index - 1).find("input:first").caret(-1);
					}
				} else if(cursorPos >= (length - 1)) { //you are at the end of the textbox
					if($(elem).hasClass("hashtag")){
						//create an input and set focus
						this.createInput("normal",index).find("input:first").caret(-1);
					}
				} else if(cursorPos < (length - 1)) { //you are in the middle of the text
					if($(elem).hasClass("hashtag")){
						//create an input, with the text to the right of the caret and set focus to the beginning of the new box
						this.createInput("normal",index, text.substring(cursorPos,length)).find("input:first").caret(-1);
						//remove the text to the right of the cursor
						setTimeout(function(){
							event.target.value = text.substring(0,cursorPos);
						},10);
					}
				}
				
				this.wordPointer++;
				this.wordCount++;
				
				if(this.wordCount >= 1) this.submit("update");
				break;
			default:
				if($(elem).hasClass("hashtag") && charKey.indexOf(String.fromCharCode(event.which))===-1){ //if you are in a hashtagbox and you press a non char key, then break it
					this.createInput("normal",index).find("input:first").caret(-1);
					var _this = this;
					setTimeout(function(){
						var copy = $(event.target).val();
						$(_this.bank[index+1]).find("input").val(copy.substring((copy.length - 1),copy.length)); 
						$(event.target).val(copy.substring(0,copy.length - 1));
					},10);
				} else if($(elem).hasClass("hashtag") && !(charKey.indexOf(String.fromCharCode(event.which))===-1)){
					// run the autocomplete
					this.submit("autocomplete",this.bank[index]);
				}
		}
	} else if(event.type == "keydown") {
		this.update(index);
		switch(event.which){
			case 8: //backspace
				if(index != 0 && $(event.target).val().length <= 1) {
					this.unregisterInput(index);
					$(this.bank[index-1]).find("input").caret(-1);
				} else if($(elem).hasClass("hashtag")){
					// run the autocomplete
					this.submit("autocomplete",this.bank[index]);
				}			
				break;
			case 37: //left arrow key
				if(index != 0 && $(event.target).caret() <= 1) {
					$(this.bank[index-1]).find("input").caret(-1);
				}
				break;
			case 39: //right arrow key
				if(index != (this.bank.length - 1) && $(event.target).caret() >= ($(event.target).val().length - 2)) {
					$(this.bank[index+1]).find("input").caret(0);
				}
				break;
		}
		
		//word wrapping to break up the input box around boundaries 
		if(!$(elem).hasClass("hashtag") && $(this.contextElem).width()-80 < $(elem).position().left + $(elem).width()){
			var splitIndex = text.substring(0,cursorPos).lastIndexOf(" ");
			$(event.target).val(text.substring(0,splitIndex+1));
			this.createInput("normal",index,text.substring(splitIndex+ 1,length)).find("input").caret(cursorPos - splitIndex);
			this.update();
		}
	}

	this.updateText();
}

PrayerRequestBean.prototype.registerInput = function registerInput(elem, index) {
	var _this = this;
	
	//Add is to the bank array
	if (!index) {
		this.bank.push($(elem).get(0));
	} else {
		this.bank.splice(index,0,$(elem).get(0));
	}
	
	//register keypresses to the handler
	$(elem).on("keypress keydown",function(event){_this.handleKeypress(this,event);});
	
	//enable autogrow
	$(elem).find("input").autoGrowInput({comfortZone: _this.zoning, minWidth: 0});
}

PrayerRequestBean.prototype.unregisterInput = function registerInput(index) {
	//remove this
	var toberemoved = $(this.bank[index]);
	this.bank.splice(index,1);
	
	
	toberemoved.remove();
	delete toberemoved;
}

PrayerRequestBean.prototype.updateText = function updateText(){
	this.text = $(this.contextElem).find("div.input-container").text().replace(/\s+/g, ' ').replace(/#+/g, ' #').replace(/# +#/g, ' #').trim();
	//console.log(this.bank.length+", "+this.text);
}

PrayerRequestBean.prototype.createInput = function createInput(type, index, text){
	var elem;
	if (type == "hashtag"){
		elem = $("<div class='input hashtag'><input type='text' value='#' style='width:10px;'></div>");
	} else if (type == "normal") {
		elem = $("<div class='input'><input type='text' value='"+((text==undefined)?"":text)+"' style='width:10px;'></div>");
	}
	
	$(this.bank[index]).after(elem);
	this.registerInput(elem,index+1);
	
	this.update();
	
	this.submit("destroy");//temrinate the autocomplete is any
	
	return $(elem);
}

PrayerRequestBean.prototype.update = function(index){
	if(index){
		$(this.bank[index]).find("input").trigger("update");
	} else {
		for(var i = 0; i < this.bank.length; i++){
			$(this.bank[i]).find("input").trigger("update");
		}	
	}
}
/* This function submits an AJAX request on every set of words. It also creates an auto complete
 * for when you are typing in a hashtag
 */
PrayerRequestBean.prototype.submit = function submit(action, elem){
	_this = this;
	if(action =="autocomplete" && $(elem).hasClass("hashtag")) {
		//align the autocomplete
		this.autocomplete.attr("style","left:"+$(elem).position().left+"px; top:"+($(elem).position().top+$(elem).height())+"px;");
		//take the word and request an autocomplete
		setTimeout(function(){
			var text = $(elem).find("input").val().substring(1).toLowerCase();
			$.ajax({
				type:"POST",
				url:"autocomplete.php",
				data:{"text":text},
				success:function(data){
					//console.log(text);
					//console.log(data);
					//console.log($.parseJSON(data));
					data = $.parseJSON(data);
					_this.autocomplete.find("ul li").remove();
					_this.autocomplete.show();
					var ac_list = _this.autocomplete.find("ul");
					for(var index in data.matches) {
						var keyword = data.matches[index].keyword;
						if(keyword)ac_list.append("<li><span>#</span>"+keyword.split(text)[0]+"<span>"+text+"</span>"+keyword.split(text)[1]+"</li>");
					}
				},
				dataType:"json"
			});
		},10);
		
	} else if (action == "update"){
		//update the categories with the text
		$.ajax({
			type:"POST",
			url:"getCategories.php",
			data:{"text":_this.text},
			success:function(data){
				//debugger;
				console.log(_this.text);
				console.log($.parseJSON(data).results);
				_this.setCategories($.parseJSON(data));
			},
			dataType:"json"
		});

		this.wordPointer = 0; //reset the pointer to zero on submission
		this.wordCount = 0; //reset the relative word count to zero
	} else if (action == "destroy") {
		//take out all the autocomplete list items and toggle its state to off
		_this.autocomplete.find("ul li").remove();
		_this.autocomplete.hide();
		
	}
}

PrayerRequestBean.prototype.setCategories = function(data){
	$(this.contextElem).find(".categories .category").each(function(){
		$(this).remove();//.slideUp();
	
	});	
	
	for(var item in data.results){
		if(data.results[item].category != "") $(this.contextElem).find(".categories").append('<div class="category"><img src="images/close-icon.png" width=15/><span class="hashtag">#</span><span>'+data.results[item].category+'</span><div style="border: 1px solid red; color: red;">'+data.results[item].word+'<br>'+data.results[item].match+'<br>'+data.results[item].rating+'</div></div>');
	}
}




