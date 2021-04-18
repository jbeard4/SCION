//Generated on 2018-10-16 14:28:42 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1;

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
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1
        };
    }

    function $idlocation_l9_c60(_event) {
        return Var1 = $generateInvokeId.call(this, "s0")
    };
    $idlocation_l9_c60.tagname = 'undefined';
    $idlocation_l9_c60.line = 9;
    $idlocation_l9_c60.column = 60;

    function $invoke_l9_c6(_event) {
        $invoke_l9_c6.id = $idlocation_l9_c60.apply(this, arguments);
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l9_c6.id,
            "constructorFunction": $invoke_l9_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test223.txml.scxml"
        });
    };
    $invoke_l9_c6.tagname = 'invoke';
    $invoke_l9_c6.line = 9;
    $invoke_l9_c6.column = 6;

    $invoke_l9_c6.autoforward = false;

    function $senddata_l7_c5(_event) {
        return {}
    };
    $senddata_l7_c5.tagname = 'send';
    $senddata_l7_c5.line = 7;
    $senddata_l7_c5.column = 5;

    function $send_l7_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l7_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("1s"),
        });
    };
    $send_l7_c5.tagname = 'send';
    $send_l7_c5.line = 7;
    $send_l7_c5.column = 5;

    function $cond_l21_c20(_event) {
        return Var1
    };
    $cond_l21_c20.tagname = 'undefined';
    $cond_l21_c20.line = 21;
    $cond_l21_c20.column = 20;

    function $expr_l25_c53(_event) {
        return 'pass'
    };
    $expr_l25_c53.tagname = 'undefined';
    $expr_l25_c53.line = 25;
    $expr_l25_c53.column = 53;

    function $log_l25_c27(_event) {
        this.log("Outcome", $expr_l25_c53.apply(this, arguments));
    };
    $log_l25_c27.tagname = 'log';
    $log_l25_c27.line = 25;
    $log_l25_c27.column = 27;

    function $expr_l26_c53(_event) {
        return 'fail'
    };
    $expr_l26_c53.tagname = 'undefined';
    $expr_l26_c53.line = 26;
    $expr_l26_c53.column = 53;

    function $log_l26_c27(_event) {
        this.log("Outcome", $expr_l26_c53.apply(this, arguments));
    };
    $log_l26_c27.tagname = 'log';
    $log_l26_c27.line = 26;
    $log_l26_c27.column = 27;
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
                    $send_l7_c5
                ],
                "invokes": $invoke_l9_c6,
                "transitions": [{
                    "event": "*",
                    "target": "s1",
                    "$closeLine": 17,
                    "$closeColumn": 36
                }],
                "$closeLine": 18,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l21_c20,
                        "target": "pass",
                        "$closeLine": 21,
                        "$closeColumn": 40
                    },
                    {
                        "target": "fail",
                        "$closeLine": 22,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 23,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l25_c27
                ],
                "$closeLine": 25,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l26_c27
                ],
                "$closeLine": 26,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 28,
        "$closeColumn": 2,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test223.txml.scxml"
    };
}

function $invoke_l9_c6Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }
    return {
        "initial": "subFinal",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "$closeLine": 13,
            "$closeColumn": 28
        }],
        "$closeLine": 14,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test223.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjIzLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVM0RCxXQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQyxDQUFFLElBQUksQ0FBakM7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGNUQ7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFjakIsV0FBSztBQUFBOzs7OztBQUk0QixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUEifQ==