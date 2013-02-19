//Generated on Monday, February 18, 2013 19:26:23 by the SCION SCXML compiler

var x = 0;

function $log_line_45_column_37(){
    console.log("x",x);
}

function $if_line_46_column_32(){
    if(x !== 10){
        $assign_line_47_column_51();
    }else{
        $assign_line_49_column_51();
    }
}

function $assign_line_47_column_51(){
    x = x * 3;
}

function $assign_line_49_column_51(){
    x = x * 2;
}

function $log_line_51_column_37(){
    console.log("x",x);
}

function $log_line_28_column_37(){
    console.log("x",x);
}

function $if_line_29_column_31(){
    if(x === 0){
        $assign_line_30_column_48();
    }else if(x === 10){
        $assign_line_32_column_48();
    }else{
        $assign_line_34_column_48();
    }
}

function $assign_line_30_column_48(){
    x = 10;
}

function $assign_line_32_column_48(){
    x = 20;
}

function $assign_line_34_column_48(){
    x = 30;
}

function $log_line_36_column_37(){
    console.log("x",x);
}

function $assign_line_40_column_47(){
    x = x + 1;
}

function $expression_line_39_column_57(){
    return x === 10;
}

function $log_line_58_column_37(){
    console.log("x",x);
}

function $if_line_59_column_31(){
    if(x === 0){
        $assign_line_60_column_49();
    }else if(x === 21){
        $assign_line_62_column_51();
        $assign_line_63_column_51();
    }else{
        $assign_line_65_column_49();
    }
}

function $assign_line_60_column_49(){
    x = 100;
}

function $assign_line_62_column_51(){
    x = x + 2;
}

function $assign_line_63_column_51(){
    x = x + 3;
}

function $assign_line_65_column_49(){
    x = 200;
}

function $if_line_68_column_32(){
    if(x === 26){
        $assign_line_69_column_51();
    }
}

function $assign_line_69_column_51(){
    x = x + 1;
}

function $if_line_72_column_32(){
    if(x === 26){
    }else if(x === 27){
        $assign_line_74_column_51();
    }else{
        $assign_line_76_column_52();
    }
}

function $assign_line_74_column_51(){
    x = x + 1;
}

function $assign_line_76_column_52(){
    x = x + 10;
}

function $if_line_79_column_32(){
    if(x === 28){
        $assign_line_80_column_52();
        $if_line_81_column_36();
    }
}

function $assign_line_80_column_52(){
    x = x + 12;
}

function $if_line_81_column_36(){
    if(x === 40){
        $assign_line_82_column_56();
    }
}

function $assign_line_82_column_56(){
    x = x + 10;
}

function $if_line_86_column_32(){
    if(x === 50){
        $assign_line_87_column_51();
        $if_line_88_column_36();
    }
}

function $assign_line_87_column_51(){
    x = x + 1;
}

function $if_line_88_column_36(){
    if(x !== 51){
    }else{
        $assign_line_90_column_56();
    }
}

function $assign_line_90_column_56(){
    x = x + 20;
}

function $log_line_94_column_37(){
    console.log("x",x);
}

function $expression_line_97_column_46(){
    return x === 71;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "onEntry": [
                $log_line_28_column_37,
                $if_line_29_column_31,
                $log_line_36_column_37
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "b",
                    "cond": $expression_line_39_column_57,
                    "onTransition": $assign_line_40_column_47
                }
            ],
            "onExit": [
                $log_line_45_column_37,
                $if_line_46_column_32,
                $log_line_51_column_37
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $log_line_58_column_37,
                $if_line_59_column_31,
                $if_line_68_column_32,
                $if_line_72_column_32,
                $if_line_79_column_32,
                $if_line_86_column_32,
                $log_line_94_column_37
            ],
            "transitions": [
                {
                    "target": "c",
                    "cond": $expression_line_97_column_46
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ]
};
