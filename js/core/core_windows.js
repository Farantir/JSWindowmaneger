function create_taskbar()
{
	/*initialisation information*/
	var taskbar = new _window("",true,0,0,25,0);
	taskbar.canresize = false;
  taskbar.always_on_top = true;
  taskbar.visible_in_taskbar = false;

	taskbar.display();
	taskbar.container.removeEventListener("mousedown",window_click,true);
	taskbar.container.classList.add("window_taskbar");
	taskbar.container.style.width = "100%";
 	taskbar.container.style.top = "100%";

  /*creating the startmenu area and button*/
  var start_menue = document.createElement("div");
  start_menue.classList.add("taskbar_area_start_menue");
  taskbar.content.appendChild(start_menue);
  taskbar.container.start_menue = start_menue;
	var start_button = document.createElement("img");
	start_menue.classList.add("taskbar_menue_button");
	//button.classList.add("window_button");
	//start_menue.addEventListener("mousedown",minimize_button_click);
	start_button.src = style.menu_button;
  taskbar.container.start_menue.appendChild(start_button);

  /*function for the startmenu menu div*/
  taskbar.taskmenue = new taskmenue();
  start_button.taskmenue = taskbar.taskmenue;
  start_button.onclick = function(){this.taskmenue.toggle();};

  /*creating the aktive window controling fujctionalit of the taskbar*/
  var open_windows = document.createElement("div");
  open_windows.classList.add("taskbar_area_open_windows");
  taskbar.content.appendChild(open_windows);
  taskbar.container.open_windows = open_windows;
  
  taskbar.container.window_created = function(target)
  {
    if(target.window.visible_in_taskbar == true)
    {
        var target_window = document.createElement("pre");
        target_window.classList.add("taskbar_area_open_windows_open_window");
        var string = target.window.title.substring(0, 15);
        if(string.length < target.window.title.length) string += " ...";
        while(0<(19-string.length))  string += " ";
        target_window.appendChild(document.createTextNode(string))
        open_windows.appendChild(target_window);
        target_window.target = target;
        target_window.addEventListener("mousedown",taskbar_on_window_click);
    }
  }
  taskbar.container.window_focus = function(target)
  {
  	this.open_windows.childNodes.forEach((x)=>{
  		if(x.target == target) x.classList.add("aktive");
  		else x.classList.remove("aktive");
		});
  }
  taskbar.container.window_toggle_minimized = function(target)
  {
  	this.open_windows.childNodes.forEach((x)=>{
  		if(x.target == target)
  		{ 
  			if(target.is_minimized) 
  			{
  				x.classList.add("minimized");
  				x.classList.remove("aktive");
				}
  			else 
  			{
  				x.classList.remove("minimized");
				}
  		}
		});
  }
  taskbar.container.window_closed = function(target)
  {
  	this.open_windows.childNodes.forEach((x)=>{
  		if(x.target == target)
  		{ 
  			x.parentNode.removeChild(x);
  		}
		});
  }
  observer.subscribe("window_created", taskbar.container);
	observer.subscribe("window_focus",taskbar.container);
	observer.subscribe("window_toggle_minimized", taskbar.container);
	observer.subscribe("window_closed", taskbar.container);
	
	border_margin.bottom += 25;

    /*code for creating the start menue*/
    //todo
}

/*will be called, if window icon in taskbar is clicked*/
function taskbar_on_window_click(e)
{
	if(this.classList.contains("aktive"))
	{
		toggle_min(this.target);
	}else if(this.classList.contains("minimized"))
	{
		toggle_min(this.target);
	}
	set_window_on_top(this.target);
}

/*taskmenue div. excludet from taskbar for easy customizebility*/
function taskmenue()
{
  /*creating the wrapper div vor the starmenu*/   
  var start_menue = document.createElement("div");
  start_menue.classList.add("start_menue"); 
  this.start_menue = start_menue;

  this.toggle = function()
  {
    console.log("bla");
  }
}

function create_desktop()
{
	/*initialisation information*/
	var desktop = new _window("",true,0,0,0,0);
	desktop.canresize = false;
  desktop.visible_in_taskbar = false;  
	desktop.display();
	desktop.container.classList.add("window_desktop");
	desktop.container.style.width = "100%";
 	desktop.container.style.height = "100%";
  desktop.container.removeEventListener("mousedown",window_click,true);
  set_window_on_bottom(desktop.container);
}
