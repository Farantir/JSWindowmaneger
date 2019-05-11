/*********************************/
/*Initialisation an debug segment*/
/*********************************/
$("loading_icon").style.display = "none";
style = new default_style();
window_to_drag = null;

create_taskbar();
create_desktop();

k = new _window("Window with a very long title");
k.display();


k = new _window("short titel");
k.display();
