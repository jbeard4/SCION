require 'v8'
require 'json'

sm = {
    "id" => "foo",
    "states" => [
        {
            "id" => "bar",
            "onEntry" => "hello",        #this string will get resolved against the global object
            "transitions" => [
                {
                    "event" => "t",
                    "target" => "bat"
                }
            ]
        },
        {
            "id" => "bat"
        }
    ]
}

class Global
  def hello(event)
    puts "Hello World"
  end
end

g = Global.new

cxt = V8::Context.new(:with => g)

cxt.load("../../lib/scion.js")

sc = cxt.eval("new scion.Statechart(" + sm.to_json + ", { interpreterScriptingContext : this})")    #we set interpreterScriptingContext parameter here in order to satisfy ruby bindings requirement

initialConfig = sc.start()

puts initialConfig 

nextConfig = sc.gen 't'

puts nextConfig
