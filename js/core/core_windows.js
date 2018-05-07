function create_taskbar()
{
	/*initialisation information*/
	var taskbar = new _window("",true,0,0,20,0);
	taskbar.canresize = false;
	/*l*/
	taskbar.display();
	taskbar.container.classList.add("window_taskbar");
	taskbar.container.style.width = "100%";
 	taskbar.container.style.top = "100%";
}
