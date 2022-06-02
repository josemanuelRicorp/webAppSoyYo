export function link2FieldsWhatsapp(link) {
    let phone = "", msg = "";
    if (!link) return  { phone, msg };
    //https://api.whatsapp.com/send?phone=59173190823&text=Hola%3F%3F%3F%3F%20%3D%20h%26%26ola!
    let tempLink = link.toString();
    //phone=59173190823&text=Hola%3F%3F%3F%3F%20%3D%20h%26%26ola!
    tempLink = tempLink.toString().split("?")[1];
    // let phone = "", msg = "";
    //phone=59173190823
    phone = tempLink.split("&")[0];
    //59173190823
    phone = phone.split("=")[1];
    // //text=Hola%3F%3F%3F%3F%20%3D%20h%26%26ola!
    msg = tempLink.split("&")[1];
    // //Hola%3F%3F%3F%3F%20%3D%20h%26%26ola!
    msg = msg.split("=")[1];
    msg = msg.replaceAll("%20", " ");
    msg = msg.replaceAll("%25", "%");
    msg = msg.replaceAll("%26", "&");
    msg = msg.replaceAll("%3D", "=");
    msg = msg.replaceAll("%3F", "?");
    // console.log([phone, msg]);
    return { phone, msg };
}

export function link2FieldsEmail(link) {
    if (!link) return;
    let tempLink = "", email = "", subject = "", body = "";
    tempLink = link.toString();
    //email
    tempLink = tempLink.split("?");
    email = tempLink[0];
    email = email.split(":")[1];
    //subject y body
    tempLink = tempLink[1].split("&");
    subject = tempLink[0].split("=")[1];
    body = tempLink[1].split("=")[1];
    subject = subject.replaceAll("%20", " ");
    subject = subject.replaceAll("%25", "%");
    subject = subject.replaceAll("%26", "&");
    subject = subject.replaceAll("%3D", "=");
    subject = subject.replaceAll("%3F", "?");
    body = body.replaceAll("%20", " ");
    body = body.replaceAll("%25", "%");
    body = body.replaceAll("%26", "&");
    body = body.replaceAll("%3D", "=");
    body = body.replaceAll("%3F", "?");
    subject = subject.trim();
    body = body.trim();
    return { email, subject, body };
}

export function link2FieldsPhone(link) {
    if (!link) return;
    let tempLink = "", number = "";
    tempLink = link.toString();
    number = tempLink.split(":")[1];
    return { number };
}

export function link2FieldsLinkedin(link) {
    if (!link) return;
    return { username: cutLink(28, 1, link) };
}

export function link2FieldsFacebook(link) {
    if (!link) return;
    return { username: cutLink(25, 0, link) };
}

export function link2FieldsInstagram(link) {
    if (!link) return;
    return { username: cutLink(26, 0, link) }
}

export function link2FieldsTwitter(link) {
    if (!link) return;
    return { username: cutLink(20, 0, link) }
}

export function link2FieldsTwitch(link) {
    if (!link) return;
    return { username: cutLink(22, 0, link) }
}

export function link2FieldsTiktok(link) {
    if (!link) return;
    return { username: cutLink(24, 0, link) }
}



function cutLink(indexStart = 0, endCut = 0, link = "") {
    let tempLink = "", username = "";
    tempLink = link.toString();
    username = tempLink.substring(indexStart, tempLink.length - endCut);
    return username;
}



// console.log(link2FieldsTiktok("https://www.tiktok.com/@jedielsoncosta"));










