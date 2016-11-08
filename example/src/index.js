let a = x => x + 2

let b = <div a="5">Hello!</div>

let b2 = (
	<div a="5">
		<span>Hello!</span>
	</div>
)

let c = <input />

let d = <Component some-prop='asd' />

let e = <Component some-prop='asd'>asd</Component>

let f = <List items={ [1] } />

let g = ({ items }) => (
	<ol>
		{ items }
	</ol>
)

let h = <Component a="5" { ...props } />

let i = <Component a={ x } />

let j = <Component>{ ...props.children }{ ...props.after }{ ...[1, 2, 3] }</Component>

export default a
