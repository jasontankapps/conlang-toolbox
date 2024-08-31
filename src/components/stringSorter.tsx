import { SortLanguage, SortObject, SortSensitivity } from "../store/types";

interface OrderLogic {
	[key: string]: number
}

function recurseSplit (input: string, incomingSplits: string[]) {
	// returns ['a','r','r','a','y','of','characters']
	const output: string[] = [];
	const splitters = incomingSplits.slice();
	const currentSplitter: string = splitters.shift()!;
	const theSplit = input.split(currentSplitter);
	theSplit.forEach((line, i) => {
		const chars: string[] = [];
		// ignore blank lines
		if(line) {
			if(splitters.length > 0) {
				// Use any remaining splitters
				chars.push(...recurseSplit(line, splitters));
			} else {
				// No more splitters, so separate into single characters
				chars.push(...line.split(''));
			}
		}
		if(i > 0) {
			// Add the splitter character in its correct position
			output.push(currentSplitter);
		}
		// Push the rest of the characters
		output.push(...chars);
	});
	return output;
}

const basicSorter = (a: string, b: string, sortLanguage: string, sensitivity: SortSensitivity) => {
	// Basic search function. Falls back to "old" JS method if needed.
	if(sortLanguage !== "unicode" && a.localeCompare) {
		return a.localeCompare(
			b,
			sortLanguage,
			{usage: 'sort', sensitivity: sensitivity || "variant" }
		);
	}
	return a === b ? 0 : (a < b ? -1 : 1);
};

// The main function
function makeSorter (
	sortLanguageDefault: SortLanguage,
	sensitivityDefault: SortSensitivity,
	obj: SortObject | undefined = undefined
) {
	if(!obj) {
		// Just use the default language and sensitivity
		return (a: string, b: string) => basicSorter(
			a,
			b,
			sortLanguageDefault,
			sensitivityDefault
		);
	}
	const {
		sortLanguage = sortLanguageDefault,
		sensitivity = sensitivityDefault,
		customAlphabet,
		customizations,
		multiples
	} = obj;
	const basicSort = (a: string, b: string) => basicSorter(
		a,
		b,
		sortLanguage,
		sensitivity
	);
	if(!(customAlphabet || customizations)) {
		// Simple sort
		return basicSort;
	}
	// Create a function to split strings into their component characters
	const splitter = (multiples && multiples.length > 0) ?
		(input: string) => recurseSplit(input, multiples)
	:
		(input: string) => input.split('')
	;
	// Create any needed comparison functions
	const functions: ((a: string, b: string) => number)[] = [];
	if(customAlphabet) {
		// Create a comparison function for a custom alphabet
		const logic: OrderLogic = {};
		customAlphabet.forEach((char, i) => logic[char] = i+1);
		functions.push(
			(a: string, b: string) => (logic[a] || NaN) - (logic[b] || NaN)
		);
	}
	if(customizations && customizations.length > 0) {
		// Create a comparison function for every given relation and equality
		customizations.forEach(object => {
			if("equals" in object) {
				const { base, equals } = object;
				const logic: OrderLogic = {};
				logic[base] = 1;
				equals.forEach(char => logic[char] = 1);
				functions.push(
					(a: string, b: string) =>
						logic[a] && logic[b] ? 0 : NaN
				);
			} else {
				const { base, pre, post } = object;
				const basePos = pre.length + 1;
				const logic: OrderLogic = {};
				pre.forEach((char, i) => logic[char] = i+1);
				logic[base] = basePos;
				post.forEach((char, i) => logic[char] = basePos+i+1);
				functions.push(
					(a: string, b: string) =>
						(logic[a] || NaN) - (logic[b] || NaN)
				);
			}
		});
	}
	return (a: string, b: string) => {
		const splitA = splitter(a);
		const splitB = splitter(b);
		while(splitA.length && splitB.length) {
			let found = false;
			let result: number = 0;
			const x = splitA.shift()!;
			const y = splitB.shift()!;
			functions.every((func) => {
				const res = func(x, y);
				if (isNaN(res)) {
					// Function did not give a result
					// Keep loop going
					return true;
				}
				// Mark that we got a result
				found = true;
				// Save that result
				result = res;
				// End loop
				return false;
			});
			// Did we find anything?
			if(!found) {
				// Nothing found; use basic sort
				result = basicSort(x, y);
			}
			// If we got an unequal result, stop right here
			if(result) {
				return result;
			}
			// Continue on to the next set of characters...
		}
		// If we got this far, then we ran out of letters in one or both words.
		if(splitA.length) {
			// B is shorter
			return 1;
		} else if (splitB.length) {
			// A is shorter
			return -1;
		}
		// Equal
		return 0;
	};
}

export default makeSorter;

/*
1) Alter input string to a "sortable" string using only English letters
2) Sort using these strings

// final unicode seems to be U+10FFFD can that be used?

const FINAL_CHAR = String.fromCodePoint(0x10FFFF);
const original = "ǡ";
const alteration = new RegExp(original, "g");
const replacement = "a" + FINAL_CHAR;
const restoration = new RegExp(replacement, "g");
const unsorted = input.map(x => x.replace(alteration, replacement));
unsorted.sort();
const output = unsorted.map(x => x.replace(restoration, original));

const quickSortAlgo = (input: any[]) => {
	if (input.length <= 1) {
		return input;
	}
	const origArray = input.slice();
	const left: any[] = [];
	const right: any[] = [];
	const newArray: any[] = [];
	const pivot = origArray.pop();
	const length = origArray.length;
	for (var i = 0; i < length; i++) {
		if (origArray[i] <= pivot) {
			left.push(origArray[i]);
		} else {
			right.push(origArray[i]);
		}
	}
	const lefty: any[] = quickSortAlgo(left);
	const righty: any[] = quickSortAlgo(right);
	return newArray.concat(lefty, pivot, righty);
}
*/
