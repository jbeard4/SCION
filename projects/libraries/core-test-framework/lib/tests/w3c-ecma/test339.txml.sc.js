//Generated on 2018-10-16 14:29:02 by the SCION SCXML compiler
function machineNameConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'machineName';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }

    function $raise_l4_c6(_event) {
        this.raise({
            name: "foo",
            data: null
        });
    };
    $raise_l4_c6.tagname = 'raise';
    $raise_l4_c6.line = 4;
    $raise_l4_c6.column = 6;

    function $cond_l6_c33(_event) {
        return typeof _event.invokeid === 'undefined'
    };
    $cond_l6_c33.tagname = 'undefined';
    $cond_l6_c33.line = 6;
    $cond_l6_c33.column = 33;

    function $expr_l12_c56(_event) {
        return 'pass'
    };
    $expr_l12_c56.tagname = 'undefined';
    $expr_l12_c56.line = 12;
    $expr_l12_c56.column = 56;

    function $log_l12_c30(_event) {
        this.log("Outcome", $expr_l12_c56.apply(this, arguments));
    };
    $log_l12_c30.tagname = 'log';
    $log_l12_c30.line = 12;
    $log_l12_c30.column = 30;

    function $expr_l13_c56(_event) {
        return 'fail'
    };
    $expr_l13_c56.tagname = 'undefined';
    $expr_l13_c56.line = 13;
    $expr_l13_c56.column = 56;

    function $log_l13_c30(_event) {
        this.log("Outcome", $expr_l13_c56.apply(this, arguments));
    };
    $log_l13_c30.tagname = 'log';
    $log_l13_c30.line = 13;
    $log_l13_c30.column = 30;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "name": "machineName",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "$type": "state",
                "onEntry": [
                    $raise_l4_c6
                ],
                "transitions": [{
                        "event": "foo",
                        "cond": $cond_l6_c33,
                        "target": "pass",
                        "$closeLine": 6,
                        "$closeColumn": 88
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 7,
                        "$closeColumn": 42
                    }
                ],
                "$closeLine": 8,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l12_c30
                ],
                "$closeLine": 12,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l13_c30
                ],
                "$closeLine": 13,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 15,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test339.txml.scxml"
    };
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MzM5LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBSU0sdUNBQWtCO0FBQUE7Ozs7O0FBRVMsYSxDQUFPLE1BQU0sQ0FBQyxRLENBQVMsRyxDQUFJLFdBQWE7QUFBQTs7Ozs7QUFNakIsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBIn0=