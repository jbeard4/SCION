//convert the message to an event
function textRecognizer(message){
  return { name : message.type, data: {message : message} };
}

function luisRecognizer(message, cb, options){
  console.log('message.text', message.text);
  builder.LuisRecognizer.recognize(message.text, options.recognizerModelUrl, function(err, intents, entities){
    if(err) cb(err);
    console.log('recognizer.recognize result', err, intents, entities);
    //do some logic to get intent with the highest score
    let scores = intents.map( intent => intent.score )
    let maxScore = Math.max.apply(Math, scores);
    let maxScoreIdx = scores.indexOf(maxScore);
    let rankingIntent = intents[maxScoreIdx];
    if(rankingIntent){
      let scxmlEvent = {
        name : `message.intent.${rankingIntent.intent}`,
        data  : {
          message : message,
          rankingIntent : rankingIntent,
          intents : intents,
          entities : entities
        }
      };
      cb(null, scxmlEvent); 
    }
  })
}

module.exports = {
  textRecognizer : textRecognizer,
  luisRecognizer : luisRecognizer 
};
