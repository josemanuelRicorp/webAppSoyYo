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