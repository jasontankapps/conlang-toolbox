import React, { ReactElement } from "react"

export interface Block {
	arrow?: string
	serif?: boolean
	simple?: string[]
	reverse?: string[]
	complex?: string[]
	important?: string
	unimportant?: string
}
export const parseBlock = (input: Block, arrow: string) => {
	const {
		serif,
		simple,
		reverse,
		complex,
		arrow: subArrow = "->",
		important = "!",
		unimportant = "$"
	} = input;

	const className = serif ? "emphasizedSection serifChars" : "emphasizedSection";
	const arrowReplace = new RegExp(subArrow, "g");
	let counter = 0;
	if(simple) {
		const classes = [ "importantUnit", "unimportantUnit" ];
		const output: ReactElement[] = simple.map((line, i) => {
			return <span key={`spanner/simple/${i}/${line}`} className={classes[i % 2]}>{line.replace(arrowReplace, arrow)}</span>;
		});
		return <span className={className}>{output}</span>;
	} else if (reverse) {
		const classes = [ "unimportantUnit", "importantUnit" ];
		const output: ReactElement[] = reverse.map((line, i) => {
			return <span key={`spanner/reverse/${i}/${line}`} className={classes[i % 2]}>{line.replace(arrowReplace, arrow)}</span>;
		});
		return <span className={className}>{output}</span>;
	} else if (complex) {
		const output: ReactElement[] = [];
		const max = complex.length - 1;
		complex.forEach((line, i) => {
			const separateImportant = (line.replace(arrowReplace, arrow)).split(important);
			separateImportant.forEach((bit, i) => {
				if(!bit) {
					return;
				} else if (i % 2) {
					// important bits are on the odd numbers
					output.push(<span key={`spanner/complex/imp/${i}/${line}/${counter++}`} className="importantUnit">{bit}</span>);
					return;
				}
				// Check for unimportant bits
				const separateUnimportant = bit.split(unimportant);
				separateUnimportant.forEach((bit, i) => {
					if(!bit) {
						return;
					} else if (i % 2) {
						// unimportant bits are on the odd numbers
						output.push(<span key={`spanner/complex/unimp/${i}/${line}/${counter++}`} className="unimportantUnit">{bit}</span>);
						return;
					}
					// Plain text
					output.push(<React.Fragment key={`spanner/complex/plain/${i}/${line}/${counter++}`}>{bit}</React.Fragment>)
				});
			});
			if(i !== max) {
				output.push(<br key={`br/complex/${i}/${line}`} />);
			}
		});
		return <span className={className}>{output}</span>;
	}
	// error... ignore
	return <></>;
};
export type BlockStorage = { [key: string]: ReactElement };
