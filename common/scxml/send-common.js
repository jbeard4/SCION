function send(){
  var args = Array.from(arguments);
  var event = args[0];
  var textArgs = args.slice(1);
  var message = {
    "type": event.type,
    "agent": "botbuilder",
    "source": event.source,
    "textLocale": event.textLocale,
    "address": event.address,
    "text": textArgs.join('')
  };
  messageBuffer.push(message);
}
