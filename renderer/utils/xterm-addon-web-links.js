/* eslint-disable */
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.WebLinksAddon = t())
    : (e.WebLinksAddon = t());
})(self, function () {
  return (() => {
    "use strict";
    var e = {
        6: (e, t) => {
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.LinkComputer = t.WebLinkProvider = void 0);
          var i = (function () {
            function e(e, t, i, r) {
              void 0 === r && (r = {}),
                (this._terminal = e),
                (this._regex = t),
                (this._handler = i),
                (this._options = r);
            }
            return (
              (e.prototype.provideLinks = function (e, t) {
                var i = r.computeLink(
                  e,
                  this._regex,
                  this._terminal,
                  this._handler
                );
                t(this._addCallbacks(i));
              }),
              (e.prototype._addCallbacks = function (e) {
                var t = this;
                return e.map(function (e) {
                  return (
                    (e.leave = t._options.leave),
                    (e.hover = function (i, r) {
                      if (t._options.hover) {
                        var n = e.range;
                        t._options.hover(i, r, n);
                      }
                    }),
                    e
                  );
                });
              }),
              e
            );
          })();
          t.WebLinkProvider = i;
          var r = (function () {
            function e() {}
            return (
              (e.computeLink = function (t, i, r, n) {
                for (
                  var o,
                    a = new RegExp(i.source, (i.flags || "") + "g"),
                    s = e._translateBufferLineToStringWithWrap(t - 1, !1, r),
                    d = s[0],
                    l = s[1],
                    u = -1,
                    c = [];
                  null !== (o = a.exec(d));

                ) {
                  var h = o[1];
                  if (!h) {
                    console.log("match found without corresponding matchIndex");
                    break;
                  }
                  if (
                    ((u = d.indexOf(h, u + 1)),
                    (a.lastIndex = u + h.length),
                    u < 0)
                  )
                    break;
                  for (var v = u + h.length, p = l + 1; v > r.cols; )
                    (v -= r.cols), p++;
                  var f = {
                    start: { x: u + 1, y: l + 1 },
                    end: { x: v, y: p },
                  };
                  c.push({ range: f, text: h, activate: n });
                }
                return c;
              }),
              (e._translateBufferLineToStringWithWrap = function (e, t, i) {
                var r,
                  n,
                  o = "";
                do {
                  if (!(s = i.buffer.active.getLine(e))) break;
                  s.isWrapped && e--, (n = s.isWrapped);
                } while (n);
                var a = e;
                do {
                  var s,
                    d = i.buffer.active.getLine(e + 1);
                  if (
                    ((r = !!d && d.isWrapped),
                    !(s = i.buffer.active.getLine(e)))
                  )
                    break;
                  (o += s.translateToString(!r && t).substring(0, i.cols)), e++;
                } while (r);
                return [o, a];
              }),
              e
            );
          })();
          t.LinkComputer = r;
        },
      },
      t = {};
    function i(r) {
      var n = t[r];
      if (void 0 !== n) return n.exports;
      var o = (t[r] = { exports: {} });
      return e[r](o, o.exports, i), o.exports;
    }
    var r = {};
    return (
      (() => {
        var e = r;
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.WebLinksAddon = void 0);
        var t = i(6),
          n = new RegExp(
            "(?:^|[^\\da-z\\.-]+)((https?:\\/\\/)((([\\da-z\\.-]+)\\.([a-z\\.]{2,18}))|((\\d{1,3}\\.){3}\\d{1,3})|(localhost))(:\\d{1,5})?((\\/[\\/\\w\\.\\-%~:+@]*)*([^:\"'\\s]))?(\\?[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?(#[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?)($|[^\\/\\w\\.\\-%]+)"
          );
        function o(e, t) {
          var i = window.open(t);
          if (!i) return;
          try {
            i.opener = null;
          } catch (e) {}
        }
        var a = (function () {
          function e(e, t, i) {
            void 0 === e && (e = o),
              void 0 === t && (t = {}),
              void 0 === i && (i = !1),
              (this._handler = e),
              (this._options = t),
              (this._useLinkProvider = i);
          }
          return (
            (e.prototype.activate = function (e) {
              if (
                ((this._terminal = e),
                this._useLinkProvider &&
                  "registerLinkProvider" in this._terminal)
              ) {
                var i = (r = this._options).urlRegex || n;
                this._linkProvider = this._terminal.registerLinkProvider(
                  new t.WebLinkProvider(this._terminal, i, this._handler, r)
                );
              } else {
                var r;
                ((r = this._options).matchIndex = 1),
                  (this._linkMatcherId = this._terminal.registerLinkMatcher(
                    n,
                    this._handler,
                    r
                  ));
              }
            }),
            (e.prototype.dispose = function () {
              var e;
              void 0 !== this._linkMatcherId &&
                void 0 !== this._terminal &&
                this._terminal.deregisterLinkMatcher(this._linkMatcherId),
                null === (e = this._linkProvider) ||
                  void 0 === e ||
                  e.dispose();
            }),
            e
          );
        })();
        e.WebLinksAddon = a;
      })(),
      r
    );
  })();
});
//# sourceMappingURL=xterm-addon-web-links.js.map
