
const CiscoSpark = require('ciscospark');

const spark = new CiscoSpark({
  credentials: "YTc1OTU2MTAtYjFiZC00Nzg0LTlhNmMtZjNmZjJmZjJiMzNhNjJkZjZmOTctYTBl"
});

spark.rooms.list({max:5000})
    .then(function(ret){
        spark.memberships.list({roomId:ret.items[0].id})
            .then(function(ret){
                console.log(ret.items);
            })
    })