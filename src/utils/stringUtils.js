export function text2ASCII(text) {
    let msg = text.toString();
    msg = msg.replaceAll("%", "%25");
    msg = msg.replaceAll(" ", "%20");
    msg = msg.replaceAll("&", "%26");
    msg = msg.replaceAll("=", "%3D");
    msg = msg.replaceAll("?", "%3F");
    return msg;
}
export function ASCII2Text(text) {
    let msg = text.toString();
    msg = msg.replaceAll("%20", " ");
    msg = msg.replaceAll("%25", "%");
    msg = msg.replaceAll("%26", "&");
    msg = msg.replaceAll("%3D", "=");
    msg = msg.replaceAll("%3F", "?");
    return msg;
}
export function emailToString(email) {
    let msg = email.toString();
    let text = "";
    for (let i = 0; i < msg.length; i++) {
        const char = msg[i];
        if(char !== '@'){
            text = text + char;
        } else return text;
    }
    return text;
}

export function stringToEmailExtention(email) {
    let msg = email.toString();
    let state = false;
    let text = "";
    for (let i = 0; i < msg.length; i++) {
        const char = msg[i];
        if(char === '@' || state){
            state = true;
            text = text + char;
        }
    }
    return text !== "" ? text.substring(1, text.length) : text;
} 