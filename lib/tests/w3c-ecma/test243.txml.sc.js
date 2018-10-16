//Generated on 2018-10-16 14:28:55 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

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

    function $expr_l10_c35(_event) {
        return 1
    };
    $expr_l10_c35.tagname = 'undefined';
    $expr_l10_c35.line = 10;
    $expr_l10_c35.column = 35;

    function $senddata_l9_c7(_event) {
        return {
            "Var1": $expr_l10_c35.apply(this, arguments)
        }
    };
    $senddata_l9_c7.tagname = 'invoke';
    $senddata_l9_c7.line = 9;
    $senddata_l9_c7.column = 7;

    function $invoke_l9_c7(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l9_c7.id,
            "constructorFunction": $invoke_l9_c7Constructor,

            "params": $senddata_l9_c7.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test243.txml.scxml"
        });
    };
    $invoke_l9_c7.tagname = 'invoke';
    $invoke_l9_c7.line = 9;
    $invoke_l9_c7.column = 7;

    $invoke_l9_c7.autoforward = false;

    $invoke_l9_c7.id = "s0.invokeid_0";

    function $senddata_l6_c5(_event) {
        return {}
    };
    $senddata_l6_c5.tagname = 'send';
    $senddata_l6_c5.line = 6;
    $senddata_l6_c5.column = 5;

    function $send_l6_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l6_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l6_c5.tagname = 'send';
    $send_l6_c5.line = 6;
    $send_l6_c5.column = 5;

    function $expr_l33_c53(_event) {
        return 'pass'
    };
    $expr_l33_c53.tagname = 'undefined';
    $expr_l33_c53.line = 33;
    $expr_l33_c53.column = 53;

    function $log_l33_c27(_event) {
        this.log("Outcome", $expr_l33_c53.apply(this, arguments));
    };
    $log_l33_c27.tagname = 'log';
    $log_l33_c27.line = 33;
    $log_l33_c27.column = 27;

    function $expr_l34_c53(_event) {
        return 'fail'
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
                    $send_l6_c5
                ],
                "invokes": $invoke_l9_c7,
                "transitions": [{
                        "event": "success",
                        "target": "pass",
                        "$closeLine": 29,
                        "$closeColumn": 47
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 30,
                        "$closeColumn": 41
                    }
                ],
                "$closeLine": 31,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l33_c27
                ],
                "$closeLine": 33,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l34_c27
                ],
                "$closeLine": 34,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 35,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test243.txml.scxml"
    };
}

function $invoke_l9_c7Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l19_c18(_event) {
        return {}
    };
    $senddata_l19_c18.tagname = 'send';
    $senddata_l19_c18.line = 19;
    $senddata_l19_c18.column = 18;

    function $send_l19_c18(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l19_c18.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l19_c18.tagname = 'send';
    $send_l19_c18.line = 19;
    $send_l19_c18.column = 18;

    function $cond_l18_c32(_event) {
        return Var1 == 1
    };
    $cond_l18_c32.tagname = 'undefined';
    $cond_l18_c32.line = 18;
    $cond_l18_c32.column = 32;

    function $senddata_l22_c20(_event) {
        return {}
    };
    $senddata_l22_c20.tagname = 'send';
    $senddata_l22_c20.line = 22;
    $senddata_l22_c20.column = 20;

    function $send_l22_c20(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l22_c20.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l22_c20.tagname = 'send';
    $send_l22_c20.line = 22;
    $send_l22_c20.column = 20;

    function $data_l14_c36(_event) {
        return 0
    };
    $data_l14_c36.tagname = 'undefined';
    $data_l14_c36.line = 14;
    $data_l14_c36.column = 36;

    function $datamodel_l13_c14(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l14_c36.apply(this, arguments);
    };
    $datamodel_l13_c14.tagname = 'datamodel';
    $datamodel_l13_c14.line = 13;
    $datamodel_l13_c14.column = 14;
    return {
        "version": "1.0",
        "initial": "sub0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l18_c32,
                        "target": "subFinal",
                        "$closeLine": 20,
                        "$closeColumn": 21,
                        "onTransition": $send_l19_c18
                    },
                    {
                        "target": "subFinal",
                        "$closeLine": 23,
                        "$closeColumn": 22,
                        "onTransition": $send_l22_c20
                    }
                ],
                "$closeLine": 24,
                "$closeColumn": 19
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 25,
                "$closeColumn": 35
            }
        ],
        "$closeLine": 26,
        "$closeColumn": 17,
        "onEntry": [
            $datamodel_l13_c14
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test243.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQzLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVbUMsUUFBRTtBQUFBOzs7OztBQUQ5QjtBQUFBLDRDQW1CTTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF0QlI7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUEyQmdCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZjNDO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBRHpCLFdBQUksRUFBRSxDQUFFO0FBQUE7Ozs7O0FBSXBCO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBUnZCLFFBQUU7QUFBQTs7Ozs7QUFEeEIsNkVBRUk7QUFBQSJ9