function create_taskbar()
{
	/*initialisation information*/
	var taskbar = new _window("",true,0,0,30,0);
	taskbar.canresize = false;
  taskbar.always_on_top = true;
  taskbar.visible_in_taskbar = false;

	taskbar.display();
	taskbar.container.classList.add("window_taskbar");
	taskbar.container.style.width = "100%";
 	taskbar.container.style.top = "100%";

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
    }
  }
  taskbar.container.window_focus = function(target)
  {
  	this.open_windows.childNodes.forEach((x)=>{
  		if(x.target == target) x.classList.add("aktive");
  		else x.classList.remove("aktive");
		});
  }
  notify_window_creation.push(taskbar.container);
	notify_window_focus.push(taskbar.container);
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
