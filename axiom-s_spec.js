/*
 * This source code is under the Unlicense
 */
describe("AxiomS", function () {
    beforeEach(function () {
    });

    function testAxiom(s, nil) {
        it("toS", function() {
            expect(s.isEqual(s.list(1, 2, 3), s.toS([1, 2, 3]))).toBeTruthy();
            expect(s.isEqual(s.list(1), s.toS([1]))).toBeTruthy();
            expect(s.isEqual(nil, s.toS([]))).toBeTruthy();
        });

        it("toArray", function() {
            expect(s.toArray(s.list(1, 2, 3))).toEqual([1, 2, 3]);
            expect(s.toArray(s.list(1))).toEqual([1]);
            expect(s.toArray(nil)).toEqual([]);
            expect(() => s.toArray(s.pair(1, 2))).toThrow();
        });

        it("toSDeep", function() {
            expect(s.isEqual(s.list(1, 2, 3), s.toSDeep([1, 2, 3]))).toBeTruthy();
            expect(s.isEqual(s.list(1), s.toSDeep([1]))).toBeTruthy();
            expect(s.isEqual(nil, s.toSDeep([]))).toBeTruthy();
            expect(s.isEqual(s.list(s.list(1, 2), 2, 3), s.toSDeep([[1, 2], 2, 3]))).toBeTruthy();
            expect(s.isEqual(s.list(1, s.list(2, 3), 3), s.toSDeep([1, [2, 3], 3]))).toBeTruthy();
        });

        it("toArrayDeep", function() {
            expect(s.toArrayDeep(s.list(1, 2, 3))).toEqual([1, 2, 3]);
            expect(s.toArrayDeep(s.list(1))).toEqual([1]);
            expect(s.toArrayDeep(nil)).toEqual([]);
            expect(() => s.toArrayDeep(s.pair(1, 2))).toThrow();
            expect(s.toArrayDeep(s.list(s.list(1, 2), 2, 3))).toEqual([[1, 2], 2, 3]);
            expect(s.toArrayDeep(s.list(1, s.list(2, 3), 3))).toEqual([1, [2, 3], 3]);
        });

        it("map", function() {
            expect(s.isEqual(s.map(x => x * x, s.list(1, 2, 3)), s.list(1, 4, 9))).toBeTruthy();
            expect(s.isEqual(s.map((x, y) => x / y, s.list(6, 6, 4), s.list(2, 3, 4, 5)), s.list(3, 2, 1))).toBeTruthy();
            expect(s.isEqual(s.map((x, y) => x / y, s.list(6, 6, 4, 0), s.list(2, 3, 4)), s.list(3, 2, 1))).toBeTruthy();
            expect(s.isEqual(s.map((x, y) => x / y, s.list(), s.list(2, 3, 4, 5)), s.list())).toBeTruthy();
            expect(s.isEqual(s.map((x, y) => x / y, s.list(6, 6, 4, 0), s.list()), s.list())).toBeTruthy();
            expect(s.isEqual(s.map((x, y) => x / y, s.list(6), s.list(2)), s.list(3))).toBeTruthy();
            expect(s.isEqual(s.map((x, y, z) => x + y + z, s.list(1, 2), s.list(2, 3), s.list(3, 4)), s.list(6, 9))).toBeTruthy();
            expect(() => s.map(x => x * x, s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(() => s.map((x, y) => x * y, s.list(1, 2, 3, 4, 5), s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(() => s.map((x, y) => x * y, s.pair(1, s.pair(2, s.pair(3, 4))), s.list(1, 2, 3, 4, 5))).toThrow();
        });

        it("filter", function() {
            expect(s.isEqual(s.filter(x => x % 2 === 0, s.list(1, 2, 3, 4)), s.list(2, 4))).toBeTruthy();
            expect(s.isEqual(s.filter(x => x % 2 === 0, s.list()), s.list())).toBeTruthy();
            expect(() => s.filter(x => x % 2 === 0, s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
        });

        it("fold", function() {
            expect(s.isEqual(s.fold((prev, now) => s.pair(now, prev), nil, s.list(3, 2, 1)), s.list(1, 2, 3))).toBeTruthy();
            expect(s.isEqual(s.fold((prev, now) => s.pair(now, prev), nil, s.list()), s.list())).toBeTruthy();
            expect(() => s.fold((prev, now) => prev + now, s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
        });

        it("append", function() {
            expect(s.isEqual(s.append(s.list(1, 2), s.list(3), nil, s.list(4, 5, 6)), s.list(1, 2, 3, 4, 5, 6))).toBeTruthy();
            expect(s.isEqual(s.append(s.list(1, 2)), s.list(1, 2))).toBeTruthy();
            expect(s.isEqual(s.append(), s.list())).toBeTruthy();
            expect(() => s.append(s.list(1, 2), nil, s.pair(1, s.pair(2, 3)), s.list(1))).toThrow();
        });

        it("isList", function() {
            expect(s.isList(s.list(1, 2, 3))).toBeTruthy();
            expect(s.isList(nil)).toBeTruthy();
            expect(s.isList(1)).toBeFalsy();
            expect(s.isList(s.pair(1, s.pair(2, s.pair(3, 4))))).toBeFalsy();
        });

        it("length", function() {
            expect(s.length(s.list(1, 2, 3))).toBe(3);
            expect(s.length(nil)).toBe(0);
            expect(() => s.length(1)).toThrow();
            expect(() => s.length(s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
        });

        it("reverse", function() {
            expect(s.isEqual(s.reverse(s.list(1, 2, 3)), s.list(3, 2, 1))).toBeTruthy();
            expect(s.isEqual(s.reverse(nil), nil)).toBeTruthy();
            expect(() => s.reverse(1)).toThrow();
            expect(() => s.reverse(s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
        });

        it("listTail", function() {
            expect(s.isEqual(s.listTail(s.list(1, 2, 3, 4), 0), s.list(1, 2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.listTail(s.list(1, 2, 3, 4), 1), s.list(2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.listTail(s.list(1, 2, 3, 4), 3), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.listTail(s.list(1, 2, 3, 4), 4), s.list())).toBeTruthy();
            expect(() => s.listTail(s.list(1, 2, 3, 4), 5)).toBeTruthy();
        });

        it("listRef", function() {
            expect(s.listRef(s.list(1, 2, 3, 4), 0)).toBe(1);
            expect(s.listRef(s.list(1, 2, 3, 4), 1)).toBe(2);
            expect(s.listRef(s.list(1, 2, 3, 4), 3)).toBe(4);
            expect(() => s.listRef(s.list(1, 2, 3, 4), 4)).toThrow();
            expect(() => s.listRef(s.list(1, 2, 3, 4), 5)).toThrow();
            expect(() => s.listRef(s.list(1, 2, 3, 4), -1)).toThrow();
            expect(() => s.listRef(s.list(1, 2, 3, 4), 1.5)).toThrow();
        });

        it("memq", function() {
            expect(s.isEqual(s.memq(1, s.list(1, 2, 3, 4)), s.list(1, 2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.memq(2, s.list(1, 2, 3, 4)), s.list(2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.memq(4, s.list(1, 2, 3, 4)), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.memq(5, s.list(1, 2, 3, 4)), nil)).toBeTruthy();
            expect(() => s.memq(s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(s.isEqual(s.memq(s.list(2, 3), s.list(1, s.list(2, 3), 3, 4)), nil)).toBeTruthy();
        });

        it("member", function() {
            expect(s.isEqual(s.member(1, s.list(1, 2, 3, 4)), s.list(1, 2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.member(2, s.list(1, 2, 3, 4)), s.list(2, 3, 4))).toBeTruthy();
            expect(s.isEqual(s.member(4, s.list(1, 2, 3, 4)), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.member(5, s.list(1, 2, 3, 4)), nil)).toBeTruthy();
            expect(() => s.member(s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(s.isEqual(s.member(s.list(2, 3), s.list(1, s.list(2, 3), 3, 4)), s.list(s.list(2, 3), 3, 4))).toBeTruthy();
        });

        it("assq", function() {
            expect(s.isEqual(s.assq(1, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(1, "a"))).toBeTruthy();
            expect(s.isEqual(s.assq(2, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(2, "b"))).toBeTruthy();
            expect(s.isEqual(s.assq(3, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(3, "c"))).toBeTruthy();
            expect(s.isEqual(s.assq(4, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), nil)).toBeTruthy();
            expect(() => s.assq(s.pair(s.pair(1, 2), s.pair(s.pair(2, 3), s.pair(3, 4))))).toThrow();
            expect(s.isEqual(s.assq(s.list(2, 3), s.list(s.pair(1, "a"), s.pair(s.list(2, 3), "b"), s.pair(3, "c"))), nil)).toBeTruthy();
        });

        it("assoc", function() {
            expect(s.isEqual(s.assoc(1, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(1, "a"))).toBeTruthy();
            expect(s.isEqual(s.assoc(2, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(2, "b"))).toBeTruthy();
            expect(s.isEqual(s.assoc(3, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), s.pair(3, "c"))).toBeTruthy();
            expect(s.isEqual(s.assoc(4, s.list(s.pair(1, "a"), s.pair(2, "b"), s.pair(3, "c"))), nil)).toBeTruthy();
            expect(() => s.assoc(s.pair(s.pair(1, 2), s.pair(s.pair(2, 3), s.pair(3, 4))))).toThrow();
            expect(s.isEqual(s.assoc(s.list(2, 3), s.list(s.pair(1, "a"), s.pair(s.list(2, 3), "b"), s.pair(3, "c"))), s.pair(s.list(2, 3), "b"))).toBeTruthy();
        });

        it("iota", function() {
            expect(s.isEqual(s.iota(1, 3), s.list(1, 2, 3))).toBeTruthy();
            expect(s.isEqual(s.iota(1, 1), s.list(1))).toBeTruthy();
            expect(s.isEqual(s.iota(1, 5, 2), s.list(1, 3, 5))).toBeTruthy();
        });

        it("flatmap", function() {
            expect(s.isEqual(s.flatmap(x => s.list(x * x), s.list(1, 2, 3)), s.list(1, 4, 9))).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y) => s.list(x / y), s.list(6, 6, 4), s.list(2, 3, 4, 5)), s.list(3, 2, 1))).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y) => s.list(x / y), s.list(6, 6, 4, 0), s.list(2, 3, 4)), s.list(3, 2, 1))).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y) => s.list(x / y), s.list(), s.list(2, 3, 4, 5)), s.list())).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y) => s.list(x / y), s.list(6, 6, 4, 0), s.list()), s.list())).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y) => s.list(x / y), s.list(6), s.list(2)), s.list(3))).toBeTruthy();
            expect(s.isEqual(s.flatmap((x, y, z) => s.list(x + y + z), s.list(1, 2), s.list(2, 3), s.list(3, 4)), s.list(6, 9))).toBeTruthy();
            expect(() => s.flatmap(x => s.list(x * x), s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(() => s.flatmap((x, y) => s.list(x * y), s.list(1, 2, 3, 4, 5), s.pair(1, s.pair(2, s.pair(3, 4))))).toThrow();
            expect(() => s.flatmap((x, y) => s.list(x * y), s.pair(1, s.pair(2, s.pair(3, 4))), s.list(1, 2, 3, 4, 5))).toThrow();
            expect(s.isEqual(
                s.flatmap(x => s.map(y => s.list(x, y), s.iota(1, x - 1)), s.iota(1, 4)),
                s.list(s.list(2, 1), s.list(3, 1), s.list(3, 2), s.list(4, 1), s.list(4, 2), s.list(4, 3)))).toBeTruthy();
        });
    }

    describe("testing fundamental functions", function () {
        const s = AxiomS();
        const nil = null;

        it("isEqual", function() {
            expect(s.isEqual(nil, nil)).toBeTruthy();
            expect(s.isEqual(nil, 1)).toBeFalsy();
            expect(s.isEqual(1, nil)).toBeFalsy();
            expect(s.isEqual([1, 2], nil)).toBeFalsy();
            expect(s.isEqual(nil, [1, 2])).toBeFalsy();
            expect(s.isEqual(1, 1)).toBeTruthy();
            expect(s.isEqual(1, 2)).toBeFalsy();
            expect(s.isEqual(2, 1)).toBeFalsy();
            expect(s.isEqual([1, 2], 1)).toBeFalsy();
            expect(s.isEqual(1, [1, 2])).toBeFalsy();
            expect(s.isEqual([1, 2], [1, 2])).toBeTruthy();
            expect(s.isEqual([2, 2], [1, 2])).toBeFalsy();
            expect(s.isEqual([1, 2], [2, 2])).toBeFalsy();
            expect(s.isEqual([1, 1], [1, 2])).toBeFalsy();
            expect(s.isEqual([1, 2], [1, 1])).toBeFalsy();
            expect(s.isEqual([1, [2, [3, nil]]], [1, [2, [3, nil]]])).toBeTruthy();
            expect(s.isEqual([1, [[2, [3, nil]], [3, nil]]], [1, [[2, [3, nil]], [3, nil]]])).toBeTruthy();
        });

        it("list", function() {
            expect(s.isEqual(s.list(1, 2, 3), [1, [2, [3, nil]]])).toBeTruthy();
            expect(s.isEqual(s.list(1), [1, nil])).toBeTruthy();
            expect(s.isEqual(s.list(), nil)).toBeTruthy();
        });

        it("cxxr", function() {
            const data = s.list(s.pair(1, 2), 3);

            expect(s.isEqual(s.caar(data), 1)).toBeTruthy();
            expect(s.isEqual(s.cadr(data), 3)).toBeTruthy();
            expect(s.isEqual(s.cdar(data), 2)).toBeTruthy();
            expect(s.isEqual(s.cddr(data), nil)).toBeTruthy();
        });

        it("cxxxr", function() {
            const data = s.list(s.list(s.pair(1, 2), 3, 4), s.pair(5, 6), 7);

            expect(s.isEqual(s.caaar(data), 1)).toBeTruthy();
            expect(s.isEqual(s.caadr(data), 5)).toBeTruthy();
            expect(s.isEqual(s.cadar(data), 3)).toBeTruthy();
            expect(s.isEqual(s.caddr(data), 7)).toBeTruthy();
            expect(s.isEqual(s.cdaar(data), 2)).toBeTruthy();
            expect(s.isEqual(s.cdadr(data), 6)).toBeTruthy();
            expect(s.isEqual(s.cddar(data), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.cdddr(data), nil)).toBeTruthy();
        });

        it("cxxxar", function() {
            const data = s.list(s.list(s.list(s.pair(1, 2), 3, 4), s.pair(5, 6), 7));

            expect(s.isEqual(s.caaaar(data), 1)).toBeTruthy();
            expect(s.isEqual(s.caadar(data), 5)).toBeTruthy();
            expect(s.isEqual(s.cadaar(data), 3)).toBeTruthy();
            expect(s.isEqual(s.caddar(data), 7)).toBeTruthy();
            expect(s.isEqual(s.cdaaar(data), 2)).toBeTruthy();
            expect(s.isEqual(s.cdadar(data), 6)).toBeTruthy();
            expect(s.isEqual(s.cddaar(data), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.cdddar(data), nil)).toBeTruthy();
        });

        it("cxxxdr", function() {
            const data = s.pair(0, s.list(s.list(s.pair(1, 2), 3, 4), s.pair(5, 6), 7));

            expect(s.isEqual(s.caaadr(data), 1)).toBeTruthy();
            expect(s.isEqual(s.caaddr(data), 5)).toBeTruthy();
            expect(s.isEqual(s.cadadr(data), 3)).toBeTruthy();
            expect(s.isEqual(s.cadddr(data), 7)).toBeTruthy();
            expect(s.isEqual(s.cdaadr(data), 2)).toBeTruthy();
            expect(s.isEqual(s.cdaddr(data), 6)).toBeTruthy();
            expect(s.isEqual(s.cddadr(data), s.list(4))).toBeTruthy();
            expect(s.isEqual(s.cddddr(data), nil)).toBeTruthy();
        });
    });

    describe("testing default axiom", function () {
        testAxiom(AxiomS(), null);
    });

    describe("testing customize axiom", function () {
        const nil = {};
        const s = AxiomS({
            pair: (h, t) => msg => msg === "head" ? h : msg === "tail" ? t : error(msg, "Invalid message"),
            head: p => p("head"),
            tail: p => p("tail"),
            isPair: p => typeof p === "function",
            nil: nil
        });

        testAxiom(s, nil);
    });

    describe("testing serialize and parsing", function () {
        const s = AxiomS();
        const nil = null;

        it("toString", function() {
            expect(s.toString(nil)).toBe("null");
            expect(s.toString(1)).toBe("1");
            expect(s.toString(s.pair(1, 2))).toBe("(1 . 2)");
            expect(s.toString(s.list(1))).toBe("(1)");
            expect(s.toString(s.list(1, 2))).toBe("(1 2)");
            expect(s.toString(s.list(1, 2, 3))).toBe("(1 2 3)");
            expect(s.toString(s.list(1, s.list(2, 3), 3))).toBe("(1 (2 3) 3)");
        });

        it("parse", function() {
            expect(s.isEqual(s.parse("()"), nil)).toBeTruthy();
            expect(s.isEqual(s.parse("1"), "1")).toBeTruthy();
            expect(s.isEqual(s.parse("\"1 2\""), "\"1 2\"")).toBeTruthy();
            expect(s.isEqual(s.parse("'1 2'"), "'1 2'")).toBeTruthy();
            expect(s.isEqual(s.parse("(1)"), s.list("1"))).toBeTruthy();
            expect(s.isEqual(s.parse("(1 2)"), s.list("1", "2"))).toBeTruthy();
            expect(s.isEqual(s.parse("(1 2 3)"), s.list("1", "2", "3"))).toBeTruthy();
            expect(s.isEqual(s.parse("(1 . 2)"), s.pair("1", "2"))).toBeTruthy();
            expect(s.isEqual(s.parse("(1 2 . 3)"), s.pair("1", s.pair("2", "3")))).toBeTruthy();
            expect(s.isEqual(s.parse("((1 2) 3)"), s.list(s.list("1", "2"), "3"))).toBeTruthy();
            expect(s.isEqual(s.parse("   (  \t (  1 \t 2\n) \t\n 3 \t ) \t\n"), s.list(s.list("1", "2"), "3"))).toBeTruthy();
            expect(() => s.parse("")).toThrow();
            expect(() => s.parse(" \t\n ")).toThrow();
            expect(() => s.parse("\"1 2")).toThrow();
            expect(() => s.parse("1 2\"")).toThrow();
            expect(() => s.parse("'1 2")).toThrow();
            expect(() => s.parse("1 2'")).toThrow();
            expect(() => s.parse("\"1 2\n\"")).toThrow();
            expect(() => s.parse("'1 2\n'")).toThrow();
            expect(() => s.parse("(1")).toThrow();
            expect(() => s.parse("1)")).toThrow();
            expect(() => s.parse("(1 . 2")).toThrow();
            expect(() => s.parse("(1 . 2 3)")).toThrow();
            expect(() => s.parse("(1 (2 3) 4")).toThrow();
            expect(() => s.parse("1 (2 3) 4)")).toThrow();
            expect(() => s.parse("1 2")).toThrow();
        });
    });
});

