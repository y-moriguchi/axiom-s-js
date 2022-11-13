/*
 * This source code is under the Unlicense
 */
function AxiomS(opt) {
    const undef = void 0;
    const isOptFalsy = !opt ||
        (!opt.pair &&
         !opt.head &&
         !opt.tail &&
         !(opt.isPair || opt.isAtom) &&
         !opt.nil);

    if(!(isOptFalsy ||
            (opt.pair &&
             opt.head &&
             opt.tail &&
             (opt.isPair || opt.isAtom) &&
             opt.nil))) {
        throw new Error("Invalid pair function");
    }

    function error(object, message) {
        throw new Error(message + ": " + object);
    }

    const pair = !isOptFalsy ? opt.pair : (h, t) => [h, t];
    const head = !isOptFalsy ? opt.head : p => isPair(p) ? p[0] : error(p, "Pair required");
    const tail = !isOptFalsy ? opt.tail : p => isPair(p) ? p[1] : error(p, "Pair required");
    const isPair = !isOptFalsy && opt.isPair
                   ? opt.isPair
                   : !isOptFalsy && opt.isAtom
                   ? p => !isAtom(p)
                   : p => Array.isArray(p) && p[0] !== undef && p[1] !== undef && p.length === 2;
    const nil = !isOptFalsy ? opt.nil : null;

    const isNull = opt && opt.isNull ? opt.isNull : p => p === nil;
    const atomToString = opt && opt.atomToString ? opt.atomToString : a => a === nil ? "null" : a.toString();
    const parseAtom = opt && opt.parseAtom  ? opt.parseAtom : x => x;

    function toS(array) {
        function loop(i) {
            return i === array.length
                   ? nil
                   : pair(array[i], loop(i + 1));
        }
        return loop(0);
    }

    function toArray(s) {
        return isNull(s)
               ? []
               : !isPair(s)
               ? error(s, "Proper list required")
               : [head(s)].concat(toArray(tail(s)));
    }

    function toSDeep(array) {
        function loop(i) {
            return i === array.length
                   ? nil
                   : Array.isArray(array[i])
                   ? pair(toSDeep(array[i]), loop(i + 1))
                   : pair(array[i], loop(i + 1));
        }
        return loop(0);
    }

    function toArrayDeep(s) {
        return isNull(s)
               ? []
               : !isPair(s)
               ? error(s, "Proper list required")
               : isPair(head(s))
               ? [toArrayDeep(head(s))].concat(toArrayDeep(tail(s)))
               : [head(s)].concat(toArrayDeep(tail(s)));
    }

    function isEqual(list1, list2) {
        if(isNull(list1)) {
            return isNull(list2);
        } else if(!isPair(list1)) {
            return !isNull(list2) && !isPair(list2) && list1 === list2;
        } else {
            return isNull(list2) || !isPair(list2)
                   ? false
                   : isEqual(head(list1), head(list2)) && isEqual(tail(list1), tail(list2));
        }
    }

    function map(f, ...args) {
        const arglist = toS(args);

        function getArgsArray(f, list) {
            if(isNull(list)) {
                return [];
            } else {
                const array = getArgsArray(f, tail(list));

                return isNull(array)
                       ? nil
                       : isNull(head(list))
                       ? nil
                       : !isPair(head(list))
                       ? error(head(list), "Proper list required")
                       : [f(head(list))].concat(array);
            }
        }

        const headsArray = getArgsArray(head, arglist);

        return isNull(arglist)
               ? nil
               : isNull(headsArray)
               ? nil
               : pair(f.apply(null, headsArray), map.apply(null, [f].concat(getArgsArray(tail, arglist))));
    }

    function filter(pred, list) {
        return isNull(list)
               ? nil
               : !isPair(list)
               ? error(list, "Proper list required")
               : pred(head(list))
               ? pair(head(list), filter(pred, tail(list)))
               : filter(pred, tail(list));
    }

    function fold(f, init, list) {
        return isNull(list)
               ? init
               : !isPair(list)
               ? error(list, "Proper list required")
               : fold(f, f(init, head(list)), tail(list));
    }

    function append(...args) {
        const arglist = toS(args);

        function appends(now, arglist) {
            return !isNull(now) && !isPair(now)
                   ? error(now, "Proper list required")
                   : !isNull(now)
                   ? pair(head(now), appends(tail(now), arglist))
                   : isNull(arglist)
                   ? nil
                   : appends(head(arglist), tail(arglist));
        }
        return isNull(arglist)
               ? nil
               : appends(head(arglist), tail(arglist));
    }

    function isList(list) {
        return isNull(list)
               ? true
               : !isPair(list)
               ? false
               : isList(tail(list));
    }

    function length(list) {
        return fold((init, now) => init + 1, 0, list);
    }

    function reverse(list) {
        return fold((init, now) => pair(now, init), nil, list);
    }

    function listTail(list, k) {
        return k <= 0
               ? list
               : !isPair(list)
               ? error(list, "Length too short")
               : listTail(tail(list), k - 1);
    }

    function listRef(list, k) {
        function loop(list1, m) {
            return !isPair(list1)
                   ? error(k, "Length too short")
                   : m === 0
                   ? head(list1)
                   : loop(tail(list1), m - 1);
        }

        return Number.isSafeInteger(k) && k >= 0
               ? loop(list, k)
               : error(k, "Non-negative integer required");
    }

    function memassf(f, pickeq, pickresult, obj, list) {
        function loop(list1) {
            return isNull(list1)
                   ? nil
                   : !isPair(list1)
                   ? error(list, "Proper list requried")
                   : f(pickeq(list1), obj)
                   ? pickresult(list1)
                   : loop(tail(list1));
        }
        return loop(list);
    }

    function flatmap(f, ...args) {
        return fold(append, nil, map.apply(null, [f].concat(args)));
    }

    function iota(n, m, step) {
        const st = step ? step : 1;

        return n > m ? nil : pair(n, iota(n + st, m, st));
    }

    function toString(list) {
        function loop(list, delim) {
            return isNull(list)
                   ? ")"
                   : !isPair(list)
                   ? " . " + atomToString(list) + ")"
                   : !isPair(head(list))
                   ? delim + atomToString(head(list)) + loop(tail(list), " ")
                   : delim + toString(head(list)) + loop(tail(list), " ");
        }
        return !isPair(list)
               ? atomToString(list)
               : "(" + loop(list, "");
    }

    function parse(aString) {
        const atom = /"[^\n"]*"|'[^\n']*'|[^\(\)"' \t\n]+/y;
        const space = /[ \t\n]*/y;

        function test(regex, position) {
            regex.lastIndex = position;
            return regex.test(aString);
        }

        function match(regex, position, f) {
            regex.lastIndex = position;
            const result = regex.exec(aString)[0];

            return pair(position + result.length, f(result));
        }

        function spaceLength(position) {
            return position >= aString.length
                   ? position
                   : head(match(space, position, x => x));
        }

        function isFollow(position) {
            const spaceResult = spaceLength(position);

            return aString.charAt(spaceResult) === ")";
        }

        function parseList(position, init) {
            const startSpace = spaceLength(position);

            if(startSpace >= aString.length) {
                error(startSpace, "S-Expression syntax error");
            } else if(isFollow(startSpace)) {
                return pair(startSpace + 1, nil);
            } else if(aString.startsWith(".", startSpace)) {
                if(init) {
                    error(startSpace, "S-Expression syntax error");
                }

                const spaceResult = spaceLength(startSpace + 1);
                const headResult = parseAtomInner(spaceResult);

                return isFollow(head(headResult))
                       ? pair(head(headResult) + 1, tail(headResult))
                       : error(startSpace, "S-Expression syntax error");
            } else {
                const headResult = parseAtomInner(startSpace);
                const spaceResult = spaceLength(head(headResult));
                const tailResult = parseList(spaceResult, false);

                return pair(head(tailResult), pair(tail(headResult), tail(tailResult)));
            }
        }

        function parseAtomInner(position) {
            return position >= aString.length
                   ? error(position, "S-Experssion syntax error")
                   : test(atom, position)
                   ? match(atom, position, x => parseAtom(x))
                   : aString.startsWith("(", position)
                   ? parseList(position + 1, true)
                   : error(position, "S-Expression syntax error");
        }

        const result = parseAtomInner(spaceLength(0));

        return spaceLength(head(result)) < aString.length
               ? error(head(result), "S-Expression syntax error")
               : tail(result);
    }

    const me = {
        pair: pair,
        head: head,
        tail: tail,
        isPair: isPair,
        isNull: isNull,
        getNil: () => nil,
        car: head,
        cdr: tail,
        isEqual: isEqual,
        list: (...args) => toS(args),
        toS: toS,
        toArray: toArray,
        toSDeep: toSDeep,
        toArrayDeep: toArrayDeep,
        caar: x => head(head(x)),
        cadr: x => head(tail(x)),
        cdar: x => tail(head(x)),
        cddr: x => tail(tail(x)),
        caaar: x => head(head(head(x))),
        caadr: x => head(head(tail(x))),
        cadar: x => head(tail(head(x))),
        caddr: x => head(tail(tail(x))),
        cdaar: x => tail(head(head(x))),
        cdadr: x => tail(head(tail(x))),
        cddar: x => tail(tail(head(x))),
        cdddr: x => tail(tail(tail(x))),
        caaaar: x => head(head(head(head(x)))),
        caaadr: x => head(head(head(tail(x)))),
        caadar: x => head(head(tail(head(x)))),
        caaddr: x => head(head(tail(tail(x)))),
        cadaar: x => head(tail(head(head(x)))),
        cadadr: x => head(tail(head(tail(x)))),
        caddar: x => head(tail(tail(head(x)))),
        cadddr: x => head(tail(tail(tail(x)))),
        cdaaar: x => tail(head(head(head(x)))),
        cdaadr: x => tail(head(head(tail(x)))),
        cdadar: x => tail(head(tail(head(x)))),
        cdaddr: x => tail(head(tail(tail(x)))),
        cddaar: x => tail(tail(head(head(x)))),
        cddadr: x => tail(tail(head(tail(x)))),
        cdddar: x => tail(tail(tail(head(x)))),
        cddddr: x => tail(tail(tail(tail(x)))),
        map: map,
        filter: filter,
        fold: fold,
        append: append,
        isList: isList,
        length: length,
        reverse: reverse,
        listTail: listTail,
        listRef: listRef,
        memq: (obj, list) => memassf((x, y) => x === y, head, x => x, obj, list),
        member: (obj, list) => memassf((x, y) => isEqual(x, y), head, x => x, obj, list),
        assq: (obj, list) => memassf((x, y) => x === y, me.caar, head, obj, list),
        assoc: (obj, list) => memassf((x, y) => isEqual(x, y), me.caar, head, obj, list),
        flatmap: flatmap,
        iota: iota,
        toString: toString,
        parse: parse
    }
    return me;
}

