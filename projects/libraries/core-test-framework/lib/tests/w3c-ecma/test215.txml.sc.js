//Generated on 2018-10-16 14:28:39 by the SCION SCXML compiler
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

    function $typeexpr_l13_c20(_event) {
        return Var1
    };
    $typeexpr_l13_c20.tagname = 'undefined';
    $typeexpr_l13_c20.line = 13;
    $typeexpr_l13_c20.column = 20;

    function $invoke_l13_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": $typeexpr_l13_c20.apply(this, arguments),
            "src": null,
            "id": $invoke_l13_c3.id,
            "constructorFunction": $invoke_l13_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test215.txml.scxml"
        });
    };
    $invoke_l13_c3.tagname = 'invoke';
    $invoke_l13_c3.line = 13;
    $invoke_l13_c3.column = 3;

    $invoke_l13_c3.autoforward = false;

    $invoke_l13_c3.id = "s0.invokeid_0";

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
            delay: getDelayInMs("5s"),
        });
    };
    $send_l10_c5.tagname = 'send';
    $send_l10_c5.line = 10;
    $send_l10_c5.column = 5;

    function $expr_l11_c34(_event) {
        return 'http://www.w3.org/TR/scxml/'
    };
    $expr_l11_c34.tagname = 'undefined';
    $expr_l11_c34.line = 11;
    $expr_l11_c34.column = 34;

    function $assign_l11_c5(_event) {
        Var1 = $expr_l11_c34.apply(this, arguments);
    };
    $assign_l11_c5.tagname = 'assign';
    $assign_l11_c5.line = 11;
    $assign_l11_c5.column = 5;

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

    function $data_l5_c24(_event) {
        return 'foo'
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
                    $send_l10_c5,
                    $assign_l11_c5
                ],
                "invokes": $invoke_l13_c3,
                "transitions": [{
                        "event": "done.invoke",
                        "target": "pass",
                        "$closeLine": 21,
                        "$closeColumn": 48
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 22,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 23,
                "$closeColumn": 2
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
        "onEntry": [
            $datamodel_l4_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test215.txml.scxml"
    };
}

function $invoke_l13_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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
            "$closeLine": 17,
            "$closeColumn": 27
        }],
        "$closeLine": 18,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test215.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjE1LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYW9CLFdBQUs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSHBCO0FBQUEsQ0FBZ0M7QUFBQTs7Ozs7QUFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWdDO0FBQUE7Ozs7O0FBQ0gsb0NBQThCO0FBQUE7Ozs7O0FBQTNELDRDQUE0RDtBQUFBOzs7OztBQWNaLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFyQnJDLFlBQU07QUFBQTs7Ozs7QUFEN0IsNEVBRUk7QUFBQSJ9