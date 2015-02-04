//Generated on Tuesday, June 17, 2014 21:23:32 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    function getDelayInMs(delayString){
        if(typeof delayString === 'string') {
            if (delayString.slice(-2) === "ms") {
                return parseFloat(delayString.slice(0, -2));
            } else if (delayString.slice(-1) === "s") {
                return parseFloat(delayString.slice(0, -1)) * 1000;
            } else {
                return parseFloat(delayString);
            }
        }else if (typeof delayString === 'number'){
            return delayString;
        }else{
            return 0;
        }
    }
    
    
    
    var foo, bar, bat;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            foo = $data_line_22_column_33.apply(this, arguments);
            bar = $data_line_23_column_33.apply(this, arguments);
            bat = $data_line_24_column_33.apply(this, arguments);
            $scion_early_binding_datamodel_has_fired = true; 
        }
    }
    
    function $deserializeDatamodel($serializedDatamodel){
        foo = $serializedDatamodel["foo"];
        bar = $serializedDatamodel["bar"];
        bat = $serializedDatamodel["bat"];
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
        "foo" : foo,
        "bar" : bar,
        "bat" : bat
       };
    }
    
    function $eventexpr_line_29_column_74(_event){
        return 's1';
    }
    
    function $location_line_30_column_50(_event){
        return bat;
    }
    
    function $expr_line_31_column_45(_event){
        return 4;
    }
    
    function $send_line_29_column_74(_event){
        var _scionTargetRef = "#_internal";
        if(_scionTargetRef === '#_internal'){
             this.raise(
             {
                target: _scionTargetRef,
                name: $eventexpr_line_29_column_74.apply(this, arguments),
                data: 
                    {
                        "foo":foo,
                        "bar":bar,
                        "bif":$location_line_30_column_50.apply(this, arguments),
                        "belt":$expr_line_31_column_45.apply(this, arguments)
                    },
                origin: _sessionid
             });
        }else{
             this.send(
             {
                target: _scionTargetRef,
                name: $eventexpr_line_29_column_74.apply(this, arguments),
                data: 
                    {
                        "foo":foo,
                        "bar":bar,
                        "bif":$location_line_30_column_50.apply(this, arguments),
                        "belt":$expr_line_31_column_45.apply(this, arguments)
                    },
                origin: _sessionid
             }, 
               {
                   delay: getDelayInMs(null),
                   sendId: null
               });
        }
    }
    
    function $eventexpr_line_43_column_55(_event){
        return 's2';
    }
    
    function $send_line_43_column_55(_event){
        var _scionTargetRef = "#_internal";
        if(_scionTargetRef === '#_internal'){
             this.raise(
             {
                target: _scionTargetRef,
                name: $eventexpr_line_43_column_55.apply(this, arguments),
                data: 
                    "More content.",
                origin: _sessionid
             });
        }else{
             this.send(
             {
                target: _scionTargetRef,
                name: $eventexpr_line_43_column_55.apply(this, arguments),
                data: 
                    "More content.",
                origin: _sessionid
             }, 
               {
                   delay: getDelayInMs(null),
                   sendId: null
               });
        }
    }
    
    function $cond_line_41_column_40(_event){
        return _event.data.foo === 1 && 
                        _event.data.bar === 2 && 
                        _event.data.bif === 3 &&
                        _event.data.belt === 4;
    }
    
    function $cond_line_55_column_52(_event){
        return _event.data === 'More content.';
    }
    
    function $expr_line_58_column_47(_event){
        return _event;
    }
    
    function $log_line_58_column_47(_event){
        this.log("_event",$expr_line_58_column_47.apply(this, arguments));
    }
    
    function $data_line_22_column_33(_event){
        return 1;
    }
    
    function $data_line_23_column_33(_event){
        return 2;
    }
    
    function $data_line_24_column_33(_event){
        return 3;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "transitions": [
                    {
                        "target": "b",
                        "event": "t",
                        "onTransition": $send_line_29_column_74
                    }
                ]
            },
            {
                "id": "b",
                "transitions": [
                    {
                        "event": "s1",
                        "target": "c",
                        "cond": $cond_line_41_column_40,
                        "onTransition": $send_line_43_column_55
                    },
                    {
                        "event": "s1",
                        "target": "f"
                    }
                ]
            },
            {
                "id": "c",
                "transitions": [
                    {
                        "event": "s2",
                        "target": "d",
                        "cond": $cond_line_55_column_52
                    },
                    {
                        "event": "s2",
                        "target": "f",
                        "onTransition": $log_line_58_column_47
                    }
                ]
            },
            {
                "id": "d"
            },
            {
                "id": "f"
            }
        ],
        "onEntry": [
            $initEarlyBindingDatamodel
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
