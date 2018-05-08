/*********************************/
/*Initialisation an debug segment*/
/*********************************/
$("loading_icon").style.display = "none";
style = new default_style();
window_to_drag = null;

create_taskbar();
create_desktop();

k = new _window("Ein Fenster mit einem sehr langen titel");
k.display();


k = new _window("kurtzer titel");
k.display();
