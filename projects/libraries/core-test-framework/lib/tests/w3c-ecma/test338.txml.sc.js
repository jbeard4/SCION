//Generated on 2018-10-16 14:29:02 by the SCION SCXML compiler
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

    function $idlocation_l11_c25(_event) {
        return Var1 = $generateInvokeId.call(this, "s0")
    };
    $idlocation_l11_c25.tagname = 'undefined';
    $idlocation_l11_c25.line = 11;
    $idlocation_l11_c25.column = 25;

    function $invoke_l11_c6(_event) {
        $invoke_l11_c6.id = $idlocation_l11_c25.apply(this, arguments);
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c6.id,
            "constructorFunction": $invoke_l11_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test338.txml.scxml"
        });
    };
    $invoke_l11_c6.tagname = 'invoke';
    $invoke_l11_c6.line = 11;
    $invoke_l11_c6.column = 6;

    $invoke_l11_c6.autoforward = false;

    function $senddata_l9_c9(_event) {
        return {}
    };
    $senddata_l9_c9.tagname = 'send';
    $senddata_l9_c9.line = 9;
    $senddata_l9_c9.column = 9;

    function $send_l9_c9(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l9_c9.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l9_c9.tagname = 'send';
    $send_l9_c9.line = 9;
    $send_l9_c9.column = 9;

    function $expr_l23_c39(_event) {
        return _event.invokeid
    };
    $expr_l23_c39.tagname = 'undefined';
    $expr_l23_c39.line = 23;
    $expr_l23_c39.column = 39;

    function $assign_l23_c10(_event) {
        Var2 = $expr_l23_c39.apply(this, arguments);
    };
    $assign_l23_c10.tagname = 'assign';
    $assign_l23_c10.line = 23;
    $assign_l23_c10.column = 10;

    function $cond_l29_c20(_event) {
        return Var1 === Var2
    };
    $cond_l29_c20.tagname = 'undefined';
    $cond_l29_c20.line = 29;
    $cond_l29_c20.column = 20;

    function $expr_l33_c56(_event) {
        return 'pass'
    };
    $expr_l33_c56.tagname = 'undefined';
    $expr_l33_c56.line = 33;
    $expr_l33_c56.column = 56;

    function $log_l33_c30(_event) {
        this.log("Outcome", $expr_l33_c56.apply(this, arguments));
    };
    $log_l33_c30.tagname = 'log';
    $log_l33_c30.line = 33;
    $log_l33_c30.column = 30;

    function $expr_l34_c56(_event) {
        return 'fail'
    };
    $expr_l34_c56.tagname = 'undefined';
    $expr_l34_c56.line = 34;
    $expr_l34_c56.column = 56;

    function $log_l34_c30(_event) {
        this.log("Outcome", $expr_l34_c56.apply(this, arguments));
    };
    $log_l34_c30.tagname = 'log';
    $log_l34_c30.line = 34;
    $log_l34_c30.column = 30;
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
                    $send_l9_c9
                ],
                "invokes": $invoke_l11_c6,
                "transitions": [{
                        "event": "event1",
                        "target": "s1",
                        "$closeLine": 24,
                        "$closeColumn": 11,
                        "onTransition": $assign_l23_c10
                    },
                    {
                        "event": "event0",
                        "target": "fail",
                        "$closeLine": 25,
                        "$closeColumn": 48
                    }
                ],
                "$closeLine": 26,
                "$closeColumn": 5
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l29_c20,
                        "target": "pass",
                        "$closeLine": 29,
                        "$closeColumn": 47
                    },
                    {
                        "target": "fail",
                        "$closeLine": 30,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 31,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l33_c30
                ],
                "$closeLine": 33,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l34_c30
                ],
                "$closeLine": 34,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 38,
        "$closeColumn": 2,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test338.txml.scxml"
    };
}

function $invoke_l11_c6Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'machineName';

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

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }

    function $senddata_l16_c13(_event) {
        return {}
    };
    $senddata_l16_c13.tagname = 'send';
    $senddata_l16_c13.line = 16;
    $senddata_l16_c13.column = 13;

    function $send_l16_c13(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "event1",
            data: $senddata_l16_c13.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l16_c13.tagname = 'send';
    $send_l16_c13.line = 16;
    $send_l16_c13.column = 13;
    return {
        "initial": "sub0",
        "version": "1.0",
        "name": "machineName",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "sub0",
            "$type": "final",
            "onEntry": [
                $send_l16_c13
            ],
            "$closeLine": 18,
            "$closeColumn": 10
        }],
        "$closeLine": 19,
        "$closeColumn": 9,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test338.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MzM4LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV3lCLFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDLENBQUUsSUFBSSxDQUFqQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZyQjtBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQWNGLGFBQU0sQ0FBQyxRQUFTO0FBQUE7Ozs7O0FBQTdDLDRDQUE4QztBQUFBOzs7OztBQU1wQyxXQUFJLEdBQUcsSUFBSztBQUFBOzs7OztBQUl3QixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbEJuRDtBQUFBLENBQXNDO0FBQUE7Ozs7O0FBQXRDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFzQztBQUFBIn0=