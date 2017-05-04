/**
 * Created by Marine on 06.03.17.
 */
function binToOct(binValue) {
    var octalValue = '',
        str = binValue.toString(),
        len = str.length;
    while(str.length % 3 != 0) {
        str = '0' + str;
    }
    for(var j = 0, max = len; j < max; j +=  3) {
        octalValue += OctalBinaryArray.indexOf(str.substr(j, 3));
    }
    return octalValue;
}

function binToHex(binValue) {
    var hexValue = '',
        str = binValue.toString(),
        len = str.length;
    while(str.length % 4 != 0) {
        str = '0' + str;
    }
    for(var j = 0, max = len; j < max; j +=  4) {
        hexValue += HexValues[ HexBinaryArray.indexOf(str.substr(j, 4))];
    }
    return hexValue;
}

function binToOctHex(binValue) {
    var outputValue = '',
        str = binValue.toString(),
        len = str.length;

    switch(str) {
        case str.length % 4 != 0:
            str = '0' + str;
            for(var j = 0, max = len; j < max; j +=  4) {
                hexValue += HexValues[ HexBinaryArray.indexOf(str.substr(j, 4))];
            }
            break;
        case str.length % 3 != 0:
            str = '0' + str;
            for(var j = 0, max = len; j < max; j +=  3) {
                octalValue += OctalBinaryArray.indexOf(str.substr(j, 3));
            }
            break;
    }

}