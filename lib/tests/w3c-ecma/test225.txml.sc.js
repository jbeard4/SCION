//Generated on 2018-10-16 14:28:43 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1, Var2;

    function getDelayInMs(delayString) {
        if (typeof delayString === 'string') {
            if (delayString.slice(-2) === "ms") {
                return parseFloat(delayString.slice(0, -2));
            } else if (delayString.slice(-1) === "s") {
                return parseFloat(delayString.slice(0, -1)) * 1000;
            } else if (delayString.slice(-1) === "m") {
                return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
            } else {
                return parseFloat(delayString);
            }
        } else if (typeof delayString === 'number') {
            return delayString;
        } else {
            return 0;
        }
    }

    var $invokeIdCounter = 0;
    var $invokeIdAccumulator = [];

    function $generateInvokeId(parentStateId) {
        var id;
        do {
            id = parentStateId + ".invokeid_" + $invokeIdCounter++; //make sure we dont clobber an existing sendid or invokeid
        } while ($invokeIdAccumulator.indexOf(id) > -1)
        return id;
    };

    function $deserializeDatamodel($serializedDatamodel) {
        Var1 = $serializedDatamodel["Var1"];
        Var2 = $serializedDatamodel["Var2"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1,
            "Var2": Var2
        };
    }

    function $idlocation_l11_c58(_event) {
        return Var1 = $generateInvokeId.call(this, "s0")
    };
    $idlocation_l11_c58.tagname = 'undefined';
    $idlocation_l11_c58.line = 11;
    $idlocation_l11_c58.column = 58;

    function $invoke_l11_c4(_event) {
        $invoke_l11_c4.id = $idlocation_l11_c58.apply(this, arguments);
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c4.id,
            "constructorFunction": $invoke_l11_c4Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test225.txml.scxml"
        });
    };
    $invoke_l11_c4.tagname = 'invoke';
    $invoke_l11_c4.line = 11;
    $invoke_l11_c4.column = 4;

    $invoke_l11_c4.autoforward = false;

    function $idlocation_l18_c58(_event) {
        return Var2 = $generateInvokeId.call(this, "s0")
    };
    $idlocation_l18_c58.tagname = 'undefined';
    $idlocation_l18_c58.line = 18;
    $idlocation_l18_c58.column = 58;

    function $invoke_l18_c4(_event) {
        $invoke_l18_c4.id = $idlocation_l18_c58.apply(this, arguments);
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l18_c4.id,
            "constructorFunction": $invoke_l18_c4Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test225.txml.scxml"
        });
    };
    $invoke_l18_c4.tagname = 'invoke';
    $invoke_l18_c4.line = 18;
    $invoke_l18_c4.column = 4;

    $invoke_l18_c4.autoforward = false;

    function $senddata_l8_c5(_event) {
        return {}
    };
    $senddata_l8_c5.tagname = 'send';
    $senddata_l8_c5.line = 8;
    $senddata_l8_c5.column = 5;

    function $send_l8_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l8_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("1s"),
        });
    };
    $send_l8_c5.tagname = 'send';
    $send_l8_c5.line = 8;
    $send_l8_c5.column = 5;

    function $cond_l30_c20(_event) {
        return Var1 === Var2
    };
    $cond_l30_c20.tagname = 'undefined';
    $cond_l30_c20.line = 30;
    $cond_l30_c20.column = 20;

    function $expr_l34_c53(_event) {
        return 'pass'
    };
    $expr_l34_c53.tagname = 'undefined';
    $expr_l34_c53.line = 34;
    $expr_l34_c53.column = 53;

    function $log_l34_c27(_event) {
        this.log("Outcome", $expr_l34_c53.apply(this, arguments));
    };
    $log_l34_c27.tagname = 'log';
    $log_l34_c27.line = 34;
    $log_l34_c27.column = 27;

    function $expr_l35_c53(_event) {
        return 'fail'
    };
    $expr_l35_c53.tagname = 'undefined';
    $expr_l35_c53.line = 35;
    $expr_l35_c53.column = 53;

    function $log_l35_c27(_event) {
        this.log("Outcome", $expr_l35_c53.apply(this, arguments));
    };
    $log_l35_c27.tagname = 'log';
    $log_l35_c27.line = 35;
    $log_l35_c27.column = 27;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "$type": "state",
                "onEntry": [
                    $send_l8_c5
                ],
                "invokes": [
                    $invoke_l11_c4,
                    $invoke_l18_c4
                ],
                "transitions": [{
                    "event": "*",
                    "target": "s1",
                    "$closeLine": 26,
                    "$closeColumn": 36
                }],
                "$closeLine": 27,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l30_c20,
                        "target": "fail",
                        "$closeLine": 30,
                        "$closeColumn": 47
                    },
                    {
                        "target": "pass",
                        "$closeLine": 31,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 32,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l34_c27
                ],
                "$closeLine": 34,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l35_c27
                ],
                "$closeLine": 35,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 37,
        "$closeColumn": 2,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test225.txml.scxml"
    };
}

function $invoke_l11_c4Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }
    return {
        "initial": "subFinal1",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal1",
            "$type": "final",
            "$closeLine": 14,
            "$closeColumn": 31
        }],
        "$closeLine": 15,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test225.txml.scxml"
    };
}

function $invoke_l18_c4Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }
    return {
        "initial": "subFinal2",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-2",
        "states": [{
            "id": "subFinal2",
            "$type": "final",
            "$closeLine": 21,
            "$closeColumn": 31
        }],
        "$closeLine": 22,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test225.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjI1LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVzBELFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDLENBQUUsSUFBSSxDQUFqQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9MLFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDLENBQUUsSUFBSSxDQUFqQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVYxRDtBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQXNCakIsV0FBSSxHQUFHLElBQUs7QUFBQTs7Ozs7QUFJcUIsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBIn0=