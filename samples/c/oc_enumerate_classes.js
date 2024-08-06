// frida -l enumerate_classes.js main
// frida-trace -p 11986 -S ./enumerate_classes.js
for (var className in ObjC.classes)
{
    if (ObjC.classes.hasOwnProperty(className))
    {
        console.log(className);
    }
}