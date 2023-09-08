type AppSyncEvent = {
    info: {
        fieldName: string
    }
    arguments: {
        msg: string
    }
}

exports.handler = async (event: AppSyncEvent) => {
if(event.info.fieldName === "hello"){
    return "Hello world";
}else if(event.info.fieldName === "myCustomMessage")
{
    return `This is my custom Message:${event.arguments.msg}`;
}else
{
    return "No Data";
}
}
