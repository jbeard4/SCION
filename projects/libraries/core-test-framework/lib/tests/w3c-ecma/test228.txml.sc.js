//Generated on 2018-10-16 14:28:45 by the SCION SCXML compiler
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

    function $deserializeDatamodel($serializedDatamodel) {
        Var1 = $serializedDatamodel["Var1"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1
        };
    }

    function $invoke_l10_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l10_c3.id,
            "constructorFunction": $invoke_l10_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test228.txml.scxml"
        });
    };
    $invoke_l10_c3.tagname = 'invoke';
    $invoke_l10_c3.line = 10;
    $invoke_l10_c3.column = 3;

    $invoke_l10_c3.autoforward = false;

    $invoke_l10_c3.id = "foo";

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
            delay: getDelayInMs("3s"),
        });
    };
    $send_l7_c5.tagname = 'send';
    $send_l7_c5.line = 7;
    $send_l7_c5.column = 5;

    function $expr_l19_c34(_event) {
        return _event.invokeid
    };
    $expr_l19_c34.tagname = 'undefined';
    $expr_l19_c34.line = 19;
    $expr_l19_c34.column = 34;

    function $assign_l19_c5(_event) {
        Var1 = $expr_l19_c34.apply(this, arguments);
    };
    $assign_l19_c5.tagname = 'assign';
    $assign_l19_c5.line = 19;
    $assign_l19_c5.column = 5;

    function $cond_l25_c20(_event) {
        return Var1 == 'foo'
    };
    $cond_l25_c20.tagname = 'undefined';
    $cond_l25_c20.line = 25;
    $cond_l25_c20.column = 20;

    function $expr_l29_c53(_event) {
        return 'pass'
    };
    $expr_l29_c53.tagname = 'undefined';
    $expr_l29_c53.line = 29;
    $expr_l29_c53.column = 53;

    function $log_l29_c27(_event) {
        this.log("Outcome", $expr_l29_c53.apply(this, arguments));
    };
    $log_l29_c27.tagname = 'log';
    $log_l29_c27.line = 29;
    $log_l29_c27.column = 27;

    function $expr_l30_c53(_event) {
        return 'fail'
    };
    $expr_l30_c53.tagname = 'undefined';
    $expr_l30_c53.line = 30;
    $expr_l30_c53.column = 53;

    function $log_l30_c27(_event) {
        this.log("Outcome", $expr_l30_c53.apply(this, arguments));
    };
    $log_l30_c27.tagname = 'log';
    $log_l30_c27.line = 30;
    $log_l30_c27.column = 27;
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
                "invokes": $invoke_l10_c3,
                "transitions": [{
                        "event": "done.invoke",
                        "target": "s1",
                        "$closeLine": 20,
                        "$closeColumn": 6,
                        "onTransition": $assign_l19_c5
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 21,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 22,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l25_c20,
                        "target": "pass",
                        "$closeLine": 25,
                        "$closeColumn": 47
                    },
                    {
                        "target": "fail",
                        "$closeLine": 26,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 27,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l29_c27
                ],
                "$closeLine": 29,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l30_c27
                ],
                "$closeLine": 30,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 32,
        "$closeColumn": 2,
        "onEntry": [],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test228.txml.scxml"
    };
}

function $invoke_l10_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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
            "$closeColumn": 27
        }],
        "$closeLine": 14,
        "$closeColumn": 9,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test228.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjI4LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9LO0FBQUEsQ0FBZ0M7QUFBQTs7Ozs7QUFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWdDO0FBQUE7Ozs7O0FBWUgsYUFBTSxDQUFDLFFBQVM7QUFBQTs7Ozs7QUFBN0MsNENBQThDO0FBQUE7Ozs7O0FBTS9CLFdBQUksRUFBRSxLQUFNO0FBQUE7Ozs7O0FBSXFCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQSJ9