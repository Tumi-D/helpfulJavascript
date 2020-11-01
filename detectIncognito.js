function ifIncognito(incog,func){
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs)  console.log("checking incognito failed");
    else {
        if(incog) fs(window.TEMPORARY, 100, ()=>{}, func);
        else      fs(window.TEMPORARY, 100, func, ()=>{});
    }
} 
ifIncognito(true,  ()=>{ alert('in incognito') });
ifIncognito(false, ()=>{ alert('not in incognito') });