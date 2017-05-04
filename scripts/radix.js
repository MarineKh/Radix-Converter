var HexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
    OctalValues = ['0', '1', '2', '3', '4', '5', '6', '7'],
    HexBinaryArray = ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111', '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111'],
    OctalBinaryArray = ['000', '001', '010', '011', '100', '101', '110', '111'],
    ValidKeys = [8, 9],
    ValidDigit = ['0123456789', '0123456789ABCDEFabcdef', '01234567', '01'];

window.onload = function() {
    $('input').keypress(function(e) {

        if (ValidKeys.indexOf(e.keyCode)!= -1) {
            return true;
        } else if (0 == this.value.length && 48 == e.which) {
            return false;
        } else {
            return (ValidDigit[$(this).attr('tabindex')].indexOf(String.fromCharCode(e.which))!= -1);
        }
    });
}

var radix2 = $('#bin'), //bin
    radix8 = $('#oct'), //oct
    radix10 = $('#dec'), //dec
    radix16 = $('#hex'); //hex

radix2.on('input', function () {
    convertNumber(radix2.val(), 2);
});
radix8.on('input', function () {
    convertNumber(radix8.val(), 8);
});
radix10.on('input', function () {
    convertNumber(radix10.val(), 10);
});
radix16.on('input', function () {
    convertNumber(radix16.val(), 16);
});

function convertNumber(inputValue, radix) {
    switch (radix) {
        case 2:
            radix8.val(binToOct(inputValue));
            radix10.val(binToDec(inputValue));
            radix16.val(binToHex(inputValue));
            break;
        case 8:
            radix2.val(octToBin(inputValue));
            radix10.val(octToDec(inputValue));
            radix16.val(octToHex(inputValue));
            break;
        case 10:
            radix2.val(convertToBinOrOct(inputValue, 2));
            radix8.val(convertToBinOrOct(inputValue, 8));
            radix16.val(convertToHex(inputValue));
            break;
        case 16:
            radix2.val(hexToBin(inputValue));
            radix8.val(hexToOct(inputValue));
            radix10.val(hexToDec(inputValue));
            break;
    }
}
// for bin
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
function binToDec(binValue) {
    var decimal = 0,
        binLen = binValue.length - 1;
    for(var j = binLen; j >= 0; j--) {
        decimal += parseInt(binValue[j]) * Math.pow(2, binLen-j);
    }
    return decimal.toString().replace(/^0+/, '');
}
function binToHex(binValue) {
    var hexValue = '',
        str = binValue.toString(),
        len = str.length;
    while(str.length % 4 != 0) {
        str = '0' + str;
    }
    for(var j = 0, max = len; j < max; j +=  4) {
        hexValue += HexValues[HexBinaryArray.indexOf(str.substr(j, 4))];
    }
    return hexValue;
}
// for octal
function octToBin(octValue) {
    var binaryValue = '',
        str = octValue.toString();
    for(var j = 0; j < str.length; j++) {
        binaryValue += OctalBinaryArray[OctalValues.indexOf(str.substr(j, 1))];
    }
    return binaryValue.replace(/^0+/, '');
}
function octToDec(octValue) {
    var decimal = 0,
        octLen = octValue.length-1;

    for(var j = octLen; j >= 0; j--) {
        decimal += parseInt(octValue[j]) * Math.pow(8, octLen-j);
    }
    return (decimal.toString().replace(/^0+/, ''));
}
function octToHex(octValue) {
    // octal2Bin
    var binvalue = octToBin(octValue);
    //bin2Hex
    return binToHex(binvalue.replace(/^0+/, ''));
}
//for decimal
function convertToBinOrOct(decValue, radix) {
    var outputValue = '';
    do {
        outputValue = decValue % radix + outputValue;
        decValue = parseInt( decValue / radix );
    } while ( decValue > 0 );
    return outputValue.replace(/^0+/, '');
}
function convertToHex(decValue) {
    var hex = '',
        remainder;
    while(decValue > 0) {
        remainder = decValue % 16;
        hex = HexValues.toString().replace(/,/g , '').substr(remainder,1) + hex;
        decValue = parseInt(decValue/16);
    }
    return hex;
}
// for hex
function hexToBin(hexValue) {
    var binaryValue = '',
        str = hexValue.toString().toUpperCase();
    for(var j = 0; j < str.length; j++) {
        binaryValue += HexBinaryArray[HexValues.indexOf(str.substr(j, 1))];
    }
    return binaryValue.replace(/^0+/, '');
}
function hexToOct(hexValue) {
    //hex2binary
    var binaryValue = hexToBin(hexValue);
    //bin2octal
    return binToOct(binaryValue);
}
function hexToDec(hexValue) {
    // hexToBin
    var binaryValue = hexToBin(hexValue);
    // binToDec
    return binToDec(binaryValue);
}