//get a list of spaces that the current user and the bot are members of
//reply with an ordered list of names, ask for include, exclude room numbers
//get confirmation
//ask for message to broadcast
//send message
//prompt for additional message to same list
//quit


module.exports = function (controller) {
    controller.hears(["broadcast"], "direct_message,direct_mention", function (bot, message) {

        bot.startPrivateConversationWithActor(message, function (err, convo) {
            convo.ask("Would you like to broadcast a message to multiple Spark Rooms?", [
                {

                    pattern: "^yes$",
                    callback: async function (response, convo) {
                        console.log();
                        var roomList = await bot.customCMDs.getCommonRooms({ userId: message.createdBy });
                        convo.setVar("roomList", roomList);
                        var roomListQ = "Which spaces would you like to broadcast to?\n";
                        for (let i = 0; i < roomList.length; i++) {
                            if (roomList[i].id !== convo.context.channel) {
                                roomListQ = roomListQ + "\n\n" + i + ": " + roomList[i].title;
                            }
                        }
                        roomListQ = roomListQ + "\n\nType 'include' or 'exclude followed by a list of space numbers to select the spaces to include in the broadcast.  ie 'include 1 3 5'.  You can also reply with 'all' to include all of the Spaces"
                        convo.ask(roomListQ, [{
                            pattern: "include", callback: function (response, convo) {
                                var ind = response.text.split(" ");
                                var retArray = [];
                                //skip first one,   ie the word include
                                for (let i = 1; i < ind.length; i++) {
                                    retArray.push(roomList[ind[i]])
                                }
                                convo.setVar("roomList", retArray);
                                convo.gotoThread("getMessage");
                            },
                        },
                        {
                            pattern: "exclude", callback: function (response, convo) {
                                var ind = response.text.split(" ");
                                var retArray = convo.vars.roomList;
                                //skip first one,   ie the word include
                                for (let i = ind.length - 1; i > 0; i--) {
                                    retArray = retArray.slice(0, ind[i]).concat(retArray.slice(ind[i] + 1))

                                }
                                convo.setVar("roomList", retArray);
                                convo.gotoThread("getMessage");

                            },
                        },
                        {
                            pattern: "all", callback: function (response, convo) {
                                //no retArray manipulations needed
                                convo.gotoThread("getMessage");

                            }
                        },

                        {
                            default: true,
                            callback: function (response, convo) {
                                convo.repeat();
                                convo.next();

                                convo.say("insert a gratuitous default comment here");
                            }
                        }

                        ]);
                        convo.next();
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.say("insert a gratuitous default comment here");
                        convo.repeat();
                        convo.next();
                    }
                }
            ], { key: "answer" });


            convo.addQuestion('What message would you like to send to these spaces?', function (response, convo) {

                return new Promise(function (fulfill, reject) {
                    if (response.data.files) {
                        bot.customCMDs.getFiles(response.data.files)
                            .then(function (ret) {
                                
                                fulfill()
                            })

                    } else {
                        fulfill();
                    }

                })

                convo.vars.roomList.forEach(element => {

                    var params = { roomId: element.id };


                    params.text = response.text ? response.text : undefined;
                    params.markdown = response.data.markdown ? response.data.markdown : undefined;



                });
                convo.gotoThread('confirmSent');
            }, {}, "getMessage")

            convo.addMessage({ text: 'Ok, message sent' }, 'completed');




        });

    })



};
