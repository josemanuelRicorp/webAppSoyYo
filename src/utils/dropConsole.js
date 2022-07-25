var console = (function (oldCons) {
    let drop = false;// si quiero borrar console.logs cambio a true, si estA en falso no borrara
    let newCons = { ...oldCons};
    window.console = oldCons;
    if(drop){
        oldCons.log(
            "%c             ",
            "font-size:300px;"
            );
        oldCons.log(
            "%c%s",
            "color: red; font-size: 14px; padding: 6px;",
            "CAUTION: this space is only for developers. Please do not copy-paste any scripts here. It can be harmful!"
        );
        newCons.log =function(){};
        newCons.warn =function(){};
        // newCons.error = oldCons.error;
        newCons.error =function(){}
        newCons.err =function(){}
        newCons.info =function(){}

    }
    return newCons;
})(window.console);
window.console =console;