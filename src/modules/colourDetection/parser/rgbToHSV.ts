export default function(red: number = 0, green: number = 0, blue: number = 0) {
  let r = red;
  let g = green;
  let b = blue;
	if( r<0 ) r=0;
	if( g<0 ) g=0;
	if( b<0 ) b=0;
  if( r>255 ) r=255;
  if( g>255 ) g=255;
  if( b>255 ) b=255;
 	r/=255;
 	g/=255;
 	b/=255;
	const M = Math.max(r, g, b);
	const m = Math.min(r, g, b);
	const C = M - m;
  let h = (r-g) / C+4;
	if( C==0 ) {
    h=0;
  }
	else if ( M==r ) {
    h=((g-b)/C)%6;
  }
	else if( M==g ) {
    h=(b-r)/C+2
  }
	h*=60;
	if( h<0 ) {
    h+=360
  }
	let v = M; /// value
  let s = C/v;
	if ( v==0 ) {
    s = 0
  }
	s*=100;
	v*=100;
  return {
    h: h.toFixed(0),
    s: s.toFixed(1),
    v: v.toFixed(1)
  }
}
