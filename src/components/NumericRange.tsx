//Source: https://stackoverflow.com/questions/76658139/typescript-intrange-which-supports-negative-values

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Next = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
type Inc<T extends number> =
	T extends -1 ? 0 :
	`${T}` extends `-${infer N extends number}` ? `-${Dec<N>}` extends
	`${infer M extends number}` ? M : never :
	`${T}` extends `${infer F extends number}${Digit}` ?
	`${T}` extends `${F}${infer D extends Digit}` ?
	`${D extends 9 ? Inc<F> : F}${Next[D]}` extends
	`${infer N extends number}` ? N : never : never :
	T extends 9 ? 10 : Next[T];

type Prev = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8];
type Dec<T extends number> =
	`${T}` extends `-${infer N extends number}` ? `-${Inc<N>}` extends
	`${infer M extends number}` ? M : never :
	`${T}` extends `${infer F extends number}${Digit}` ?
	`${T}` extends `${F}${infer D extends Digit}` ?
	`${D extends 0 ? Dec<F> extends 0 ? "" : Dec<F> : F}${Prev[D]}` extends
	`${infer N extends number}` ? N : never : never :
	T extends 0 ? -1 : Prev[T];

// RangeStartToEndMinusOne<desired start, desired end + 1>
// This will fail if (END - START) >= 1000
type RangeStartToEndMinusOne<START extends number, END extends number, N extends number = never> =
	START extends END ? N : RangeStartToEndMinusOne<Inc<START>, END, START | N>;

export default RangeStartToEndMinusOne;

// These are equivalent:
//    type X = RangeStartToEndMinusOne<-4, 5>;
//    type Y = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;
// NOTE: The high end will cap out at (END - 1)


/* OLD METHOD
// This will fail if (START | END) >= 1000 || (START | END) < 0

type NumericRange<
	START extends number,
	END extends number,
	ARR extends unknown[] = [],
	ACC extends number = never
> = ARR['length'] extends END
	? ACC | START | END
	: NumericRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>;

// These are equivalent:
//    type X = NumericRange<0, 4>;
//    type Y = 0 | 1 | 2 | 3 | 4;

*/
