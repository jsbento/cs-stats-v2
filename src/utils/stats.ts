export const calculateBestFit = (x: number[], y: number[]): number[] => {
    if( x.length !== y.length ) {
        throw new Error("x and y must be the same length");
    }

    const x_mean = x.reduce(( a, b ) => a + b ) / x.length;
    const y_mean = y.reduce(( a, b ) => a + b ) / y.length;
    const xx: number[] = [];
    const xy: number[] = [];
    x.forEach( x_i => {
        xx.push( ( x_i - x_mean ) ** 2 );
        xy.push( ( x_i - x_mean ) * ( y[ x.indexOf( x_i ) ]! - y_mean ) );
    })
    const slope = xy.reduce(( a, b ) => a + b ) / xx.reduce(( a, b ) => a + b );
    const intercept = y_mean - slope * x_mean;
    return x.map( x_i => slope * x_i + intercept );
}