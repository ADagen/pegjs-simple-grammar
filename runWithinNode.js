var PEG = require('pegjs');
var fs = require('fs');

var grammar = fs.readFileSync('my.peg', 'utf-8');
var noColor = process.argv[2] === '--nocolor';


var _parse = PEG.buildParser(grammar).parse,
	parse = function(source) {
		try {
			console.log(source);
			return _parse(source);
		} catch(errorEvent) {
			console.log('	Error:',  errorEvent.message);
		}

	},
	expect = function(current) {
		return {
			toBe: function(expected) {
				var result 	= current === expected;
				success = ['		SUCCESS'],
					fail 	= ['		FAIL', 'expect ' + current + ' to be ' + expected],
					report 	= result ? success : fail;
				console.log.apply(console, report);
			}
		}
	},
	debug = function(statementName) {
		var results = Array.prototype.slice.apply(arguments),
			newArgs = ['	'+statementName];
		results.shift();
		newArgs = newArgs.concat(results);
		console.log.apply(console, newArgs);
	};

global.debug = debug;

expect(parse("146==146")).toBe(1);
expect(parse("0x3E1 == 0x3E1")).toBe(1);
expect(parse("0x3E1==993")).toBe(1);
expect(parse("rand(55) + 1 > 0")).toBe(1);
expect(parse("1-4 == -3")).toBe(1);
expect(parse("'asdf'.length == 4")).toBe(1);
expect(parse("'asdf'.length > 4")).toBe(0);
expect(parse("'12345af'.hex == 0x12345af")).toBe(1);
expect(parse("'text'[1:3] == 'ex'")).toBe(1);
expect(parse("'tex''1234t'[4:6] == '12'")).toBe(1);
expect(parse("'te''x''1234t'[5:7] == '12'")).toBe(1);
expect(parse("'text with ''special characters'''[1:4] == 'ext'")).toBe(1);
expect(parse("'text with ''special characters'''[1:1] == ''")).toBe(1);
expect(parse("'asqw'[:2] . 'df' == 'asdf'")).toBe(1);
expect(parse("'asdf' == 'asqw'[2:] . 'df'")).toBe(0);
expect(parse("3 * 2 - 1 == 5")).toBe(1);
expect(parse("47 << 24 + 253 << 16 + 0 << 8 + 46 == 0x2FFD002E")).toBe(1);
expect(parse("10 & 6 == 2")).toBe(1);
expect(parse("10 | 6 == 14")).toBe(1);
expect(parse("10 ^ 6 == 12")).toBe(1);
expect(parse("5 % 2 == 1")).toBe(1);
expect(parse("6 / 2 == 3")).toBe(1);
expect(parse("5 + 2 == 7")).toBe(1);
expect(parse("'av' . 'er' == 'aver'")).toBe(1);
expect(parse("'av' . 'er'.length == 4")).toBe(1);
expect(parse("1 == 1")).toBe(1);
expect(parse("1 != 1")).toBe(0);
expect(parse("-44 >= 0 or not 0 <= 0")).toBe(0);
expect(parse("-44 < 0 and 22 > 0")).toBe(1);
expect(parse("-44 < 0 && 22 > 0")).toBe(1);
expect(parse("-44 >= 0 || -5 <= -8")).toBe(0);
expect(parse("ip >> 16 & 0xff >= 15")).toBe(1);
expect(parse("zip == 1123 or zip > 100 and zip < 200")).toBe(0);
expect(parse("node > 0")).toBe(1);
expect(parse("tasks >= 0")).toBe(1);
expect(parse("2 - 3 - 5 == -6")).toBe(1);
expect(parse("2 - 5 + 1 == -2")).toBe(1);
expect(parse("20 / 2 / 2 == 5")).toBe(1);
expect(parse("'word'.length + 2 == 6")).toBe(1);
expect(parse("2 + 'word'.length == 6")).toBe(1);
expect(parse("-node + 24 + 0x5aF - 'hello'.length == 360")).toBe(1);
expect(parse("-node + 24/2 + 0x5aF - 'hello'.length + 3 << 2 == 360")).toBe(1);
expect(parse("1 + 2 + 3 == 6")).toBe(1);
expect(parse("1 + 2 + 3 + 4 == 10")).toBe(1);
expect(parse("1 + 2 + 3 + 4 + 5 == 15")).toBe(1);
expect(parse("1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 == 55")).toBe(1);
expect(parse("20 - 3 == 17")).toBe(1);
expect(parse("20 - 3 - 5 == 12")).toBe(1);
expect(parse("20 - 3 - 5 - 2 == 10")).toBe(1);
expect(parse("20 - 3 - 5 - 2 - 1 == 10")).toBe(1);
expect(parse("400 / 10 / 2 / 4 == 5")).toBe(1);