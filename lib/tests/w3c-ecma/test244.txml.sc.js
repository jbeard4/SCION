//Generated on 2018-10-16 14:28:56 by the SCION SCXML compiler
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

    function $senddata_l13_c6(_event) {
        return {
            "Var1": Var1
        }
    };
    $senddata_l13_c6.tagname = 'invoke';
    $senddata_l13_c6.line = 13;
    $senddata_l13_c6.column = 6;

    function $invoke_l13_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l13_c6.id,
            "constructorFunction": $invoke_l13_c6Constructor,

            "params": $senddata_l13_c6.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test244.txml.scxml"
        });
    };
    $invoke_l13_c6.tagname = 'invoke';
    $invoke_l13_c6.line = 13;
    $invoke_l13_c6.column = 6;

    $invoke_l13_c6.autoforward = false;

    $invoke_l13_c6.id = "s0.invokeid_0";

    function $senddata_l10_c5(_event) {
        return {}
    };
    $senddata_l10_c5.tagname = 'send';
    $senddata_l10_c5.line = 10;
    $senddata_l10_c5.column = 5;

    function $send_l10_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l10_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l10_c5.tagname = 'send';
    $send_l10_c5.line = 10;
    $send_l10_c5.column = 5;

    function $expr_l36_c53(_event) {
        return 'pass'
    };
    $expr_l36_c53.tagname = 'undefined';
    $expr_l36_c53.line = 36;
    $expr_l36_c53.column = 53;

    function $log_l36_c27(_event) {
        this.log("Outcome", $expr_l36_c53.apply(this, arguments));
    };
    $log_l36_c27.tagname = 'log';
    $log_l36_c27.line = 36;
    $log_l36_c27.column = 27;

    function $expr_l37_c53(_event) {
        return 'fail'
    };
    $expr_l37_c53.tagname = 'undefined';
    $expr_l37_c53.line = 37;
    $expr_l37_c53.column = 53;

    function $log_l37_c27(_event) {
        this.log("Outcome", $expr_l37_c53.apply(this, arguments));
    };
    $log_l37_c27.tagname = 'log';
    $log_l37_c27.line = 37;
    $log_l37_c27.column = 27;

    function $data_l5_c24(_event) {
        return 1
    };
    $data_l5_c24.tagname = 'undefined';
    $data_l5_c24.line = 5;
    $data_l5_c24.column = 24;

    function $datamodel_l4_c1(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l5_c24.apply(this, arguments);
    };
    $datamodel_l4_c1.tagname = 'datamodel';
    $datamodel_l4_c1.line = 4;
    $datamodel_l4_c1.column = 1;
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
                    $send_l10_c5
                ],
                "invokes": $invoke_l13_c6,
                "transitions": [{
                        "event": "success",
                        "target": "pass",
                        "$closeLine": 32,
                        "$closeColumn": 47
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 33,
                        "$closeColumn": 41
                    }
                ],
                "$closeLine": 34,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l36_c27
                ],
                "$closeLine": 36,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l37_c27
                ],
                "$closeLine": 37,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 38,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l4_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test244.txml.scxml"
    };
}

function $invoke_l13_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l22_c14(_event) {
        return {}
    };
    $senddata_l22_c14.tagname = 'send';
    $senddata_l22_c14.line = 22;
    $senddata_l22_c14.column = 14;

    function $send_l22_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "success",
            data: $senddata_l22_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l22_c14.tagname = 'send';
    $send_l22_c14.line = 22;
    $send_l22_c14.column = 14;

    function $cond_l21_c30(_event) {
        return Var1 == 1
    };
    $cond_l21_c30.tagname = 'undefined';
    $cond_l21_c30.line = 21;
    $cond_l21_c30.column = 30;

    function $senddata_l25_c18(_event) {
        return {}
    };
    $senddata_l25_c18.tagname = 'send';
    $senddata_l25_c18.line = 25;
    $senddata_l25_c18.column = 18;

    function $send_l25_c18(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "failure",
            data: $senddata_l25_c18.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l25_c18.tagname = 'send';
    $send_l25_c18.line = 25;
    $send_l25_c18.column = 18;

    function $data_l17_c35(_event) {
        return 0
    };
    $data_l17_c35.tagname = 'undefined';
    $data_l17_c35.line = 17;
    $data_l17_c35.column = 35;

    function $datamodel_l16_c14(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l17_c35.apply(this, arguments);
    };
    $datamodel_l16_c14.tagname = 'datamodel';
    $datamodel_l16_c14.line = 16;
    $datamodel_l16_c14.column = 14;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l21_c30,
                        "target": "subFinal",
                        "$closeLine": 23,
                        "$closeColumn": 16,
                        "onTransition": $send_l22_c14
                    },
                    {
                        "target": "subFinal",
                        "$closeLine": 26,
                        "$closeColumn": 15,
                        "onTransition": $send_l25_c18
                    }
                ],
                "$closeLine": 27,
                "$closeColumn": 13
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 28,
                "$closeColumn": 33
            }
        ],
        "$closeLine": 29,
        "$closeColumn": 16,
        "onEntry": [
            $datamodel_l16_c14
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test244.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQ0LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYU07QUFBQSxZQWtCUztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFyQlY7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUEwQmdCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFoQ3JDLFFBQUU7QUFBQTs7Ozs7QUFEekIsNEVBRUc7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JVO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBRHZCLFdBQUksRUFBRSxDQUFFO0FBQUE7Ozs7O0FBSXBCO0FBQUEsQ0FBdUM7QUFBQTs7Ozs7QUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQXVDO0FBQUE7Ozs7O0FBUnRCLFFBQUU7QUFBQTs7Ozs7QUFEdkIsNkVBRUM7QUFBQSJ9