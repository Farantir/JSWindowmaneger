/*******************************************/
/*functions for window creation and styling*/
/*******************************************/
/************************************************************************/
function $(x){return document.getElementById(x)}

/*Default style*/
function default_style()
{
	this.minimize_button = "icons/default_style/min-icon.svg";
	this.maximize_button = "icons/default_style/max-icon.svg";
	this.close_button = "icons/default_style/close-icon.svg";
  this.menu_button = "icons/default_style/menu-icon.svg";
}

/*funcion for creating a new window*/
function _window(title,borderless,x,y,height,width)
{
	this.height = height || 400;
	this.width = width || 600;
	
	if(x == null) x = window.innerWidth/2 - this.width/2;
	if(y == null) y = window.innerHeight/2 - this.height/2;
	
	if(x<0) x = 0;
	if(y<0) y = 0;
	
	this.title = title;
	this.x = x;
	this.y = y;
	this.content = document.createElement("div");
	this.borderless = borderless;
	this.buttons =  [close_button(),maximize_button(),minimize_button()];
	this.canresize = true;
  this.always_on_top = false
  this.visible_in_taskbar = true;
	this.display = function()
	{
		/*creating the window*/
		this.container = document.createElement("div");
		this.container.window = this;
		this.container.classList.add("window");
		this.container.can_above = function(target){return true;};
		if(this.always_on_top) this.container.can_above = function(target){return false;};
		if(!this.borderless)
		{
			this.container.classList.add("window_border");
			var titlebar = document.createElement("div");
			titlebar.window = this;
			titlebar.classList.add("window_title_bar");
			var tile_text= document.createElement("div");
			tile_text.appendChild(document.createTextNode(this.title));
			tile_text.classList.add("window_title_text");
			titlebar.appendChild(tile_text);
			tile_text.window = this;
			for(button of this.buttons) titlebar.appendChild(button);	
			this.container.appendChild(titlebar);		
			
			titlebar.addEventListener("mousedown",window_border_click);
		}
	
		$("window_container").prepend(this.container);
		
		this.container.style.top = this.y + "px";
		this.container.style.left = this.x + "px";
		this.container.style.height = this.height + "px";
		this.container.style.width = this.width + "px";
		this.container.is_minimized = false;
		
		this.container.addEventListener("mousedown",window_click,true);
    this.container.appendChild(this.content);

    /*tell other windows about your existence*/
    observer.notify("window_created",this.container);
    set_window_on_top(this.container);
  }
}

/*function to fire if window gets selected*/
function window_border_click(e)
{
    window_to_drag = this.window.container;
    window_to_drag.offsetx = e.pageX - window_to_drag.offsetLeft; 
    window_to_drag.offsety = e.pageY - window_to_drag.offsetTop;
    document.addEventListener('mousemove', move_window);

    e.stopPropagation();
}

function window_click(e)
{
	set_window_on_top(this);	
}

/*requred for moving widows around*/
document.onmouseup = function()
{
    document.removeEventListener('mousemove', move_window);
    window_to_drag = null;
}


/*functions to create the window buttons*/
/************************************************************************************/
function minimize_button()
{
	var button = document.createElement("img");
	button.classList.add("window_minimize_button");
	button.classList.add("window_button");
	button.addEventListener("mousedown",minimize_button_click);
	button.src = style.minimize_button;
	return button;
}

function minimize_button_click(e)
{
  toggle_min(this.parentNode.window.container)
	e.stopPropagation();
}

function maximize_button()
{
	var button = document.createElement("img");
	button.classList.add("window_maximize_button");
	button.classList.add("window_button");
	button.src = style.maximize_button;
	button.addEventListener("mousedown",maximize_button_click);
	return button;
}

function maximize_button_click(e)
{
	toggle_maximize(this.parentNode.window.container);
	e.stopPropagation();
}

function close_button()
{
	var button = document.createElement("img");
	button.classList.add("window_close_button");
	button.classList.add("window_button");
	button.src = style.close_button;
	button.addEventListener("mousedown",close_button_click);
	return button;
}

function close_button_click(e)
{
	var to_del = this.parentNode.window.container;
	observer.notify("window_closed",to_del);
	to_del.parentNode.removeChild(to_del);
	e.stopPropagation();
}

/***********************************************************/
/*functions for window behaviour control*/
/*****************************************************************/

