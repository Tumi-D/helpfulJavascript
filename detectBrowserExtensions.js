
var x=navigator.plugins.length; // store the total no of plugin stored 
var txt="Total plugin installed: "+x+"<br/>";
txt+="Available plugins are->"+"<br/>";
for(var i=0;i<x;i++)
{
  txt+=navigator.plugins[i].name + "<br/>"; 
}
document.getElementById("example").innerHTML=txt;
