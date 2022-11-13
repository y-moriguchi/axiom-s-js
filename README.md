# Axiom-S-js

Axiom-S-js is a library treating S-Expression based lists by JavaScript.  
Expression of "cons pair" is given as fundamental functions or an "axiom of S-expression".  

## How to use

You can use Axiom-S-js by calling AxiomS function with fundamental functions which treats S-expression.
An example shown as follows is S-expression as function which dispatches by message to get head or tail.

```javascript
const s = AxiomS({
    pair: (h, t) => msg => msg === "head" ? h : msg === "tail" ? t : s.error(msg, "Invalid message"),
    head: p => p("head"),
    tail: p => p("tail"),
    isPair: p => typeof p === "function",
    nil: null
});
```

The fundamental functions is given by object whose properties have showns as follow table.

|Properties|Description|
|:---|:----|
|pair|creates "cons pair"|
|head|gets head of the list (car)|
|tail|gets tail of the list (cdr)|
|isPair|returns true if the argument is expression of pair|
|isAtom|returns true if the argument is expression of atom|
|nil|expression of nil(empty list)|

One of isPair or isAtom must be defined.

If you do not give fundamental functions, "cons pair" is given by an array whose length is 2.

## Example

```javascript
const s = AxiomS();

function permutations(set) {
    return s.isNull(set)
           ? s.list(null)
           : s.flatmap(x => s.map(p => s.pair(x, p), permutations(remove(x, set))), set);
}

// displays ((1 2 3) (1 3 2) (2 1 3) (2 3 1) (3 1 2) (3 2 1))
console.log(s.toString(permutations(s.list(1, 2, 3))));
```