/*toggles minimized state*/
function toggle_min(target)
{
  if(target.is_minimized == true)
  {
   target.style.display = "";
   target.is_minimized = false;
 	}else 
 	{
 		target.style.display = "none"
 		target.is_minimized = true;
	}
	observer.notify("window_toggle_minimized",target);
}

/*toggles fullscrenn mode*/
function toggle_maximize(target)
{
	if(target.is_maximized)
	{
		target.style.height = target.old_height + "px";
		target.style.width = target.old_width + "px";
		target.style.left = target.old_x + "px";
		target.style.top = target.old_y + "px";
		target.is_maximized = false;
	}else
	{
		target.old_height = target.offsetHeight;
		target.old_width = target.offsetWidth;
		target.old_x = target.offsetLeft;
		target.old_y = target.offsetTop;
	
		target.style.height = "100%";
		target.style.width = "100%";
		target.style.left = "0px";
		target.style.top = "0px";
		target.is_maximized = true;
	}
}

/*requred for moving widows around*/
document.onmouseup = function()
{
    document.removeEventListener('mousemove', move_window);
    window_to_drag = null;
}

function move_window(e) 
{
  x = e.clientX + document.documentElement.scrollLeft;
  y = e.clientY + document.documentElement.scrollTop;

  posy = (y - window_to_drag.offsety);
  posx = (x - window_to_drag.offsetx);
  
  /*Range checks ensure, that no window will "get lost" outside of its parent container*/
  if(posx<(border_margin.left-window_to_drag.offsetWidth))
  {
  	posx = border_margin.left - offsetWidth
	}else if(posx>window.innerWidth - border_margin.right)
	{
		posx=window.innerWidth-border_margin.right;
	}
	if(posy<(border_margin.top))
  {
  	posy = border_margin.top;
	}else if(posy>window.innerHeight - border_margin.bottom)
	{
		posy=window.innerHeight - border_margin.bottom;
	}

	/*applying th new Window position*/
  window_to_drag.style.left = posx + "px";
 	window_to_drag.style.top = posy + "px";
 	
 	/*quitting fullscreen on windowdrag*/
	if(window_to_drag.is_maximized)
	{
		toggle_maximize(window_to_drag);
	}
}

/*Handeling the "on top" functionality*/
/*(setting a selected oder created window on top)*/
function set_window_on_top(target)
{
	observer.notify("window_focus",target);
	var i = target.parentNode.childNodes.length-1;
	while(target.parentNode.childNodes[i])
	{
		if(target.parentNode.childNodes[i].nodeType == Node.ELEMENT_NODE)
		{	
			if(target.parentNode.childNodes[i] == target)
			{
				return;
			}
			if(target.parentNode.childNodes[i].can_above(target))
			{
				target.parentNode.insertBefore(target,target.parentNode.childNodes[i].nextSibling)
				return;
			}
		}
		i--;
	}
}

/*Handeling the "to bottom" functionality*/
/*(setting a window below all other windows)*/
function set_window_on_bottom(target)
{
  target.parentNode.prepend(target);
}

/**************************************************************************************************/
/*Functions for Inter Window communication*/
/******************************************/
/*artificail borders for windows*/
/*this way, windows cant be */
/*"lost" below e.g. the taskbar*/
border_margin = {};
border_margin.top=0;
border_margin.left=10;
border_margin.right=10;
border_margin.bottom=10;

/*Observer for window mutations*/
observer = {};
observer.listen = {};
observer.subscribe = function(observation_name, objekt_to_notify)
{
	if(!observer.listen[observation_name]) observer.listen[observation_name] = [];
	observer.listen[observation_name].push(objekt_to_notify);
}
observer.unsubscribe = function(observation_name, objekt_to_notify)
{
	if(!observer.listen[observation_name]) return;
	observer.listen[observation_name].splice(observer.listen[observation_name].indexOf(objekt_to_notify),1);
}

observer.notify = function(observation_name, evoker)
{
	if(!observer.listen[observation_name]) return;
	observer.listen[observation_name].forEach((x)=>{x[observation_name](evoker)});
}

/*Categorie manegement for Applicarions*/
/*All applications*/
applications = [];
categories = [];

/*single application*/
function appliction(id,name,categories)
{
	this.name = name;
	this.id = id;
	categories.foreach((x)=>{
		//if()
	});
}

