


var CiscoSpark = require('ciscospark');
var request=require('request-promise');
var fs=require('fs');




exports.spark = function (params) {
    var token = params.token;
    var spark = new CiscoSpark({ credentials: token });
    var me = [];
    spark.people.list({ email: params.me })
        .then(function (ret) {
            me = ret.items[0];
        })



    //create a list of rooms that the bot and user belong to
    async function getCommonRooms(params) {
        var userId = params.userId;
        var roomList = await spark.rooms.list({ max: 10000 });
        roomList = roomList.items
        var retArray = [];

        for (let i = 0; i < roomList.length; i++) {
            var memberships = await spark.memberships.list({ roomId: roomList[i].id })
            memberships = memberships.items;
            for (let j = 0; j < memberships.length; j++) {

                if (memberships[j].personId === userId) {
                    retArray.push(roomList[i])
                }
            }
        }
        return retArray;
    }


    function sendMessage(params) {

        return spark.messages.create(params)

    }


    function getFiles(params){
        return new Promise(function(fulfill, reject){
            var options = {
                uri: params[0],
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization':'Bearer '+token
                }
            };
            request(options)
                .then(function(response){
                    console.log("*****************");
                    for(var label in response){
                        console.log(label);
                    }
                    // fs.writeFileSync('./test.docx', response)
                })
        })
    }
    return ({
        getCommonRooms: getCommonRooms,
        sendMessage: sendMessage,
        getFiles:getFiles
    })
}
