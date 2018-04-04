module.exports = function (controller) {
    controller.hears(['restricted'], "direct_message, direct_mention", function (bot, message) {
        bot.startConversation(message, function (err, convo) {
            convo.ask("what is your favorite color?", [{
                pattern: "^blue|green|pint|red|yellow$",
                callback: function (response, convo) {
                    convo.say('cool, I like ' + response.text + ' too!');
                    convo.next();
                }
            },
            {
                default: true,
                callback: function (response, convo) {
                    convo.say("sorry, I don't know this color Try Another");
                    convo.repeat();
                    convo.next();
                }
            }])
    })
})
}