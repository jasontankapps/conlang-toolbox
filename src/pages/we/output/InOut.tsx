import React, { FC } from 'react';

type Input = [number, string, string, string];
type SaveFunc = (text: string) => void;

interface Props {
	words: Input[]
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}
interface SelectableProps {
	original: string
	arrow: string
	result: string
	id: string
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}

const InputToOutput: FC<SelectableProps> = ({original, arrow, result, id, maybeSaveThisWord, savedWordsObject}) => {
	const className = savedWordsObject[result] ? "word saved" : "word";
	return (
		<div className="inputToOutput selectable">
			<span>{original}</span>{' '}
			<span>{arrow}</span>{' '}
			<span className={className} id={id} onClick={() => maybeSaveThisWord(result)}>{result}</span>
		</div>
	);
}

const InOut: FC<Props> = ({words, maybeSaveThisWord, savedWordsObject}) => {
	return (
		<div>{words.map((input) => {
			const [i, original, arrow, result] = input;
			const id = `evolved:inout:${original} ${arrow} ${result}:${i}`;
			return <InputToOutput key={id} id={id} original={original} arrow={arrow} result={result} maybeSaveThisWord={maybeSaveThisWord} savedWordsObject={savedWordsObject} />;
		})}</div>
	);
};

export default InOut;
