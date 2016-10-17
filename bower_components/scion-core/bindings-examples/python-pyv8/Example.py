import PyV8
import json

#define an inner class
#TODO: pass through setters and getters to outer class definition?
class Global(PyV8.JSClass):      # define a compatible javascript class
    def hello(self,event):               # define a method
        print "Hello World"  

sm = {
    "id" : "foo",
    "states" : [
        {
            "id" : "bar",
            "onEntry" : "hello",        #this string will get resolved against the global object
            "transitions" : [
                {
                    "event" : "t",
                    "target" : "bat"
                }
            ]
        },
        {
            "id" : "bat"
        }
    ]
}

ctxt = PyV8.JSContext(Global())          # create a context with an implicit global object
ctxt.enter()                         # enter the context (also support with statement)

#import SCION into js context
f = open('../../lib/scion.js')
s = f.read()
f.close()
ctxt.eval(s)                      

sms = json.dumps(sm)
print sms

#instantiate a new Statechart
sc = ctxt.eval("new scion.Statechart(" + sms + ")")

initialConfig = sc.start()

print initialConfig 

nextConfig = sc.gen('t')

print nextConfig
