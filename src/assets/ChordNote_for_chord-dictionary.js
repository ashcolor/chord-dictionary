// @https://github.com/graphemecluster/graphemecluster.github.io/blob/master/ChordNote_for_chord-dictionary.js
import Tone from "tone";
var accidentals = {
	"b": -1,
	"#": 1,
	"ｂ": -1,
	"＃": 1,
	"♭": -1,
	"♯": 1,
	"♮": 0,
	"x": 2,
	"\uDD2B": -2,
	"\uDD2A": 2
};
var relatives = [
	[/major|(iod|hypolyd)ian/i],
	[/dori(an|c)|hypomixolydian/i, /hypodori(an|c)/i],
	[/phrygian/i, /hypophrygian/i],
	[/lydian/i, /mixolydian/i],
	[/mixolydian/i],
	[/minor|(aeol|hypodor)ian/i],
	[/(locr|hypophryg)ian/i]
];
function Note(key, offset) {
	if (key instanceof Note) return key;
	if (!(this instanceof Note)) return new Note(key, offset);
	if (!key || ~~key == key) {
		this.key = key ? (key % 7 + 7) % 7 : 0;
		this.offset = +offset || 0;
	} else {
		var match = key.match(/([A-Ga-gＡ-Ｇａ-ｇ])((?:[b#ｂ＃♭♯♮x]|\uD834[\uDD2B\uDD2A])*)(.*)/);
		if (match) {
			this.key = "CDEFGABcdefgabＣＤＥＦＧＡＢｃｄｅｆｇａｂ".indexOf(match[1]) % 7;
			this.offset = match[2].replace(/\uD834/g, "").split("").reduce(function(total, item) {
				return total + accidentals[item];
			}, 0);
			if (!match[3] || /[MＭ](?![A-Za-zＡ-Ｚａ-ｚ])/.test(match[3])) return this;
			if (/[mｍ](?![A-Za-zＡ-Ｚａ-ｚ])/.test(match[3])) return transpose(5, 0, this);
			var index = relatives.findIndex(function(item) {
				return !(item[1] && item[1].test(match[3])) && item[0].test(match[3]);
			});
			if (index != -1) return transpose(index, 0, this);
		} else return null;
	}
}
Note.prototype.toString = function(useUnicode, useDouble) {
	return "CDEFGAB".charAt(this.key) + (
		this.offset < 0
			? useUnicode && useDouble && this.offset == -2
				? "𝄫"
				: (useUnicode ? "♭" : "b").repeat(-this.offset)
			: useDouble && this.offset == 2
				? (useUnicode ? "𝄪" : "x")
				: (useUnicode ? "♯" : "#").repeat(this.offset)
	);
};
Note.prototype.toRoman = function(useUnicode, lowerCase, acciUseUnicode, acciUseDouble) {
	return (
		this.offset < 0
			? acciUseUnicode && acciUseDouble && this.offset == -2
				? "𝄫"
				: (acciUseUnicode ? "♭" : "b").repeat(-this.offset)
			: acciUseDouble && this.offset == 2
				? (acciUseUnicode ? "𝄪" : "x")
				: (acciUseUnicode ? "♯" : "#").repeat(this.offset)
	) + (
		useUnicode
			? lowerCase
				? ["ⅰ", "ⅱ", "ⅲ", "ⅳ", "ⅴ", "ⅵ", "ⅶ"]
				: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ"]
			: lowerCase
				? ["i", "ii", "iii", "iv", "v", "vi", "vii"]
				: ["I", "II", "III", "IV", "V", "VI", "VII"]
	)[this.key];
};
var half = [0, 2, 4, 5, 7, 9, 11];
Note.prototype.toHalf = function() {
	return ((half[this.key] + this.offset) % 12 + 12) % 12;
};
var keyOffsets = [
	[0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 1, 0, 0, 0],
	[1, 1, 0, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, -1],
	[0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 0, 0],
	[1, 1, 0, 1, 1, 1, 0]
];
function transpose(original, target, note) {
	original = Note(original);
	target = Note(target);
	note = Note(note);
	var out = ((target.key + note.key - original.key) % 7 + 7) % 7;
	return Note(out, keyOffsets[target.key][out] - keyOffsets[original.key][note.key] + target.offset + note.offset - original.offset);
}
if (!String.prototype.repeat) String.prototype.repeat = function(times) {
	var str = "" + this;
	times = ~~times;
	var result = "";
	while (true) {
		if (times & 1) result += str;
		times >>>= 1;
		if (!times) return result;
		str += str;
	}
}

function Chord(array, data) {
	if (!(this instanceof Chord)) return new Chord(array, data);
	for (var prop in data) if (data.hasOwnProperty(prop)) this[prop] = data[prop];
	this.original = array;
	this.firstIndex = array.first;
	delete array.first;
	var octave = 4;
	this.display = array.map(function(item, index) {
		return item + "/" + (array[index - 1] && item.key <= array[index - 1].key ? ++octave : octave);
	});
	this.voicing = array.map(item => item.toHalf());
	var prev = 60, index = 0;
	for (var a = 1; a < this.voicing.length; a++) if (this.voicing[a] < this.voicing[index]) index = a;
	this.voicing = this.voicing.concat(this.voicing).slice(index, this.voicing.length + index);
	this.voicing = this.voicing.map(item => Tone.Frequency(prev += ((item - prev) % 12 + 12) % 12, "midi"));
	this.voicing.unshift(Tone.Frequency(array[0].toHalf() + 36, "midi"));
}

var regex = /([+＋⁺₊﹢])|([‑‑⁻₋﹣−˗ー－-])|([／/＼\\])|([AaＡａ][DdＤｄ]{2})|([OoＯｏ0０][MmＭｍ][IiＩｉ][TtＴｔ]|[NnＮｎ][OoＯｏ0０])|([DdＤｄ][OoＯｏ0０][MmＭｍ](?![IiＩｉ][TtＴｔ])(?:[IiＩｉ](?:[NnＮｎ](?:[AaＡａ](?:[NnＮｎ][TtＴｔ]?)?)?)?)?)|([AaＡａ][UuＵｕ][GgＧｇ](?:[MmＭｍ][EeＥｅ](?:[NnＮｎ](?:[TtＴｔ](?:[EeＥｅ][DdＤｄ]?)?)?)?)?)|([OoＯｏ0０][NnＮｎ])|([DdＤｄ][IiＩｉ][MmＭｍ](?:[IiＩｉ](?:[NnＮｎ](?:[IiＩｉ](?:[SsＳｓ](?:[HhＨｈ](?:[EeＥｅ][DdＤｄ]?)?)?)?)?)?)?|[°ºᵒ˚⁰∘゜ﾟ○◦◯⚪⭕￮⭘OoＯｏ0０])|([HhＨｈ](?:[AaＡａ](?:[LlＬｌ][FfＦｆ]?)?)?[-‑‑⁻₋﹣−˗ー－ 	 ﻿ -   　]*[DdＤｄ][IiＩｉ][MmＭｍ](?:[IiＩｉ](?:[NnＮｎ](?:[IiＩｉ](?:[SsＳｓ](?:[HhＨｈ](?:[EeＥｅ][DdＤｄ]?)?)?)?)?)?)?|[øØ∅⌀])|([SsＳｓ][UuＵｕ][SsＳｓ](?:[PpＰｐ](?:[EeＥｅ](?:[NnＮｎ](?:[DdＤｄ](?:[EeＥｅ][DdＤｄ]?)?)?)?)?)?)|([MmＭｍ][aａ](?![UuＵｕ][GgＧｇ]|[DdＤｄ]{2})(?:[JjＪｊ](?:[OoＯｏ0０][RrＲｒ]?)?)?|[MＭΔ△∆▵])|([MmＭｍ][IiＩｉ](?:[NnＮｎ](?:[OoＯｏ0０][RrＲｒ]?)?)?|[mｍ])|([（【\(])|([）】\)])|([。．，、・,.])|([RrＲｒ][OoＯｏ0０]{2}[TtＴｔ])|((?:[EeＥｅ][LlＬｌ][EeＥｅ][VvＶｖ][EeＥｅ][NnＮｎ]|[1１]{2})(?:[TtＴｔ][HhＨｈ])?)|((?:[TtＴｔ][HhＨｈ][IiＩｉ][RrＲｒ][TtＴｔ][EeＥｅ]{2}[NnＮｎ]|[1１][3３])(?:[TtＴｔ][HhＨｈ])?)|([FfＦｆ][IiＩｉ][RrＲｒ][SsＳｓ][TtＴｔ]|[OoＯｏ0０][NnＮｎ][EeＥｅ]|[1１](?:[SsＳｓ][TtＴｔ])?)|([SsＳｓ][EeＥｅ][CcＣｃ][OoＯｏ0０][NnＮｎ][DdＤｄ]|[TtＴｔ][WwＷｗ][OoＯｏ0０]|[2２](?:[NnＮｎ][DdＤｄ])?)|([TtＴｔ][HhＨｈ](?:[IiＩｉ][RrＲｒ][DdＤｄ]|[RrＲｒ][EeＥｅ]{2})|[3３](?:[RrＲｒ][DdＤｄ])?)|((?:[FfＦｆ][OoＯｏ0０][UuＵｕ][RrＲｒ]|4|４)(?:[TtＴｔ][HhＨｈ])?)|([FfＦｆ][IiＩｉ](?:[FfＦｆ][TtＴｔ][HhＨｈ]|[VvＶｖ][EeＥｅ])|[5５](?:[TtＴｔ][HhＨｈ])?)|((?:[SsＳｓ][IiＩｉ][XxＸｘ×]|6|６)(?:[TtＴｔ][HhＨｈ])?)|((?:[SsＳｓ][EeＥｅ][VvＶｖ][EeＥｅ][NnＮｎ]|7|７)(?:[TtＴｔ][HhＨｈ])?)|([NnＮｎ][IiＩｉ][NnＮｎ](?:[TtＴｔ][HhＨｈ]|[EeＥｅ])|[9９](?:[TtＴｔ][HhＨｈ])?)|([FfＦｆ][LlＬｌ](?:[AaＡａ][TtＴｔ]?)?|♭)|([bｂ])|([SsＳｓ](?:[HhＨｈ](?:[AaＡａ](?:[RrＲｒ][PpＰｐ]?)?)?)?|[#＃♯])|([DdＤｄ](?:[OoＯｏ0０][UuＵｕ][BbＢｂ][LlＬｌ][EeＥｅ]|[BbＢｂ][LlＬｌ])[-‑‑⁻₋﹣−˗ー－ 	 ﻿ -   　]*(?:[FfＦｆ][LlＬｌ](?:[AaＡａ][TtＴｔ]?)?|♭)|𝄫)|([DdＤｄ](?:[OoＯｏ0０][UuＵｕ][BbＢｂ][LlＬｌ][EeＥｅ]|[BbＢｂ][LlＬｌ])[-‑‑⁻₋﹣−˗ー－ 	 ﻿ -   　]*(?:[SsＳｓ](?:[HhＨｈ](?:[AaＡａ](?:[RrＲｒ][PpＰｐ]?)?)?)?|[#＃♯])|𝄪|[XxＸｘ×])|([DdＤｄ]?(?:[OoＯｏ0０][UuＵｕ][BbＢｂ][LlＬｌ][EeＥｅ]|[BbＢｂ][LlＬｌ])[-‑‑⁻₋﹣−˗ー－ 	 ﻿ -   　]*(?:[NnＮｎ][AaＡａ](?:[TtＴｔ](?:[UuＵｕ](?:[RrＲｒ](?:[AaＡａ][LlＬｌ]?)?)?)?)?|♮))|([AaＡａ])|([BＢ])|([CcＣｃ])|([DdＤｄ])|([EeＥｅ])|([FfＦｆ])|([GgＧｇ])|([VvＶｖ][IiＩｉ](?![IiＩｉ])|[Ⅵⅵ])|([VvＶｖ][IiＩｉ]{2}|[Ⅶⅶ])|([IiＩｉ](?![IiＩｉVvＶｖ])|[Ⅰⅰ])|([IiＩｉ]{2}(?![IiＩｉ])|[Ⅱⅱ])|([IiＩｉ]{3}|[Ⅲⅲ])|([IiＩｉ][VvＶｖ]|[Ⅳⅳ])|([VvＶｖ](?![IiＩｉ])|[Ⅴⅴ])|([ 	 ﻿ -   　]+)|([NnＮｎ](?:[OoＯｏ0０][NnＮｎ]?)?[-‑‑⁻₋﹣−˗ー－ 	 ﻿ -   　。．，、・,.]*[CcＣｃ](?:[HhＨｈ](?:[OoＯｏ0０](?:[RrＲｒ][DdＤｄ]?)?)?)?[。．，、・,.]*|[^])/g;
// var types = ["plus", "minus", "slash", "add", "omit", "dom", "aug", "on", "dim", "halfdim", "sus", "major", "minor", "opb", "clb", "comma", "root", "11", "13", "1", "2", "3", "4", "5", "6", "7", "9", "flat", "b", "sharp", "dblflat", "dblsharp", "neutral", "A", "B", "C", "D", "E", "F", "G", "VI", "VII", "I", "II", "III", "IV", "V", "whitespace", "others"];
var ids = " p_%axd'&ohsMm<>,ret12345679fb#vX!ABCDEFGJKLNPQSw=";
var acciList = {"f": -1, "b": -1, "#": 1, "v": -2, "X": 2, "!": 0, "w": 0};
var accis = {"f": "b", "b": "b", "#": "#", "p": "#", "_": "b", "!": "", "": ""};
var omits = {"r": "C", "e": "F", "t": "A", "1": "C", "3": "E", "5": "G", "7": "B", "9": "D"};
function parseContent(input) {
	var inputList = [];
	var idList = "";
	var i;
	input.replace(regex, function(match) {
		inputList.push(match);
		for (i = 1; i < arguments.length; i++) {
			if (arguments[i]) {
				idList += ids[i];
				break;
			}
		}
	});
	
	var chordList = [];
	
	for (i = 0; i < idList.length; i++) {
		
		var currPos = i, detect = false, isInterval = false, note, acci;
		
		if ("fb#vX!".includes(curr())) {
			
			acci = acciList[curr()];
			while (peek() in acciList) {plus(); acci += acciList[curr()];}
			if (peek() && "JKLNPQS".includes(peek())) {
				plus();
				note = "JKLNPQS".indexOf(curr()) - 2;
				detect = true;
				isInterval = true;
			} else if (curr() == "b" || curr() == "w" && prev() == "b") {
				note = 6;
				acci += 1;
				detect = true;
				isInterval = false;
			} else i = currPos;
			
		} else if ("ABCDEFG".includes(curr())) {
			
			note = idList.charCodeAt(i) - 67;
			acci = 0;
			while (peek() in acciList) {plus(); acci += acciList[curr()];}
			detect = true;
			isInterval = false;
			
		} else if ("JKLNPQS".includes(curr())) {
			
			note = "JKLNPQS".indexOf(curr()) - 2;
			acci = 0;
			detect = true;
			isInterval = true;
			
		}
		
		if (detect) {
			
			var noteObj = Note(note, acci), noteUntil = i;
			
			var bracketLayer = 0;
			var has5 = false, has6 = false, has7 = false, third = null, seventh = null, type = null;
			var sus2 = false, sus4 = false, thirdAfterType = null, highestInterval = null, extended = false;
			var chordNote = ["C"], addNote = [], omitNote = [], omitNotePos = [], addNoteMandatory = [];
			var seventhPos = null, currStatus = null, mandatory = false;
			var addDSharpPos = null, addFFlatPos = null, addASharpPos = null;
			
			addNoteMandatory[-1] = true;
			
			while (cont(
				"p", c => {type = "'"; return true;},
				"_", c => {if (bracketLayer) return false; third = "m"; seventhPos = i; return true;},
				"2", c => {sus2 = true; cont("4", c => sus4 = true); return true;},
				"4", c => {sus4 = true; cont("2", c => sus2 = true); return true;},
				"79et", c => {has7 = true; highestInterval = c; return true;}
			));
			
			function requireNum(acci) {
				var acciPos = i;
				return cont(
					"24569et", c => addNotes(acci, c),
					"<", c => {
						var innerBracketLayer = 1;
						var anyNote = false;
						while (cont(
							"<", c => {innerBracketLayer++; return true;},
							">", c => {innerBracketLayer--; return true;},
							",", c => {return true;},
							"24569et", c => {if (addNotes(acci, c, acciPos)) return anyNote = true;}
						) && innerBracketLayer > 0);
						if (innerBracketLayer > 0 && anyNote) currStatus = "f";
						return anyNote;
					}
				);
			}
			
			function requireAdd() {
				return cont(
					"2469et", c => addNotes("", c),
					"fb#!p_", acci => {
						var acciPos = i;
						return cont(
							"2469et", c => addNotes(acci, c, acciPos)
						);
					},
					"<", c => {
						var innerBracketLayer = 1;
						var anyNote = false;
						while (cont(
							"<", c => {innerBracketLayer++; return true;},
							">", c => {innerBracketLayer--; return true;},
							",", c => {return true;},
							"2469et", c => {if (addNotes("", c)) return anyNote = true;},
							"fb#!p_", acci => {
								var acciPos = i;
								return cont(
									"2469et", c => addNotes(acci, c, acciPos)
								);
							}
						) && innerBracketLayer > 0);
						if (innerBracketLayer > 0) currStatus = "f";
						return anyNote;
					}
				);
			}
			
			while (cont(
				"#fb!", requireNum,
				"p", c => {
					if (requireNum(c)) return true;
					if (type || addNote.includes("G#") || addNote.includes("Ab")) return false;
					type = "'";
					return true;
				},
				"_", c => {
					if (requireNum(c)) return true;
					if (third) {
						if (seventh) return false;
						else {
							seventh = "m";
							seventhPos = i;
						}
					} else {
						third = "m";
						seventhPos = i;
						thirdAfterType = !!type;
					}
					return true;
				},
				"d'ho", c => {
					if (type || c == "'" && (addNote.includes("G#") || addNote.includes("Ab")) || "oh".includes(c) && (addNote.includes("Gb") || addNote.includes("F#"))) return false;
					type = c;
					return true;
				},
				"Mm", c => {
					if (third) {
						if (seventh) return false;
						else {
							seventh = c;
							seventhPos = i;
						}
					} else {
						third = c;
						seventhPos = i;
						thirdAfterType = !!type;
					}
					return true;
				},
				"a", c => {
					mandatory = true;
					var addResult = requireAdd();
					mandatory = false;
					return addResult;
				},
				",", c => {
					requireAdd();
					return true;
				},
				"&", c => {
					currStatus = "/"; // exit
					return true;
				},
				"%", c => {
					if (!requireAdd()) currStatus = "/"; // exit
					return true;
				},
				"x", c => cont(
					"ret13579", c => {
						if (omitNotes(c)) {
							while (cont(
								"ret13579", c => omitNotes(c),
								",", c => {return true;},
							));
							while (curr() == ",") back();
							return true;
						}
					},
					"<", c => {
						var innerBracketLayer = 1;
						var anyNote = false;
						while (cont(
							"<", c => {innerBracketLayer++; return true;},
							">", c => {innerBracketLayer--; return true;},
							",", c => {return true;},
							"ret13579", c => {if (omitNotes(c)) return anyNote = true;},
						) && innerBracketLayer > 0);
						if (innerBracketLayer > 0) currStatus = "f";
						return anyNote;
					}
				),
				"s", c => {
					if (!cont(
						"2", c => {
							if (has5 || sus2) return false;
							cont("4", c => {
								if (has5 || sus4) return false;
								return sus4 = true;
							});
							return sus2 = true;
						},
						"4", c => {
							if (has5 || sus4) return false;
							cont("2", c => {
								if (has5 || sus2) return false;
								return sus2 = true;
							});
							return sus4 = true;
						}
					)) {
						if (has5 || sus4) return false;
						sus4 = true;
					}
					return true;
				},
				"24", c => addNotes("", c),
				"9et", c => {
					if (has6 || has7 || extended || bracketLayer > 0) return addNotes("", c);
					else {
						has7 = true;
						highestInterval = c;
						return true;
					}
				},
				"5", c => {
					if (has5 || sus2 || sus4) return false;
					return has5 = true;
				},
				"6", c => {
					if (has6 || addNote.includes("A")) return false;
					return has6 = true;
				},
				"7", c => {
					if (has7) return false;
					return has7 = true;
				},
				"<", c => {
					bracketLayer++;
					return peek() != ">" && !(peek() == "w" && idList.charAt(i + 2) == ">");
				},
				">", c => {
					bracketLayer--;
					return bracketLayer >= 0;
				}
			) && !currStatus);
			
			
			if (type == "h" || type == "d") has7 = true;
			var noThird = has5 || sus2 || sus4;
			var maxNum = has7 - noThird + 1;
			if (maxNum < 2 && (seventh || type && thirdAfterType) || maxNum < 1 && third) {
				clearAndReset(seventhPos);
				continue;
			}
			if (sus2) chordNote.push("D");
			function suitable(fifth) {
				if (sus4) chordNote.push("F");
				if (fifth == "G") {
					if (addNote.includes("Gb")) chordNote.push("Gb");
					if (addNoteMandatory[addNote.indexOf("Gb")] && addNoteMandatory[addNote.indexOf("G#")]) chordNote.push("G");
					if (addNote.includes("G#")) chordNote.push("G#");
				} else chordNote.push(fifth);
				if (has6) chordNote.push("A");
			}
			if (type) {
				if (!seventh && thirdAfterType) {
					seventh = third;
					third = null;
				}
				if (type == "o") {
					if (has6 && has7 && !seventh) {
						var j = i;
						while (!"67o".includes(idList.charAt(j))) j--;
						clearAndReset(j);
						continue;
					}
					if (!noThird) chordNote.push(third == "M" ? "E" : "Eb");
					suitable("Gb");
					if (has7) chordNote.push(seventh == "M" ? "B" : seventh == "m" ? "Bb" : "Bbb");
				} else if (type == "'") {
					if (!noThird) chordNote.push(third == "m" ? "Eb" : "E");
					suitable("G#");
					if (has7) chordNote.push(seventh == "M" ? "B" : "Bb");
				} else if (type == "h") {
					if (!noThird) chordNote.push(third == "M" ? "E" : "Eb");
					suitable("Gb");
					chordNote.push(seventh == "M" ? "B" : "Bb");
				} else if (type == "d") {
					if (!noThird) chordNote.push(third == "m" ? "Eb" : "E");
					suitable("G");
					chordNote.push(seventh == "M" ? "B" : "Bb");
				}
			} else {
				if (!noThird) chordNote.push(third == "m" ? "Eb" : "E");
				suitable("G");
				if (has7) chordNote.push(seventh == "M" || !seventh && third == "M" ? "B" : "Bb");
			}
			if (addDSharpPos && chordNote.includes("Eb")) {
				clearAndReset(addDSharpPos);
				continue;
			}
			if (addFFlatPos && chordNote.includes("E")) {
				clearAndReset(addFFlatPos);
				continue;
			}
			if (addASharpPos && chordNote.includes("Bb")) {
				clearAndReset(addASharpPos);
				continue;
			}
			
			if (addNote.includes("Db")) chordNote.push("Db");
			if (addNote.includes("D") || "9et".includes(highestInterval) && addNoteMandatory[addNote.indexOf("Db")] && addNoteMandatory[addNote.indexOf("D#")]) {
				if (chordNote.includes("D")) {
					var j = i;
					while (!"9ets".includes(idList.charAt(j))) j--;
					clearAndReset(j);
					continue;
				} else chordNote.push("D");
			}
			if (addNote.includes("D#")) chordNote.push("D#");
			
			if (addNote.includes("Fb")) chordNote.push("Fb");
			if (addNote.includes("F") || "et".includes(highestInterval) && addNoteMandatory[addNote.indexOf("Fb")] && addNoteMandatory[addNote.indexOf("F#")]) {
				if (chordNote.includes("F")) {
					var j = i;
					while (!"ets".includes(idList.charAt(j))) j--;
					clearAndReset(j);
					continue;
				} else chordNote.push("F");
			}
			if (addNote.includes("F#")) chordNote.push("F#");
			
			if (addNote.includes("Ab")) chordNote.push("Ab");
			if (addNote.includes("A") || highestInterval == "t" && addNoteMandatory[addNote.indexOf("Ab")] && addNoteMandatory[addNote.indexOf("A#")]) {
				if (chordNote.includes("A")) {
					var j = i;
					while (!"t6".includes(idList.charAt(j))) j--;
					clearAndReset(j);
					continue;
				} else chordNote.push("A");
			}
			if (addNote.includes("A#")) chordNote.push("A#");
			
			var failed = false;
			for (var m = 0; m < omitNote.length; m++) {
				if (omitNote[m] == "E") {
					if (chordNote.includes("E")) chordNote.splice(chordNote.indexOf("E"), 1);
					else if (chordNote.includes("Eb")) chordNote.splice(chordNote.indexOf("Eb"), 1);
					else {
						clearAndReset(omitNotePos[m]);
						failed = true;
						break;
					}
				} else if (omitNote[m] == "B") {
					if (seventh) {
						clearAndReset(omitNotePos[m]);
						failed = true;
						break;
					} else if (chordNote.includes("B")) chordNote.splice(chordNote.indexOf("B"), 1);
					else if (chordNote.includes("Bb")) chordNote.splice(chordNote.indexOf("Bb"), 1);
					else if (chordNote.includes("Bbb")) chordNote.splice(chordNote.indexOf("Bbb"), 1);
					else {
						clearAndReset(omitNotePos[m]);
						failed = true;
						break;
					}
				} else if (chordNote.includes(omitNote[m])) chordNote.splice(chordNote.indexOf(omitNote[m]), 1);
				else {
					clearAndReset(omitNotePos[m]);
					failed = true;
					break;
				}
			}
			if (failed) continue;
			
			chordNote = chordNote.map(function(item) {
				return transpose(0, parseContent.transposeTo, transpose(0, isInterval && parseContent.intervalNote, transpose(0, noteObj, item)));
			});
			
			var data = {string: "", name: "", noteString: "", isInterval: isInterval}, slashPos = i;
			while ("w<,".includes(idList.charAt(slashPos - 1))) slashPos--;
			
			if (currStatus == "/") {
				if (peek() == "w") plus();
				plus();
				
				if (curr()) {
					
					var onCurrPos = i, onDetect = false, onNote, onAcci;
					
					if (isInterval && "fb#vX!".includes(curr())) {
						
						onAcci = acciList[curr()];
						while (peek() in acciList) {plus(); onAcci += acciList[curr()];}
						if (peek() && "JKLNPQS".includes(peek())) {
							plus();
							onNote = "JKLNPQS".indexOf(curr()) - 2;
							onDetect = true;
						} else i = onCurrPos;
						
					} else if (!isInterval && "ABCDEFGb".includes(curr())) {
						
						onNote = curr() == "b" ? 6 : idList.charCodeAt(i) - 67;
						onAcci = 0;
						while (peek() in acciList) {plus(); onAcci += acciList[curr()];}
						onDetect = true;
						
					} else if (isInterval && "JKLNPQS".includes(curr())) {
			
						onNote = "JKLNPQS".indexOf(curr()) - 2;
						onAcci = 0;
						onDetect = true;
						
					}
					
					if (onDetect) {
						while (curr() == "w") back();
						var onNoteObj = Note(onNote, onAcci), onNoteUntil = i;
						data.onString = "";
						for (var k = slashPos; k < onCurrPos; k++) data.onString += inputList[k];
						if (isInterval) data.onNoteKey = transpose(0, onNoteObj, parseContent.intervalNote) + "";
						else data.onNoteInterval = transpose(parseContent.intervalNote, onNoteObj).toRoman();
						data.onNoteString = "";
						for (var z = onCurrPos; z <= onNoteUntil; z++) data.onNoteString += inputList[z];
						onNoteObj = transpose(0, parseContent.transposeTo, transpose(0, isInterval && parseContent.intervalNote, onNoteObj));
						var half = onNoteObj.toHalf();
						var inversion = false;
						for (var y = 0; y < chordNote.length; y++) {
							if (chordNote[y].toHalf() == half) {
								chordNote = chordNote.concat(chordNote).slice(y, chordNote.length + y);
								chordNote.first = y && chordNote.length - y;
								inversion = true;
								break;
							}
						}
						if (!inversion) {
							chordNote.unshift(onNoteObj);
							chordNote.first = -1;
						}
					} else {
						back();
						if (curr() == "w") back();
						back();
					}
				} else {
					back();
					if (curr() == "w") back();
					back();
				}
			}
			
			if (!chordNote.first) chordNote.first = 0;
			
			while ("w<,".includes(curr())) back();
			
			for (var x = currPos; x <= i; x++) {
				if (x <= noteUntil) data.noteString += inputList[x];
				else if (x < slashPos) data.name += inputList[x];
				data.string += inputList[x];
			}
			if (isInterval) data.noteKey = transpose(0, noteObj, parseContent.intervalNote) + "";
			else data.noteInterval = transpose(parseContent.intervalNote, noteObj).toRoman();
			chordList.push(Chord(chordNote, data));
			
			function clear(pos) {
				idList = idList.slice(0, pos) + "=" + idList.slice(pos + 1);
			}
			function clearAndReset(pos) {
				clear(pos);
				i = currPos - 1;
			}
			function addNotes(acci, note, acciPos) {
				if ("29".includes(note)) {
					note = "D";
					extended = true;
				} else if ("4e".includes(note)) {
					note = "F";
					extended = true;
				} else if ("6t".includes(note)) {
					note = "A";
					extended = true;
				} else note = "G";
				note += accis[acci];
				if (addNote.includes(note)) return false;
				else {
					if (note == "D" && (sus2 || "9et".includes(highestInterval)) ||
						note == "F" && (sus4 || "et".includes(highestInterval)) ||
						note == "F#" && (addNote.includes("Gb") || "oh".includes(type)) ||
						note == "Ab" && (addNote.includes("G#") || type == "'") ||
						note == "A" && (has6 || highestInterval == "t") ||
						note == "Gb" && (addNote.includes("G#") || addNote.includes("F#") || "oh".includes(type)) ||
						note == "G" ||
						note == "G#" && (addNote.includes("Gb") || addNote.includes("Ab") || type == "'")) {
							if (acci == "b") clear(acciPos || i - 1);
							return false;
						}
					if (note == "D#") addDSharpPos = i;
					else if (note == "Fb") {
						if (acci == "b") clear(acciPos || i - 1);
						addFFlatPos = i;
					} else if (note == "A#") addASharpPos = i;
					addNote.push(note);
					addNoteMandatory.push(mandatory);
					return true;
				}
			}
			
			function omitNotes(note) {
				note = omits[note];
				if (omitNote.includes(note)) return false;
				else {
					omitNote.push(note);
					omitNotePos.push(i);
					return true;
				}
			}
		}
		function cont() {
			var c = peek(), rev = false;
			if (c == "w") {
				plus();
				c = peek();
				rev = true;
			}
			if (!c || c == "=") {
				if (rev) back();
				return false;
			}
			plus();
			for (var k = 0; k < arguments.length; k += 2) {
				if (arguments[k].includes(c)) {
					if (arguments[k + 1](c)) return true;
					else break;
				}
			}
			back();
			if (rev) back();
			return false;
		}
		// ----- Pointer Functions -----
		function prev() {
			return idList.charAt(i - 1);
		}
		function peek() {
			return idList.charAt(i + 1);
		}
		function curr() {
			return idList.charAt(i);
		}
		function plus() {
			i++;
		}
		function back() {
			i--;
		}
		function next() {
			plus();
			return curr();
		}
	}
	return chordList;
}
parseContent.intervalNote = null;
parseContent.transposeTo = null;
if (!String.prototype.includes) String.prototype.includes = function(search, start) {
	return this.indexOf(search, start) != -1;
};
if (!Array.prototype.includes) Array.prototype.includes = function(search, start) {
	return this.indexOf(search, start) != -1;
};
export default { Note, Chord, transpose, parseContent }
