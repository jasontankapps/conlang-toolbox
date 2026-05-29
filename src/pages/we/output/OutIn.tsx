import React, { FC } from 'react';

type Input = [number, string, string, string];
type SaveFunc = (text: string) => void;

interface Props {
	words: Input[]
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}
interface SelectableProps {
	result: string
	arrow: string
	original: string
	id: string
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}

const OutputToInput: FC<SelectableProps> = ({original, arrow, result, id, maybeSaveThisWord, savedWordsObject}) => {
	const className = savedWordsObject[result] ? "word saved" : "word";
	return (
		<div className="outputToInput selectable">
			<span className={className} id={id} onClick={() => maybeSaveThisWord(result)}>{result}</span>{' '}
			<span>{arrow}</span>{' '}
			<span>{original}</span>
		</div>
	);
}

const OutIn: FC<Props> = ({words, maybeSaveThisWord, savedWordsObject}) => {
	return (
		<div>{words.map((input) => {
			const [i, original, arrow, result] = input;
			const id = `evolved:inout:${original} ${arrow} ${result}:${i}`;
			return <OutputToInput key={id} id={id} original={original} arrow={arrow} result={result} maybeSaveThisWord={maybeSaveThisWord} savedWordsObject={savedWordsObject} />;
		})}</div>
	);
};

export default OutIn;
