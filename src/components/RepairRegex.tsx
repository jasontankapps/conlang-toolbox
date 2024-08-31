const repairRegexErrors = (s: string) => {
	var backslash = false,
		curly = false,
		square = false,
		paren = 0,
		output: string[] = [];
	s.split("").forEach(function(q) {
		// If we previously had a backslash, add it to this element.
		if (backslash) {
			backslash = false;
			output.push("\\" + q);
		// If we discover a backslash, set up for the next loop.
		} else if (q === "\\") {
			backslash = true;
			return;
		// If we previously had a square brace, keep looking for its matching end.
		} else if (square) {
			if (q === "]") {
				// Found it.
				square = false;
			}
			output.push(q);
		// If we discover a square brace, pause lookups until we find its end.
		} else if (q === "[") {
			square = true;
			output.push(q);
		// If we previously had a curly brace, keep looking for its matching end.
		} else if (curly) {
			if (q === "}") {
				// Found it.
				curly = false;
			}
			output.push(q);
		// If we discover a curly brace, pause lookups until we find its end.
		} else if (q === "{") {
			curly = true;
			output.push(q);
		// If we previously had an open parenthesis, keep looking for its matching end.
		} else if (paren > 0) {
			if (q === ")") {
				// Found it.
				paren--;
			}
			output.push(q);
		// If we discover an open parenthesis, pause lookups until we find its end.
		} else if (q === "(") {
			paren++;
			output.push(q);
		// Otherwise, treat as plain text (and possibly regex).
		} else {
			output.push(q);
		}
	});
	// Check for and insert missing end braces.
	if (square) {
		output.push("]");
	}
	if (curly) {
		output.push("}");
	}
	while (paren > 0) {
		output.push(")");
		paren--;
	}
	return output.join("");
}

export default repairRegexErrors;
