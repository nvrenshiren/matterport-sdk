import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

const o = (0, s.createContext)({
  intersectionRef: null,
  GroupRenderer: () => null,
  ItemRenderer: () => null,
  itemRendererProps: {},
  toggleGroup: () => {},
  isCollapsed: () => !1,
  collapsible: !0,
  ariaExpandLabel: "",
  ariaCollapseLabel: ""
})
function l({ item: e, itemHeight: t, renderItem: n, renderItemProps: s = {} }) {
  const r = n
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "mp-nova-vlist-item",
        style: {
          height: t
        }
      },
      {
        children: (0, i.jsx)(
          r,
          Object.assign(
            {
              item: e
            },
            s
          )
        )
      }
    )
  )
}
function c({ items: e, itemHeight: t, intersectionRef: n, renderItem: r, itemKeyProp: a, renderItemProps: o, forceRender: c }) {
  const d = (0, s.useRef)(null),
    [u, h] = (0, s.useState)(!1)
  ;(0, s.useEffect)(() => {
    if (!d.current || !n) return
    const e = new IntersectionObserver(
      e => {
        h(e[0].isIntersecting)
      },
      {
        root: n
      }
    )
    return (
      e.observe(d.current),
      () => {
        e.disconnect()
      }
    )
  }, [d, n])
  const p = u || c
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "mp-nova-vlist-chunk",
        ref: d,
        style: {
          height: e.length * t
        }
      },
      {
        children:
          p &&
          e.map((e, n) =>
            (0, i.jsx)(
              l,
              {
                index: n,
                item: e,
                itemHeight: t,
                renderItem: r,
                renderItemProps: o
              },
              (function (e, t) {
                return e[t]
              })(e, a)
            )
          )
      }
    )
  )
}
function d({
  items: e,
  chunkSize: t = 50,
  itemHeight: n = 40,
  itemKeyProp: r = "id",
  renderItem: o,
  renderItemProps: l,
  intersectionRef: d,
  style: u,
  showItemWithIndex: h = -1
}) {
  const [p, m] = (0, s.useState)(null),
    f = (0, s.useCallback)(e => {
      null !== e && m(e)
    }, []),
    g = []
  for (let s = 0; s < e.length; s += t) {
    const a = h >= s && h < s + t
    g.push(
      (0, i.jsx)(
        c,
        {
          itemHeight: n,
          intersectionRef: d || p,
          renderItem: o,
          renderItemProps: l,
          items: e.slice(s, s + t),
          itemKeyProp: r,
          forceRender: a
        },
        s
      )
    )
  }
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: a("mp-nova-vlist", {
          "mp-nova-vlist-scrollable": !d
        }),
        ref: f,
        style: u
      },
      {
        children: (0, i.jsx)(
          "div",
          Object.assign(
            {
              className: "mp-nova-vlist-chunks"
            },
            {
              children: g
            }
          )
        )
      }
    )
  )
}
let uu = 0
function h({ group: e, index: t, itemHeight: n, showItemWithIndex: r, active: l }) {
  const { GroupRenderer: c, EmptyRenderer: h, ItemRenderer: p, itemRendererProps: m = {}, isCollapsed: f, intersectionRef: g } = (0, s.useContext)(o),
    v = (0, s.useRef)(null),
    y = (0, s.useMemo)(() => (uu++, `${"AccordionPanel"}-${uu}`), []),
    b = f(e.id)
  let E,
    S = {}
  e.items.length > 0
    ? ((S = {
        height: b ? "0" : e.items.length * n + "px"
      }),
      (E = (0, i.jsx)(d, {
        intersectionRef: g,
        renderItem: p,
        renderItemProps: m,
        items: e.items,
        itemHeight: n,
        showItemWithIndex: r
      })))
    : ((S = {
        height: b ? "0" : `${n}px`
      }),
      (E = h
        ? (0, i.jsx)(h, {
            group: e
          })
        : (0, i.jsx)(
            p,
            Object.assign(
              {
                item: null
              },
              m
            )
          )))
  const O = a("mp-nova-accordion-panel", {
    active: l,
    collapsed: b
  })
  return (0, i.jsxs)(
    "section",
    Object.assign(
      {
        role: "region",
        className: O,
        "aria-labelledby": y
      },
      {
        children: [
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                id: y
              },
              {
                children: (0, i.jsx)(c, {
                  group: e
                })
              }
            )
          ),
          (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "mp-accordion-panel-contents",
                style: S,
                ref: v
              },
              {
                children: E
              }
            )
          )
        ]
      }
    )
  )
}
const p = (0, s.forwardRef)(
  (
    {
      className: e,
      data: t,
      itemHeight: n,
      renderEmpty: r,
      renderGroup: l,
      renderItem: c,
      renderItemProps: d,
      activeGroupId: u,
      collapsedIds: p = {},
      collapseEmptyGroups: m = !1,
      onToggleCollapse: f,
      preventCollapsing: g,
      ariaExpandLabel: v,
      ariaCollapseLabel: y
    },
    b
  ) => {
    const E = (0, s.useRef)(null),
      [S, O] = (0, s.useState)(-1),
      [T, _] = (0, s.useState)(null)
    const w = (0, s.useCallback)(
      e =>
        void 0 !== p[e]
          ? p[e]
          : m &&
            (function (e) {
              const n = t.find(t => t.id === e)
              return !!n && 0 === n.items.length
            })(e),
      [p, m, t]
    )
    ;(0, s.useImperativeHandle)(
      b,
      () => ({
        focusGroupItem: (e, t) => {
          w(e) && A(e), _(e), O(t)
        },
        scrollIntoView: e => {
          if (E.current) {
            const t = E.current.querySelector(e)
            if (t)
              return (
                t.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                }),
                !0
              )
          }
          return !1
        }
      }),
      [E.current]
    )
    const A = e => {
        if (f) {
          const t = !w(e)
          f(e, t)
        }
      },
      N = E.current ? E.current.parentNode : null,
      I = a("mp-nova-accordion", e)
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          className: I,
          ref: E
        },
        {
          children: (0, i.jsx)(
            o.Provider,
            Object.assign(
              {
                value: {
                  intersectionRef: N,
                  GroupRenderer: l,
                  EmptyRenderer: r,
                  ItemRenderer: c,
                  itemRendererProps: d,
                  toggleGroup: A,
                  isCollapsed: w,
                  collapsible: !g,
                  ariaExpandLabel: v,
                  ariaCollapseLabel: y
                }
              },
              {
                children: t.map((e, t) =>
                  (0, i.jsx)(
                    h,
                    {
                      itemHeight: n,
                      index: t,
                      group: e,
                      active: e.id === u,
                      showItemWithIndex: e.id === T ? S : -1
                    },
                    e.id
                  )
                )
              }
            )
          )
        }
      )
    )
  }
)
import * as m from "./86902"
function f({ collapsed: e, onClick: t, style: n, ariaLabel: s }) {
  const r = a("mp-nova-accordion-toggle", {
    collapsed: e
  })
  return (0, i.jsx)(m.zx, {
    className: r,
    icon: "dpad-up",
    onClick: t,
    style: n,
    ariaLabel: s
  })
}
var g = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
function v(e) {
  var { actions: t, className: n, onClick: r } = e,
    l = g(e, ["actions", "className", "onClick"])
  const { toggleGroup: c, isCollapsed: d, collapsible: u, ariaExpandLabel: h, ariaCollapseLabel: p } = (0, s.useContext)(o),
    { id: m } = l,
    v = d(m) && u,
    y = v ? h : p,
    b = a("mp-nova-accordion-header", n, {
      collapsed: v,
      collapsible: u
    }),
    E = (0, i.jsxs)(_, {
      children: [
        t,
        u &&
          (0, i.jsx)(f, {
            collapsed: v,
            onClick: e => {
              e.stopPropagation(), c(m)
            },
            ariaLabel: y
          })
      ]
    })
  return (0, i.jsx)(
    U,
    Object.assign({}, l, {
      className: b,
      onClick: () => {
        let e = !1
        r && (e = r(v)), u && !e && c(m)
      },
      actions: E,
      variant: "header"
    })
  )
}
function y({ children: e, actions: t, header: n, layout: s = "vertical", style: r, text: o, title: l, className: c }) {
  const d = a("mp-nova-banner", `mp-nova-banner-${s}`, c)
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: d,
        style: r
      },
      {
        children: [
          n &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "mp-nova-banner-header"
                },
                {
                  children: n
                }
              )
            ),
          l &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "mp-nova-banner-title"
                },
                {
                  children: l
                }
              )
            ),
          o &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "mp-nova-banner-text"
                },
                {
                  children: o
                }
              )
            ),
          t &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "mp-nova-banner-actions"
                },
                {
                  children: t
                }
              )
            ),
          e
        ]
      }
    )
  )
}
const b = "_1dvwLjLEqO5jnr5QV6jQLd",
  E = "_2Uy7qbQEi-pnztt6CrNMMI",
  S = "_138eeo-fRTYvvjBixACJ3d",
  O = "_3iiCLwxCBwUuZjI_tSgdKB"
function T({ alt: e, className: t, name: r, theme: o = "light", size: l = "160", geometry: c = "standard" }) {
  const { isLoading: d, svgUrl: u } = (({ name: e, theme: t, geometry: i }) => {
      const [r, a] = (0, s.useState)(!1),
        [o, l] = (0, s.useState)(void 0)
      return (
        (0, s.useEffect)(() => {
          ;(async () => {
            a(!0),
              await n
                .e(782)
                .then(n.bind(n, 81739))
                .then(e => {
                  l(() => e.getImageUrl)
                })
                .finally(() => {
                  a(!1)
                })
          })()
        }, []),
        {
          isLoading: r,
          svgUrl: null == o ? void 0 : o(e, t, i)
        }
      )
    })({
      name: r,
      theme: o,
      geometry: c
    }),
    h = null != e ? e : null == r ? void 0 : r.replace("-", " ")
  return (0, i.jsx)(
    "span",
    Object.assign(
      {
        className: a(
          b,
          {
            [S]: "160" === l,
            [O]: "200" === l
          },
          t
        )
      },
      {
        children:
          !d &&
          u &&
          (0, i.jsx)("img", {
            alt: h,
            className: E,
            "data-testid": `brandicon_${r}_${c}_${o}`,
            height: l,
            src: u,
            width: l
          })
      }
    )
  )
}

function _({ children: e, spacing: t, className: n }) {
  const s = a("mp-nova-btn-group", n, {
    [`mp-nova-btn-group-${t}`]: void 0 !== t
  })
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: s
      },
      {
        children: e
      }
    )
  )
}
import * as w from "react-dom"
import * as A from "./54484"
import * as N from "./77294"
import * as I from "./37056"
const P = (0, s.forwardRef)(
  (
    {
      target: e,
      isOpen: t,
      focus: n = !0,
      className: r,
      onClose: o,
      xOffset: l = 0,
      yOffset: c,
      arrow: d = !1,
      placement: u = "bottom-start",
      theme: h,
      children: p
    },
    m
  ) => {
    const [f, g] = (0, s.useState)(null),
      [v, y] = (0, s.useState)(null),
      { styles: b, attributes: E } = (0, N.D)(e, f, {
        placement: u,
        strategy: "fixed",
        modifiers: [
          {
            name: "arrow",
            options: {
              element: v,
              padding: 4
            }
          },
          {
            name: "flip"
          },
          {
            name: "hide"
          },
          {
            name: "offset",
            options: {
              offset: c ? [l, c] : [l, 4]
            }
          }
        ]
      }),
      S = (0, A.Z)(e)
    ;(0, s.useEffect)(() => {
      n && t && f && f.focus()
    }, [t, f, n]),
      (0, s.useEffect)(() => {
        const n = t => {
          var n
          if (e && f) {
            const i = t.composedPath(),
              s = !i.includes(e),
              r = !i.includes(f)
            if (s && r) {
              ;(t.srcElement && (null === (n = f.nextElementSibling) || void 0 === n ? void 0 : n.contains(t.srcElement))) || o()
            }
          }
        }
        return (
          t && f
            ? window.addEventListener("click", n, {
                capture: !0
              })
            : window.removeEventListener("click", n, {
                capture: !0
              }),
          () => {
            window.removeEventListener("click", n, {
              capture: !0
            })
          }
        )
      }, [f, e, t, o])
    const O = (e, t) => {
      var n
      return (null === (n = e.props.className) || void 0 === n ? void 0 : n.includes("mp-nova-menu-item"))
        ? e
        : (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "mp-nova-menu-item"
              },
              {
                children: e
              }
            ),
            `menu-item-${t}`
          )
    }
    if (!t || !p) return null
    const T = []
    Array.isArray(p)
      ? s.Children.forEach(p, (e, t) => {
          e && T.push(O(e, t))
        })
      : T.push(O(p, 0))
    const _ = a("mp-nova-menu", r, {
        [`mp-nova-${h}`]: void 0 !== h
      }),
      P = E.popper ? E.popper["data-popper-placement"] : void 0,
      x = (0, i.jsxs)(
        "div",
        Object.assign(
          {
            style: Object.assign({}, b.popper)
          },
          E.popper,
          {
            ref: g,
            className: _,
            onClick: o,
            onKeyDown: e => {
              switch (e.code) {
                case "ArrowDown":
                case "ArrowUp":
                case "Tab":
                case "Enter":
                  break
                case "Escape":
                  e.stopPropagation(), o()
              }
            },
            tabIndex: 0
          },
          {
            children: [
              (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "mp-nova-menu-items"
                  },
                  {
                    children: T
                  }
                )
              ),
              d &&
                (0, i.jsx)(I.c, {
                  ref: y,
                  style: b.arrow,
                  placement: P,
                  size: "medium",
                  theme: h
                })
            ]
          }
        )
      )
    return (0, w.createPortal)(x, S)
  }
)
import * as x from "./13727"
var k = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const L = (0, s.forwardRef)((e, t) => {
  var {
      className: n,
      buttonClassName: r,
      buttonDataAttribute: o,
      children: l,
      menuClassName: c,
      onClick: d,
      onMenuToggled: u,
      menuXOffset: h,
      menuYOffset: p,
      menuTheme: f,
      menuPlacement: g,
      menuArrow: v,
      menuDelayed: y = !1,
      label: b,
      active: E,
      icon: S,
      tooltip: O,
      caret: T = !1,
      indicator: _ = !1,
      ariaLabel: w
    } = e,
    A = k(e, [
      "className",
      "buttonClassName",
      "buttonDataAttribute",
      "children",
      "menuClassName",
      "onClick",
      "onMenuToggled",
      "menuXOffset",
      "menuYOffset",
      "menuTheme",
      "menuPlacement",
      "menuArrow",
      "menuDelayed",
      "label",
      "active",
      "icon",
      "tooltip",
      "caret",
      "indicator",
      "ariaLabel"
    ])
  const N = (0, s.useRef)(null),
    [I, L] = (0, s.useState)(!1),
    [C, D] = (0, s.useState)(!1),
    R = (0, s.useRef)(0)
  function M(e) {
    L(e), u && u(e)
  }
  ;(0, s.useEffect)(
    () => () => {
      D(!1), window.clearTimeout(R.current)
    },
    []
  ),
    (0, s.useImperativeHandle)(
      t,
      () => ({
        closeMenu: () => {
          M(!1)
        }
      }),
      []
    )
  const j = (0, s.useCallback)(
      e => {
        null == e || e.stopPropagation(), M(!1)
      },
      [u]
    ),
    U = void 0 === b && void 0 !== S && !T,
    F = S && b,
    H = a("mp-button-menu-button", r, {
      "mp-nova-btn-icon": U,
      "mp-nova-btn-multi": F,
      "mp-nova-menu-open": I
    }),
    B = T ? (I ? "dpad-up" : "dpad-down") : void 0
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: a("mp-nova-button-menu", n),
        ref: N
      },
      {
        children: [
          (0, i.jsxs)(
            m.zx,
            Object.assign(
              {},
              A,
              {
                ariaLabel: w,
                ariaHasPopup: "menu",
                ariaExpanded: I,
                onClick: y
                  ? void 0
                  : e => {
                      e.stopPropagation(), e.preventDefault(), d && d(e), M(!I)
                    },
                onPointerDown: y
                  ? e => {
                      D(!1),
                        y &&
                          !I &&
                          (window.clearTimeout(R.current),
                          (R.current = window.setTimeout(() => {
                            ;(R.current = 0), D(!0), M(!0)
                          }, 250)))
                    }
                  : void 0,
                onPointerUp: y
                  ? e => {
                      y && (R.current && !I ? (window.clearTimeout(R.current), (R.current = 0), d && d(e)) : C || M(!I))
                    }
                  : void 0,
                className: H,
                dataAttribute: o,
                tooltip: I ? void 0 : O,
                active: E || I
              },
              {
                children: [
                  S &&
                    (0, i.jsx)(x.I, {
                      name: S
                    }),
                  b &&
                    (0, i.jsx)(
                      "span",
                      Object.assign(
                        {
                          className: "mp-nova-btn-label"
                        },
                        {
                          children: b
                        }
                      )
                    ),
                  B &&
                    (0, i.jsx)(x.I, {
                      name: B
                    }),
                  _ &&
                    (0, i.jsx)(x.I, {
                      className: "mp-nova-menu-indicator",
                      name: "menu-indicator"
                    })
                ]
              }
            )
          ),
          (0, i.jsx)(
            P,
            Object.assign(
              {
                target: N.current,
                isOpen: I,
                xOffset: h,
                yOffset: p,
                placement: g,
                arrow: v,
                theme: f,
                className: c,
                onClose: j
              },
              {
                children: l
              }
            )
          )
        ]
      }
    )
  )
})
function C({ children: e, spacing: t, className: n, menuClassName: s, menuArrow: r, icon: a, size: o = m.qE.SMALL, variant: l }) {
  return a
    ? (0, i.jsx)(
        L,
        Object.assign(
          {
            className: n,
            menuClassName: s,
            icon: a,
            size: o,
            variant: l,
            menuArrow: r
          },
          {
            children: e
          }
        )
      )
    : (0, i.jsx)(
        _,
        Object.assign(
          {
            className: n,
            spacing: t
          },
          {
            children: e
          }
        )
      )
}
function D({ id: e, label: t, ariaLabel: n, className: r, defaultChecked: o = !1, disabled: l = !1, onChange: c, onClick: d }) {
  const [u, h] = (0, s.useState)(!!o)
  ;(0, s.useEffect)(() => {
    h(!!o)
  }, [o])
  const p = a(
    r,
    "mp-nova-checkbox",
    {
      "mp-nova-disabled": l
    },
    {
      "mp-nova-active": u
    }
  )
  return (0, i.jsxs)(
    "label",
    Object.assign(
      {
        className: p,
        htmlFor: e,
        onClick: d
      },
      {
        children: [
          (0, i.jsx)("input", {
            className: "mp-nova-checkbox-input",
            id: e,
            type: "checkbox",
            role: "checkbox",
            tabIndex: l ? void 0 : 0,
            disabled: l,
            checked: u,
            onChange: e => {
              c && c(e), h(e => !e)
            },
            "aria-checked": u,
            "aria-disabled": l,
            "aria-label": n || t
          }),
          (0, i.jsx)("span", {
            className: "mp-nova-checkbox-checkmark"
          }),
          (0, i.jsx)(
            "span",
            Object.assign(
              {
                className: "mp-nova-checkbox-label"
              },
              {
                children: t
              }
            )
          )
        ]
      }
    )
  )
}
function R({ children: e, className: t, onClose: n, testId: r, theme: o = "light" }) {
  const l = (0, s.useRef)(null)
  ;(0, s.useEffect)(() => (l.current && l.current.focus(), () => {}), [])
  const c = e => e.stopPropagation()
  const d = a("mp-nova-dialog", t, {
    [`mp-nova-theme-${o}`]: void 0 !== o
  })
  return (0, i.jsx)(
    "dialog",
    Object.assign(
      {
        className: d,
        ref: l,
        onClick: c,
        onPointerDown: c,
        onPointerUp: c,
        onKeyDown: function (e) {
          n && "Escape" === e.code && (e.stopPropagation(), n())
        },
        "data-testid": r
      },
      {
        children: e
      }
    )
  )
}
const M = ({ className: e = "", itemHeight: t, message: n }) => {
  const s = a("nova-empty-list-item", {
      [`${e}`]: !!e
    }),
    r = {
      height: t || void 0
    }
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: s,
        style: r
      },
      {
        children:
          n &&
          (0, i.jsx)(
            "p",
            Object.assign(
              {
                className: "message"
              },
              {
                children: n
              }
            )
          )
      }
    )
  )
}
function j({ className: e = "", children: t }) {
  const n = a("mp-nova-list-controls", e)
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: n
      },
      {
        children: t
      }
    )
  )
}
const U = (0, s.forwardRef)(
  (
    {
      title: e,
      className: t,
      variant: n,
      actions: s,
      badge: r,
      decals: o,
      active: l = !1,
      selected: c = !1,
      disabled: d = !1,
      selectMode: u = !1,
      selectDisabled: h = !1,
      onSelect: p,
      id: m,
      onClick: f,
      onMouseEnter: g,
      onMouseLeave: v
    },
    y
  ) => {
    const b = a("mp-nova-list-item", t, {
      [`mp-nova-list-item-${n}`]: void 0 !== n,
      "mp-nova-disabled": d,
      "mp-nova-multi-select": u,
      interactive: !!f,
      selected: c,
      active: l
    })
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: b,
          onClick: f,
          onMouseEnter: g,
          onMouseLeave: v,
          "data-id": m,
          ref: y
        },
        {
          children: [
            u &&
              (0, i.jsx)(D, {
                id: `mp-list-checkbox-${m}`,
                defaultChecked: c,
                onChange: p,
                onClick: e => e.stopPropagation(),
                disabled: h
              }),
            r &&
              (0, i.jsx)(
                "span",
                Object.assign(
                  {
                    className: "mp-list-item-badge"
                  },
                  {
                    children: r
                  }
                )
              ),
            (0, i.jsxs)(
              "span",
              Object.assign(
                {
                  className: "mp-list-item-title"
                },
                {
                  children: [
                    (0, i.jsx)(
                      "span",
                      Object.assign(
                        {
                          className: "mp-list-item-text"
                        },
                        {
                          children: e
                        }
                      )
                    ),
                    o &&
                      (0, i.jsx)(
                        "span",
                        Object.assign(
                          {
                            className: "mp-list-item-decals"
                          },
                          {
                            children: o
                          }
                        )
                      )
                  ]
                }
              )
            ),
            s &&
              (0, i.jsx)(
                "span",
                Object.assign(
                  {
                    className: "mp-list-item-actions"
                  },
                  {
                    children: s
                  }
                )
              )
          ]
        }
      )
    )
  }
)
function F({ theme: e = "light", style: t }) {
  const n = a("mp-nova-pulsar", `mp-nova-pulsar-${e}`)
  return (0, i.jsx)("span", {
    className: n,
    style: t
  })
}
const H = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement
function B(e) {
  const t = Object.prototype.toString.call(e)
  return "[object Window]" === t || "[object global]" === t
}
function V(e) {
  return "nodeType" in e
}
function G(e) {
  var t, n
  return e ? (B(e) ? e : V(e) && null != (t = null == (n = e.ownerDocument) ? void 0 : n.defaultView) ? t : window) : window
}
function W(e) {
  const { Document: t } = G(e)
  return e instanceof t
}
function z(e) {
  return !B(e) && e instanceof G(e).HTMLElement
}
function $(e) {
  return e ? (B(e) ? e.document : V(e) ? (W(e) ? e : z(e) ? e.ownerDocument : document) : document) : document
}
const K = H ? s.useLayoutEffect : s.useEffect
function Y(e, t = [e]) {
  const n = (0, s.useRef)(e)
  return (
    K(() => {
      n.current !== e && (n.current = e)
    }, t),
    n
  )
}
function q(e, t) {
  const n = (0, s.useRef)()
  return (0, s.useMemo)(() => {
    const t = e(n.current)
    return (n.current = t), t
  }, [...t])
}
function Z(e) {
  const t = Y(e),
    n = (0, s.useRef)(null),
    i = (0, s.useCallback)(e => {
      e !== n.current && (null == t.current || t.current(e, n.current)), (n.current = e)
    }, [])
  return [n, i]
}
let Q = {}
function X(e, t) {
  return (0, s.useMemo)(() => {
    if (t) return t
    const n = null == Q[e] ? 0 : Q[e] + 1
    return (Q[e] = n), `${e}-${n}`
  }, [e, t])
}
function J(e) {
  return (t, ...n) =>
    n.reduce(
      (t, n) => {
        const i = Object.entries(n)
        for (const [n, s] of i) {
          const i = t[n]
          null != i && (t[n] = i + e * s)
        }
        return t
      },
      {
        ...t
      }
    )
}
const ee = J(1),
  te = J(-1)
function ne(e) {
  if (!e) return !1
  const { KeyboardEvent: t } = G(e.target)
  return t && e instanceof t
}
function ie(e) {
  if (
    (function (e) {
      if (!e) return !1
      const { TouchEvent: t } = G(e.target)
      return t && e instanceof t
    })(e)
  ) {
    if (e.touches && e.touches.length) {
      const { clientX: t, clientY: n } = e.touches[0]
      return {
        x: t,
        y: n
      }
    }
    if (e.changedTouches && e.changedTouches.length) {
      const { clientX: t, clientY: n } = e.changedTouches[0]
      return {
        x: t,
        y: n
      }
    }
  }
  return (function (e) {
    return "clientX" in e && "clientY" in e
  })(e)
    ? {
        x: e.clientX,
        y: e.clientY
      }
    : null
}
const se = Object.freeze({
    Translate: {
      toString(e) {
        if (!e) return
        const { x: t, y: n } = e
        return `translate3d(${t ? Math.round(t) : 0}px, ${n ? Math.round(n) : 0}px, 0)`
      }
    },
    Scale: {
      toString(e) {
        if (!e) return
        const { scaleX: t, scaleY: n } = e
        return `scaleX(${t}) scaleY(${n})`
      }
    },
    Transform: {
      toString(e) {
        if (e) return [se.Translate.toString(e), se.Scale.toString(e)].join(" ")
      }
    },
    Transition: {
      toString: ({ property: e, duration: t, easing: n }) => `${e} ${t}ms ${n}`
    }
  }),
  re = {
    display: "none"
  }
function ae({ id: e, value: t }) {
  return s.createElement(
    "div",
    {
      id: e,
      style: re
    },
    t
  )
}
const oe = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(100%)",
  whiteSpace: "nowrap"
}
function le({ id: e, announcement: t }) {
  return s.createElement(
    "div",
    {
      id: e,
      style: oe,
      role: "status",
      "aria-live": "assertive",
      "aria-atomic": !0
    },
    t
  )
}
const ce = {
    draggable:
      "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
  },
  de = {
    onDragStart: e => `Picked up draggable item ${e}.`,
    onDragOver: (e, t) => (t ? `Draggable item ${e} was moved over droppable area ${t}.` : `Draggable item ${e} is no longer over a droppable area.`),
    onDragEnd: (e, t) => (t ? `Draggable item ${e} was dropped over droppable area ${t}` : `Draggable item ${e} was dropped.`),
    onDragCancel: e => `Dragging was cancelled. Draggable item ${e} was dropped.`
  }
function he(...e) {}
enum ue {
  DragCancel = "dragCancel",
  DragEnd = "dragEnd",
  DragMove = "dragMove",
  DragOver = "dragOver",
  DragStart = "dragStart",
  RegisterDroppable = "registerDroppable",
  SetDroppableDisabled = "setDroppableDisabled",
  UnregisterDroppable = "unregisterDroppable"
}

class pe extends Map {
  get(e) {
    var t
    return null != e && null != (t = super.get(e)) ? t : void 0
  }
  toArray() {
    return Array.from(this.values())
  }
  getEnabled() {
    return this.toArray().filter(({ disabled: e }) => !e)
  }
  getNodeFor(e) {
    var t, n
    return null != (t = null == (n = this.get(e)) ? void 0 : n.node.current) ? t : void 0
  }
}
const me = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: {},
    droppableRects: new Map(),
    droppableContainers: new pe(),
    over: null,
    dragOverlay: {
      nodeRef: {
        current: null
      },
      rect: null,
      setRef: he
    },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measureDroppableContainers: he,
    windowRect: null,
    measuringScheduled: !1
  },
  fe = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: {
      draggable: ""
    },
    dispatch: he,
    draggableNodes: {},
    over: null,
    measureDroppableContainers: he
  },
  ge = (0, s.createContext)(fe),
  ve = (0, s.createContext)(me)
function ye() {
  return {
    draggable: {
      active: null,
      initialCoordinates: {
        x: 0,
        y: 0
      },
      nodes: {},
      translate: {
        x: 0,
        y: 0
      }
    },
    droppable: {
      containers: new pe()
    }
  }
}
function be(e, t) {
  switch (t.type) {
    case ue.DragStart:
      return {
        ...e,
        draggable: {
          ...e.draggable,
          initialCoordinates: t.initialCoordinates,
          active: t.active
        }
      }
    case ue.DragMove:
      return e.draggable.active
        ? {
            ...e,
            draggable: {
              ...e.draggable,
              translate: {
                x: t.coordinates.x - e.draggable.initialCoordinates.x,
                y: t.coordinates.y - e.draggable.initialCoordinates.y
              }
            }
          }
        : e
    case ue.DragEnd:
    case ue.DragCancel:
      return {
        ...e,
        draggable: {
          ...e.draggable,
          active: null,
          initialCoordinates: {
            x: 0,
            y: 0
          },
          translate: {
            x: 0,
            y: 0
          }
        }
      }
    case ue.RegisterDroppable: {
      const { element: n } = t,
        { id: i } = n,
        s = new pe(e.droppable.containers)
      return (
        s.set(i, n),
        {
          ...e,
          droppable: {
            ...e.droppable,
            containers: s
          }
        }
      )
    }
    case ue.SetDroppableDisabled: {
      const { id: n, key: i, disabled: s } = t,
        r = e.droppable.containers.get(n)
      if (!r || i !== r.key) return e
      const a = new pe(e.droppable.containers)
      return (
        a.set(n, {
          ...r,
          disabled: s
        }),
        {
          ...e,
          droppable: {
            ...e.droppable,
            containers: a
          }
        }
      )
    }
    case ue.UnregisterDroppable: {
      const { id: n, key: i } = t,
        s = e.droppable.containers.get(n)
      if (!s || i !== s.key) return e
      const r = new pe(e.droppable.containers)
      return (
        r.delete(n),
        {
          ...e,
          droppable: {
            ...e.droppable,
            containers: r
          }
        }
      )
    }
    default:
      return e
  }
}
const Ee = (0, s.createContext)({
  type: null,
  event: null
})
function Se({ announcements: e = de, hiddenTextDescribedById: t, screenReaderInstructions: n }) {
  const { announce: i, announcement: r } = (function () {
      const [e, t] = (0, s.useState)("")
      return {
        announce: (0, s.useCallback)(e => {
          null != e && t(e)
        }, []),
        announcement: e
      }
    })(),
    a = X("DndLiveRegion"),
    [o, l] = (0, s.useState)(!1)
  return (
    (0, s.useEffect)(() => {
      l(!0)
    }, []),
    (function ({ onDragStart: e, onDragMove: t, onDragOver: n, onDragEnd: i, onDragCancel: r }) {
      const a = (0, s.useContext)(Ee),
        o = (0, s.useRef)(a)
      ;(0, s.useEffect)(() => {
        if (a !== o.current) {
          const { type: s, event: l } = a
          switch (s) {
            case ue.DragStart:
              null == e || e(l)
              break
            case ue.DragMove:
              null == t || t(l)
              break
            case ue.DragOver:
              null == n || n(l)
              break
            case ue.DragCancel:
              null == r || r(l)
              break
            case ue.DragEnd:
              null == i || i(l)
          }
          o.current = a
        }
      }, [a, e, t, n, i, r])
    })(
      (0, s.useMemo)(
        () => ({
          onDragStart({ active: t }) {
            i(e.onDragStart(t.id))
          },
          onDragMove({ active: t, over: n }) {
            e.onDragMove && i(e.onDragMove(t.id, null == n ? void 0 : n.id))
          },
          onDragOver({ active: t, over: n }) {
            i(e.onDragOver(t.id, null == n ? void 0 : n.id))
          },
          onDragEnd({ active: t, over: n }) {
            i(e.onDragEnd(t.id, null == n ? void 0 : n.id))
          },
          onDragCancel({ active: t }) {
            i(e.onDragCancel(t.id))
          }
        }),
        [i, e]
      )
    ),
    o
      ? (0, w.createPortal)(
          s.createElement(
            s.Fragment,
            null,
            s.createElement(ae, {
              id: t,
              value: n.draggable
            }),
            s.createElement(le, {
              id: a,
              announcement: r
            })
          ),
          document.body
        )
      : null
  )
}
const Oe = Object.freeze({
  x: 0,
  y: 0
})
function Te(e, t) {
  return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
}
function _e(e, t) {
  const n = ie(e)
  if (!n) return "0 0"
  return `${((n.x - t.left) / t.width) * 100}% ${((n.y - t.top) / t.height) * 100}%`
}
function we({ data: { value: e } }, { data: { value: t } }) {
  return e - t
}
function Ae({ data: { value: e } }, { data: { value: t } }) {
  return t - e
}
function Ne(e, t = e.left, n = e.top) {
  return {
    x: t + 0.5 * e.width,
    y: n + 0.5 * e.height
  }
}
const Ie = ({ collisionRect: e, droppableContainers: t }) => {
  const n = Ne(e, e.left, e.top),
    i = []
  for (const e of t) {
    const {
      id: t,
      rect: { current: s }
    } = e
    if (s) {
      const r = Te(Ne(s), n)
      i.push({
        id: t,
        data: {
          droppableContainer: e,
          value: r
        }
      })
    }
  }
  return i.sort(we)
}
function Pe(e, t) {
  const n = Math.max(t.top, e.top),
    i = Math.max(t.left, e.left),
    s = Math.min(t.left + t.width, e.left + e.width),
    r = Math.min(t.top + t.height, e.top + e.height),
    a = s - i,
    o = r - n
  if (i < s && n < r) {
    const n = t.width * t.height,
      i = e.width * e.height,
      s = a * o
    return Number((s / (n + i - s)).toFixed(4))
  }
  return 0
}
const xe = ({ collisionRect: e, droppableContainers: t }) => {
  const n = []
  for (const i of t) {
    const {
      id: t,
      rect: { current: s }
    } = i
    if (s) {
      const r = Pe(s, e)
      r > 0 &&
        n.push({
          id: t,
          data: {
            droppableContainer: i,
            value: r
          }
        })
    }
  }
  return n.sort(Ae)
}
function ke(e) {
  return function (t, ...n) {
    return n.reduce(
      (t, n) => ({
        ...t,
        top: t.top + e * n.y,
        bottom: t.bottom + e * n.y,
        left: t.left + e * n.x,
        right: t.right + e * n.x
      }),
      {
        ...t
      }
    )
  }
}
const Le = ke(1)
const Ce = {
  ignoreTransform: !1
}
function De(e, t = Ce) {
  let n = e.getBoundingClientRect()
  if (t.ignoreTransform) {
    const { getComputedStyle: t } = G(e),
      { transform: i, transformOrigin: s } = t(e)
    i &&
      (n = (function (e, t, n) {
        let i, s, r, a, o
        if (t.startsWith("matrix3d(")) (i = t.slice(9, -1).split(/, /)), (s = +i[0]), (r = +i[5]), (a = +i[12]), (o = +i[13])
        else {
          if (!t.startsWith("matrix(")) return e
          ;(i = t.slice(7, -1).split(/, /)), (s = +i[0]), (r = +i[3]), (a = +i[4]), (o = +i[5])
        }
        const l = e.left - a - (1 - s) * parseFloat(n),
          c = e.top - o - (1 - r) * parseFloat(n.slice(n.indexOf(" ") + 1)),
          d = s ? e.width / s : e.width,
          u = r ? e.height / r : e.height
        return {
          width: d,
          height: u,
          top: c,
          right: l + d,
          bottom: c + u,
          left: l
        }
      })(n, i, s))
  }
  const { top: i, left: s, width: r, height: a, bottom: o, right: l } = n
  return {
    top: i,
    left: s,
    width: r,
    height: a,
    bottom: o,
    right: l
  }
}
function Re(e) {
  return De(e, {
    ignoreTransform: !0
  })
}
function Me(e) {
  const t = []
  return e
    ? (function n(i) {
        if (!i) return t
        if (W(i) && null != i.scrollingElement && !t.includes(i.scrollingElement)) return t.push(i.scrollingElement), t
        if (
          !z(i) ||
          (function (e) {
            return e instanceof G(e).SVGElement
          })(i)
        )
          return t
        if (t.includes(i)) return t
        const { getComputedStyle: s } = G(i),
          r = s(i)
        return (
          i !== e &&
            (function (e, t = G(e).getComputedStyle(e)) {
              const n = /(auto|scroll|overlay)/
              return (
                null !=
                ["overflow", "overflowX", "overflowY"].find(e => {
                  const i = t[e]
                  return "string" == typeof i && n.test(i)
                })
              )
            })(i, r) &&
            t.push(i),
          (function (e, t = G(e).getComputedStyle(e)) {
            return "fixed" === t.position
          })(i, r)
            ? t
            : n(i.parentNode)
        )
      })(e)
    : t
}
function je(e) {
  return H && e ? (B(e) ? e : V(e) ? (W(e) || e === $(e).scrollingElement ? window : z(e) ? e : null) : null) : null
}
function Ue(e) {
  return B(e) ? e.scrollX : e.scrollLeft
}
function Fe(e) {
  return B(e) ? e.scrollY : e.scrollTop
}
function He(e) {
  return {
    x: Ue(e),
    y: Fe(e)
  }
}
function Ve(e) {
  const t = {
      x: 0,
      y: 0
    },
    n = {
      x: e.scrollWidth - e.clientWidth,
      y: e.scrollHeight - e.clientHeight
    }
  return {
    isTop: e.scrollTop <= t.y,
    isLeft: e.scrollLeft <= t.x,
    isBottom: e.scrollTop >= n.y,
    isRight: e.scrollLeft >= n.x,
    maxScroll: n,
    minScroll: t
  }
}

enum Be {
  Backward = -1,
  Forward = 1
}

const Ge = {
  x: 0.2,
  y: 0.2
}
function We(e, t, { top: n, left: i, right: s, bottom: r }, a = 10, o = Ge) {
  const { clientHeight: l, clientWidth: c } = e,
    d =
      ((u = e),
      H && u && u === document.scrollingElement
        ? {
            top: 0,
            left: 0,
            right: c,
            bottom: l,
            width: c,
            height: l
          }
        : t)
  var u
  const { isTop: h, isBottom: p, isLeft: m, isRight: f } = Ve(e),
    g = {
      x: 0,
      y: 0
    },
    v = {
      x: 0,
      y: 0
    },
    y = d.height * o.y,
    b = d.width * o.x
  return (
    !h && n <= d.top + y
      ? ((g.y = Be.Backward), (v.y = a * Math.abs((d.top + y - n) / y)))
      : !p && r >= d.bottom - y && ((g.y = Be.Forward), (v.y = a * Math.abs((d.bottom - y - r) / y))),
    !f && s >= d.right - b
      ? ((g.x = Be.Forward), (v.x = a * Math.abs((d.right - b - s) / b)))
      : !m && i <= d.left + b && ((g.x = Be.Backward), (v.x = a * Math.abs((d.left + b - i) / b))),
    {
      direction: g,
      speed: v
    }
  )
}
function ze(e) {
  if (e === document.scrollingElement) {
    const { innerWidth: e, innerHeight: t } = window
    return {
      top: 0,
      left: 0,
      right: e,
      bottom: t,
      width: e,
      height: t
    }
  }
  const { top: t, left: n, right: i, bottom: s } = e.getBoundingClientRect()
  return {
    top: t,
    left: n,
    right: i,
    bottom: s,
    width: e.clientWidth,
    height: e.clientHeight
  }
}
function $e(e) {
  return e.reduce((e, t) => ee(e, He(t)), Oe)
}
const Ke = [
  [
    "x",
    ["left", "right"],
    function (e) {
      return e.reduce((e, t) => e + Ue(t), 0)
    }
  ],
  [
    "y",
    ["top", "bottom"],
    function (e) {
      return e.reduce((e, t) => e + Fe(t), 0)
    }
  ]
]
class Ye {
  constructor(e, t) {
    ;(this.rect = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.right = void 0),
      (this.left = void 0)
    const n = Me(t),
      i = $e(n)
    ;(this.rect = {
      ...e
    }),
      (this.width = e.width),
      (this.height = e.height)
    for (const [e, t, s] of Ke)
      for (const r of t)
        Object.defineProperty(this, r, {
          get: () => {
            const t = s(n),
              a = i[e] - t
            return this.rect[r] + a
          },
          enumerable: !0
        })
    Object.defineProperty(this, "rect", {
      enumerable: !1
    })
  }
}
function Je({
  acceleration: e,
  activator: t = qe.Pointer,
  canScroll: n,
  draggingRect: i,
  enabled: r,
  interval: a = 5,
  order: o = Ze.TreeOrder,
  pointerCoordinates: l,
  scrollableAncestors: c,
  scrollableAncestorRects: d,
  threshold: u
}) {
  const [h, p] = (function () {
      const e = (0, s.useRef)(null)
      return [
        (0, s.useCallback)((t, n) => {
          e.current = setInterval(t, n)
        }, []),
        (0, s.useCallback)(() => {
          null !== e.current && (clearInterval(e.current), (e.current = null))
        }, [])
      ]
    })(),
    m = (0, s.useRef)({
      x: 1,
      y: 1
    }),
    f = (0, s.useMemo)(() => {
      switch (t) {
        case qe.Pointer:
          return l
            ? {
                top: l.y,
                bottom: l.y,
                left: l.x,
                right: l.x
              }
            : null
        case qe.DraggableRect:
          return i
      }
      return null
    }, [t, i, l]),
    g = (0, s.useRef)(Oe),
    v = (0, s.useRef)(null),
    y = (0, s.useCallback)(() => {
      const e = v.current
      if (!e) return
      const t = m.current.x * g.current.x,
        n = m.current.y * g.current.y
      e.scrollBy(t, n)
    }, []),
    b = (0, s.useMemo)(() => (o === Ze.TreeOrder ? [...c].reverse() : c), [o, c])
  ;(0, s.useEffect)(() => {
    if (r && c.length && f) {
      for (const t of b) {
        if (!1 === (null == n ? void 0 : n(t))) continue
        const i = c.indexOf(t),
          s = d[i]
        if (!s) continue
        const { direction: r, speed: o } = We(t, s, f, e, u)
        if (o.x > 0 || o.y > 0) return p(), (v.current = t), h(y, a), (m.current = o), void (g.current = r)
      }
      ;(m.current = {
        x: 0,
        y: 0
      }),
        (g.current = {
          x: 0,
          y: 0
        }),
        p()
    } else p()
  }, [e, y, n, p, r, a, JSON.stringify(f), h, c, b, d, JSON.stringify(u)])
}
enum qe {
  DraggableRect = 1,
  Pointer = 0
}
enum Ze {
  ReversedTreeOrder = 1,
  TreeOrder = 0
}
enum Qe {
  Always = 0,
  BeforeDragging = 1,
  WhileDragging = 2
}
enum Xe {
  Optimized = "optimized"
}

const et = new Map(),
  tt = {
    measure: Re,
    strategy: Qe.WhileDragging,
    frequency: Xe.Optimized
  }
function nt({ onResize: e, disabled: t }) {
  const n = (0, s.useMemo)(() => {
    if (t || "undefined" == typeof window || void 0 === window.ResizeObserver) return
    const { ResizeObserver: n } = window
    return new n(e)
  }, [t, e])
  return (0, s.useEffect)(() => () => (null == n ? void 0 : n.disconnect()), [n]), n
}
const it = []
const st = ot(Re),
  rt = lt(Re)
function at(e, t, n) {
  const i = (0, s.useRef)(e)
  return q(s => (e ? (n || (!s && e) || e !== i.current ? (z(e) && null == e.parentNode ? null : new Ye(t(e), e)) : null != s ? s : null) : null), [e, n, t])
}
function ot(e) {
  return (t, n) => at(t, e, n)
}
function lt(e) {
  const t = []
  return function (n, i) {
    const r = (0, s.useRef)(n)
    return q(s => (n.length ? (i || (!s && n.length) || n !== r.current ? n.map(t => new Ye(e(t), t)) : null != s ? s : t) : t), [n, i])
  }
}
function ct(e) {
  if (!e) return null
  if (e.children.length > 1) return e
  const t = e.children[0]
  return z(t) ? t : e
}
function dt(e, t) {
  return (0, s.useMemo)(
    () => ({
      sensor: e,
      options: null != t ? t : {}
    }),
    [e, t]
  )
}
class ut {
  constructor(e) {
    ;(this.target = void 0),
      (this.listeners = []),
      (this.removeAll = () => {
        this.listeners.forEach(e => {
          var t
          return null == (t = this.target) ? void 0 : t.removeEventListener(...e)
        })
      }),
      (this.target = e)
  }
  add(e, t, n) {
    var i
    null == (i = this.target) || i.addEventListener(e, t, n), this.listeners.push([e, t, n])
  }
}
function ht(e, t) {
  const n = Math.abs(e.x),
    i = Math.abs(e.y)
  return "number" == typeof t ? Math.sqrt(n ** 2 + i ** 2) > t : "x" in t && "y" in t ? n > t.x && i > t.y : "x" in t ? n > t.x : "y" in t && i > t.y
}
function ft(e) {
  e.preventDefault()
}
function gt(e) {
  e.stopPropagation()
}
enum pt {
  Click = "click",
  ContextMenu = "contextmenu",
  DragStart = "dragstart",
  Keydown = "keydown",
  Resize = "resize",
  SelectionChange = "selectionchange",
  VisibilityChange = "visibilitychange"
}

enum mt {
  Down = "ArrowDown",
  Enter = "Enter",
  Esc = "Escape",
  Left = "ArrowLeft",
  Right = "ArrowRight",
  Space = "Space",
  Up = "ArrowUp"
}
const vt = {
    start: [mt.Space, mt.Enter],
    cancel: [mt.Esc],
    end: [mt.Space, mt.Enter]
  },
  yt = (e, { currentCoordinates: t }) => {
    switch (e.code) {
      case mt.Right:
        return {
          ...t,
          x: t.x + 25
        }
      case mt.Left:
        return {
          ...t,
          x: t.x - 25
        }
      case mt.Down:
        return {
          ...t,
          y: t.y + 25
        }
      case mt.Up:
        return {
          ...t,
          y: t.y - 25
        }
    }
  }
class bt {
  constructor(e) {
    ;(this.props = void 0), (this.autoScrollEnabled = !1), (this.coordinates = Oe), (this.listeners = void 0), (this.windowListeners = void 0), (this.props = e)
    const {
      event: { target: t }
    } = e
    ;(this.props = e),
      (this.listeners = new ut($(t))),
      (this.windowListeners = new ut(G(t))),
      (this.handleKeyDown = this.handleKeyDown.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      this.attach()
  }
  attach() {
    this.handleStart(),
      this.windowListeners.add(pt.Resize, this.handleCancel),
      this.windowListeners.add(pt.VisibilityChange, this.handleCancel),
      setTimeout(() => this.listeners.add(pt.Keydown, this.handleKeyDown))
  }
  handleStart() {
    const { activeNode: e, onStart: t } = this.props
    if (!e.node.current) throw new Error("Active draggable node is undefined")
    const n = Re(e.node.current),
      i = {
        x: n.left,
        y: n.top
      }
    ;(this.coordinates = i), t(i)
  }
  handleKeyDown(e) {
    if (ne(e)) {
      const { coordinates: t } = this,
        { active: n, context: i, options: s } = this.props,
        { keyboardCodes: r = vt, coordinateGetter: a = yt, scrollBehavior: o = "smooth" } = s,
        { code: l } = e
      if (r.end.includes(l)) return void this.handleEnd(e)
      if (r.cancel.includes(l)) return void this.handleCancel(e)
      const c = a(e, {
        active: n,
        context: i.current,
        currentCoordinates: t
      })
      if (c) {
        const n = {
            x: 0,
            y: 0
          },
          { scrollableAncestors: s } = i.current
        for (const i of s) {
          const s = e.code,
            r = te(c, t),
            { isTop: a, isRight: l, isLeft: d, isBottom: u, maxScroll: h, minScroll: p } = Ve(i),
            m = ze(i),
            f = {
              x: Math.min(s === mt.Right ? m.right - m.width / 2 : m.right, Math.max(s === mt.Right ? m.left : m.left + m.width / 2, c.x)),
              y: Math.min(s === mt.Down ? m.bottom - m.height / 2 : m.bottom, Math.max(s === mt.Down ? m.top : m.top + m.height / 2, c.y))
            },
            g = (s === mt.Right && !l) || (s === mt.Left && !d),
            v = (s === mt.Down && !u) || (s === mt.Up && !a)
          if (g && f.x !== c.x) {
            if ((s === mt.Right && i.scrollLeft + r.x <= h.x) || (s === mt.Left && i.scrollLeft + r.x >= p.x))
              return void i.scrollBy({
                left: r.x,
                behavior: o
              })
            ;(n.x = s === mt.Right ? i.scrollLeft - h.x : i.scrollLeft - p.x),
              i.scrollBy({
                left: -n.x,
                behavior: o
              })
            break
          }
          if (v && f.y !== c.y) {
            if ((s === mt.Down && i.scrollTop + r.y <= h.y) || (s === mt.Up && i.scrollTop + r.y >= p.y))
              return void i.scrollBy({
                top: r.y,
                behavior: o
              })
            ;(n.y = s === mt.Down ? i.scrollTop - h.y : i.scrollTop - p.y),
              i.scrollBy({
                top: -n.y,
                behavior: o
              })
            break
          }
        }
        this.handleMove(e, ee(c, n))
      }
    }
  }
  handleMove(e, t) {
    const { onMove: n } = this.props
    e.preventDefault(), n(t), (this.coordinates = t)
  }
  handleEnd(e) {
    const { onEnd: t } = this.props
    e.preventDefault(), this.detach(), t()
  }
  handleCancel(e) {
    const { onCancel: t } = this.props
    e.preventDefault(), this.detach(), t()
  }
  detach() {
    this.listeners.removeAll(), this.windowListeners.removeAll()
  }
}
function Et(e) {
  return Boolean(e && "distance" in e)
}
function St(e) {
  return Boolean(e && "delay" in e)
}
bt.activators = [
  {
    eventName: "onKeyDown",
    handler: (e, { keyboardCodes: t = vt, onActivation: n }) => {
      const { code: i } = e.nativeEvent
      return (
        !!t.start.includes(i) &&
        (e.preventDefault(),
        null == n ||
          n({
            event: e.nativeEvent
          }),
        !0)
      )
    }
  }
]
class Ot {
  constructor(
    e,
    t,
    n = (function (e) {
      const { EventTarget: t } = G(e)
      return e instanceof t ? e : $(e)
    })(e.event.target)
  ) {
    var i
    ;(this.props = void 0),
      (this.events = void 0),
      (this.autoScrollEnabled = !0),
      (this.document = void 0),
      (this.activated = !1),
      (this.initialCoordinates = void 0),
      (this.timeoutId = null),
      (this.listeners = void 0),
      (this.documentListeners = void 0),
      (this.windowListeners = void 0),
      (this.props = e),
      (this.events = t)
    const { event: s } = e,
      { target: r } = s
    ;(this.props = e),
      (this.events = t),
      (this.document = $(r)),
      (this.documentListeners = new ut(this.document)),
      (this.listeners = new ut(n)),
      (this.windowListeners = new ut(G(r))),
      (this.initialCoordinates = null != (i = ie(s)) ? i : Oe),
      (this.handleStart = this.handleStart.bind(this)),
      (this.handleMove = this.handleMove.bind(this)),
      (this.handleEnd = this.handleEnd.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      (this.handleKeydown = this.handleKeydown.bind(this)),
      (this.removeTextSelection = this.removeTextSelection.bind(this)),
      this.attach()
  }
  attach() {
    const {
      events: e,
      props: {
        options: { activationConstraint: t }
      }
    } = this
    if (
      (this.listeners.add(e.move.name, this.handleMove, {
        passive: !1
      }),
      this.listeners.add(e.end.name, this.handleEnd),
      this.windowListeners.add(pt.Resize, this.handleCancel),
      this.windowListeners.add(pt.DragStart, ft),
      this.windowListeners.add(pt.VisibilityChange, this.handleCancel),
      this.windowListeners.add(pt.ContextMenu, ft),
      this.documentListeners.add(pt.Keydown, this.handleKeydown),
      t)
    ) {
      if (Et(t)) return
      if (St(t)) return void (this.timeoutId = setTimeout(this.handleStart, t.delay))
    }
    this.handleStart()
  }
  detach() {
    this.listeners.removeAll(),
      this.windowListeners.removeAll(),
      setTimeout(this.documentListeners.removeAll, 50),
      null !== this.timeoutId && (clearTimeout(this.timeoutId), (this.timeoutId = null))
  }
  handleStart() {
    const { initialCoordinates: e } = this,
      { onStart: t } = this.props
    e &&
      ((this.activated = !0),
      this.documentListeners.add(pt.Click, gt, {
        capture: !0
      }),
      this.removeTextSelection(),
      this.documentListeners.add(pt.SelectionChange, this.removeTextSelection),
      t(e))
  }
  handleMove(e) {
    var t
    const { activated: n, initialCoordinates: i, props: s } = this,
      {
        onMove: r,
        options: { activationConstraint: a }
      } = s
    if (!i) return
    const o = null != (t = ie(e)) ? t : Oe,
      l = te(i, o)
    if (!n && a) {
      if (St(a)) return ht(l, a.tolerance) ? this.handleCancel() : void 0
      if (Et(a)) return null != a.tolerance && ht(l, a.tolerance) ? this.handleCancel() : ht(l, a.distance) ? this.handleStart() : void 0
    }
    e.cancelable && e.preventDefault(), r(o)
  }
  handleEnd() {
    const { onEnd: e } = this.props
    this.detach(), e()
  }
  handleCancel() {
    const { onCancel: e } = this.props
    this.detach(), e()
  }
  handleKeydown(e) {
    e.code === mt.Esc && this.handleCancel()
  }
  removeTextSelection() {
    var e
    null == (e = this.document.getSelection()) || e.removeAllRanges()
  }
}
const Tt = {
  move: {
    name: "pointermove"
  },
  end: {
    name: "pointerup"
  }
}
class _t extends Ot {
  constructor(e) {
    const { event: t } = e,
      n = $(t.target)
    super(e, Tt, n)
  }
}
_t.activators = [
  {
    eventName: "onPointerDown",
    handler: ({ nativeEvent: e }, { onActivation: t }) =>
      !(!e.isPrimary || 0 !== e.button) &&
      (null == t ||
        t({
          event: e
        }),
      !0)
  }
]
const wt = {
  move: {
    name: "mousemove"
  },
  end: {
    name: "mouseup"
  }
}
enum At {
  RightClick = 2
}
class Nt extends Ot {
  constructor(e) {
    super(e, wt, $(e.event.target))
  }
}
Nt.activators = [
  {
    eventName: "onMouseDown",
    handler: ({ nativeEvent: e }, { onActivation: t }) =>
      e.button !== At.RightClick &&
      (null == t ||
        t({
          event: e
        }),
      !0)
  }
]
const It = {
  move: {
    name: "touchmove"
  },
  end: {
    name: "touchend"
  }
}
class Pt extends Ot {
  constructor(e) {
    super(e, It)
  }
  static setup() {
    return (
      window.addEventListener(It.move.name, e, {
        capture: !1,
        passive: !1
      }),
      function () {
        window.removeEventListener(It.move.name, e)
      }
    )
    function e() {}
  }
}
function xt(e, { transform: t, ...n }) {
  return (null == e ? void 0 : e.length)
    ? e.reduce(
        (e, t) =>
          t({
            transform: e,
            ...n
          }),
        t
      )
    : t
}
Pt.activators = [
  {
    eventName: "onTouchStart",
    handler: ({ nativeEvent: e }, { onActivation: t }) => {
      const { touches: n } = e
      return (
        !(n.length > 1) &&
        (null == t ||
          t({
            event: e
          }),
        !0)
      )
    }
  }
]
const kt = [
    {
      sensor: _t,
      options: {}
    },
    {
      sensor: bt,
      options: {}
    }
  ],
  Lt = {
    current: {}
  },
  Ct = (0, s.createContext)({
    ...Oe,
    scaleX: 1,
    scaleY: 1
  }),
  Dt = (0, s.memo)(function ({
    id: e,
    autoScroll: t = !0,
    announcements: n,
    children: i,
    sensors: r = kt,
    collisionDetection: a = xe,
    measuring: o,
    modifiers: l,
    screenReaderInstructions: c = ce,
    ...d
  }) {
    var u, h, p, m, f, g, v
    const y = (0, s.useReducer)(be, void 0, ye),
      [b, E] = y,
      [S, O] = (0, s.useState)(() => ({
        type: null,
        event: null
      })),
      [T, _] = (0, s.useState)(!1),
      {
        draggable: { active: A, nodes: N, translate: I },
        droppable: { containers: P }
      } = b,
      x = A ? N[A] : null,
      k = (0, s.useRef)({
        initial: null,
        translated: null
      }),
      L = (0, s.useMemo)(() => {
        var e
        return null != A
          ? {
              id: A,
              data: null != (e = null == x ? void 0 : x.data) ? e : Lt,
              rect: k
            }
          : null
      }, [A, x]),
      C = (0, s.useRef)(null),
      [D, R] = (0, s.useState)(null),
      [M, j] = (0, s.useState)(null),
      U = Y(d, Object.values(d)),
      F = X("DndDescribedBy", e),
      B = (0, s.useMemo)(() => P.getEnabled(), [P]),
      {
        droppableRects: V,
        measureDroppableContainers: G,
        measuringScheduled: W
      } = (function (e, { dragging: t, dependencies: n, config: i }) {
        const [r, a] = (0, s.useState)(null),
          o = null != r,
          {
            frequency: l,
            measure: c,
            strategy: d
          } = {
            ...tt,
            ...i
          },
          u = (0, s.useRef)(e),
          h = (0, s.useCallback)((e = []) => a(t => (t ? t.concat(e) : e)), []),
          p = (0, s.useRef)(null),
          m = (function () {
            switch (d) {
              case Qe.Always:
                return !1
              case Qe.BeforeDragging:
                return t
              default:
                return !t
            }
          })(),
          f = q(
            n => {
              if (m && !t) return et
              const i = r
              if (!n || n === et || u.current !== e || null != i) {
                const t = new Map()
                for (let n of e) {
                  if (!n) continue
                  if (i && i.length > 0 && !i.includes(n.id) && n.rect.current) {
                    t.set(n.id, n.rect.current)
                    continue
                  }
                  const e = n.node.current,
                    s = e ? new Ye(c(e), e) : null
                  ;(n.rect.current = s), s && t.set(n.id, s)
                }
                return t
              }
              return n
            },
            [e, r, t, m, c]
          )
        return (
          (0, s.useEffect)(() => {
            u.current = e
          }, [e]),
          (0, s.useEffect)(() => {
            m || requestAnimationFrame(() => h())
          }, [t, m]),
          (0, s.useEffect)(() => {
            o && a(null)
          }, [o]),
          (0, s.useEffect)(() => {
            m ||
              "number" != typeof l ||
              null !== p.current ||
              (p.current = setTimeout(() => {
                h(), (p.current = null)
              }, l))
          }, [l, m, h, ...n]),
          {
            droppableRects: f,
            measureDroppableContainers: h,
            measuringScheduled: o
          }
        )
      })(B, {
        dragging: T,
        dependencies: [I.x, I.y],
        config: null == o ? void 0 : o.droppable
      }),
      $ = (function (e, t) {
        const n = null !== t ? e[t] : void 0,
          i = n ? n.node.current : null
        return q(
          e => {
            var n
            return null === t ? null : null != (n = null != i ? i : e) ? n : null
          },
          [i, t]
        )
      })(N, A),
      Q = M ? ie(M) : null,
      J = at($, null != (u = null == o || null == (h = o.draggable) ? void 0 : h.measure) ? u : Re),
      te = st($ ? $.parentElement : null),
      ne = (0, s.useRef)({
        active: null,
        activeNode: $,
        collisionRect: null,
        collisions: null,
        droppableRects: V,
        draggableNodes: N,
        draggingNode: null,
        draggingNodeRect: null,
        droppableContainers: P,
        over: null,
        scrollableAncestors: [],
        scrollAdjustedTranslate: null
      }),
      se = P.getNodeFor(null == (p = ne.current.over) ? void 0 : p.id),
      re = (function ({ measure: e = De }) {
        const [t, n] = (0, s.useState)(null),
          i = nt({
            onResize: (0, s.useCallback)(
              t => {
                for (const { target: i } of t)
                  if (z(i)) {
                    n(t => {
                      const n = e(i)
                      return t
                        ? {
                            ...t,
                            width: n.width,
                            height: n.height
                          }
                        : n
                    })
                    break
                  }
              },
              [e]
            )
          }),
          r = (0, s.useCallback)(
            t => {
              const s = ct(t)
              null == i || i.disconnect(), s && (null == i || i.observe(s)), n(s ? e(s) : null)
            },
            [e, i]
          ),
          [a, o] = Z(r)
        return (0, s.useMemo)(
          () => ({
            nodeRef: a,
            rect: t,
            setRef: o
          }),
          [t, a, o]
        )
      })({
        measure: null == o || null == (m = o.dragOverlay) ? void 0 : m.measure
      }),
      ae = null != (f = re.nodeRef.current) ? f : $,
      oe = null != (g = re.rect) ? g : J,
      le = (0, s.useRef)(null),
      de = le.current,
      he =
        oe === J
          ? ((me = de),
            (pe = J) && me
              ? {
                  x: pe.left - me.left,
                  y: pe.top - me.top
                }
              : Oe)
          : Oe
    var pe, me
    const fe =
      ((Te = ae ? ae.ownerDocument.defaultView : null),
      (0, s.useMemo)(
        () =>
          Te
            ? (function (e) {
                const t = e.innerWidth,
                  n = e.innerHeight
                return {
                  top: 0,
                  left: 0,
                  right: t,
                  bottom: n,
                  width: t,
                  height: n
                }
              })(Te)
            : null,
        [Te]
      ))
    var Te
    const _e = (function (e) {
        const t = (0, s.useRef)(e),
          n = q(n => (e ? (n && e && t.current && e.parentNode === t.current.parentNode ? n : Me(e)) : it), [e])
        return (
          (0, s.useEffect)(() => {
            t.current = e
          }, [e]),
          n
        )
      })(A ? (null != se ? se : ae) : null),
      we = rt(_e),
      Ae = xt(l, {
        transform: {
          x: I.x - he.x,
          y: I.y - he.y,
          scaleX: 1,
          scaleY: 1
        },
        activatorEvent: M,
        active: L,
        activeNodeRect: J,
        containerNodeRect: te,
        draggingNodeRect: oe,
        over: ne.current.over,
        overlayNodeRect: re.rect,
        scrollableAncestors: _e,
        scrollableAncestorRects: we,
        windowRect: fe
      }),
      Ne = Q ? ee(Q, I) : null,
      Ie = (function (e) {
        const [t, n] = (0, s.useState)(null),
          i = (0, s.useRef)(e),
          r = (0, s.useCallback)(e => {
            const t = je(e.target)
            t && n(e => (e ? (e.set(t, He(t)), new Map(e)) : null))
          }, [])
        return (
          (0, s.useEffect)(() => {
            const t = i.current
            if (e !== t) {
              s(t)
              const a = e
                .map(e => {
                  const t = je(e)
                  return t
                    ? (t.addEventListener("scroll", r, {
                        passive: !0
                      }),
                      [t, He(t)])
                    : null
                })
                .filter(e => null != e)
              n(a.length ? new Map(a) : null), (i.current = e)
            }
            return () => {
              s(e), s(t)
            }
            function s(e) {
              e.forEach(e => {
                const t = je(e)
                null == t || t.removeEventListener("scroll", r)
              })
            }
          }, [r, e]),
          (0, s.useMemo)(() => (e.length ? (t ? Array.from(t.values()).reduce((e, t) => ee(e, t), Oe) : $e(e)) : Oe), [e, t])
        )
      })(_e),
      Pe = ee(Ae, Ie),
      ke = oe ? Le(oe, Ae) : null,
      Ce =
        L && ke
          ? a({
              active: L,
              collisionRect: ke,
              droppableContainers: B,
              pointerCoordinates: Ne
            })
          : null,
      Ue = (function (e, t) {
        if (!e || 0 === e.length) return null
        const [n] = e
        return t ? n[t] : n
      })(Ce, "id"),
      [Fe, Be] = (0, s.useState)(null),
      Ve = (function (e, t, n) {
        return {
          ...e,
          scaleX: t && n ? t.width / n.width : 1,
          scaleY: t && n ? t.height / n.height : 1
        }
      })(Ae, null != (v = null == Fe ? void 0 : Fe.rect) ? v : null, J),
      Ge = (0, s.useCallback)(
        (e, { sensor: t, options: n }) => {
          if (!C.current) return
          const i = N[C.current]
          if (!i) return
          const s = new t({
            active: C.current,
            activeNode: i,
            event: e.nativeEvent,
            options: n,
            context: ne,
            onStart(e) {
              const t = C.current
              if (!t) return
              const n = N[t]
              if (!n) return
              const { onDragStart: i } = U.current,
                s = {
                  active: {
                    id: t,
                    data: n.data,
                    rect: k
                  }
                }
              ;(0, w.unstable_batchedUpdates)(() => {
                E({
                  type: ue.DragStart,
                  initialCoordinates: e,
                  active: t
                }),
                  O({
                    type: ue.DragStart,
                    event: s
                  })
              }),
                null == i || i(s)
            },
            onMove(e) {
              E({
                type: ue.DragMove,
                coordinates: e
              })
            },
            onEnd: r(ue.DragEnd),
            onCancel: r(ue.DragCancel)
          })
          function r(e) {
            return async function () {
              const { active: t, collisions: n, over: i, scrollAdjustedTranslate: s } = ne.current
              let r = null
              if (t && s) {
                const { cancelDrop: a } = U.current
                if (
                  ((r = {
                    active: t,
                    collisions: n,
                    delta: s,
                    over: i
                  }),
                  e === ue.DragEnd && "function" == typeof a)
                ) {
                  ;(await Promise.resolve(a(r))) && (e = ue.DragCancel)
                }
              }
              ;(C.current = null),
                (0, w.unstable_batchedUpdates)(() => {
                  if (
                    (E({
                      type: e
                    }),
                    Be(null),
                    _(!1),
                    R(null),
                    j(null),
                    r &&
                      O({
                        type: e,
                        event: r
                      }),
                    r)
                  ) {
                    const { onDragCancel: t, onDragEnd: n } = U.current,
                      i = e === ue.DragEnd ? n : t
                    null == i || i(r)
                  }
                })
            }
          }
          ;(0, w.unstable_batchedUpdates)(() => {
            R(s), j(e.nativeEvent)
          })
        },
        [N]
      ),
      We = (function (e, t) {
        return (0, s.useMemo)(
          () =>
            e.reduce((e, n) => {
              const { sensor: i } = n
              return [
                ...e,
                ...i.activators.map(e => ({
                  eventName: e.eventName,
                  handler: t(e.handler, n)
                }))
              ]
            }, []),
          [e, t]
        )
      })(
        r,
        (0, s.useCallback)(
          (e, t) => (n, i) => {
            const s = n.nativeEvent
            null !== C.current ||
              s.dndKit ||
              s.defaultPrevented ||
              (!0 === e(n, t.options) &&
                ((s.dndKit = {
                  capturedBy: t.sensor
                }),
                (C.current = i),
                Ge(n, t)))
          },
          [Ge]
        )
      )
    !(function (e) {
      ;(0, s.useEffect)(
        () => {
          if (!H) return
          const t = e.map(({ sensor: e }) => (null == e.setup ? void 0 : e.setup()))
          return () => {
            for (const e of t) null == e || e()
          }
        },
        e.map(({ sensor: e }) => e)
      )
    })(r),
      (0, s.useEffect)(() => {
        null != A && _(!0)
      }, [A]),
      (0, s.useEffect)(() => {
        L || (le.current = null), L && J && !le.current && (le.current = J)
      }, [J, L]),
      (0, s.useEffect)(() => {
        const { onDragMove: e } = U.current,
          { active: t, collisions: n, over: i } = ne.current
        if (!t) return
        const s = {
          active: t,
          collisions: n,
          delta: {
            x: Pe.x,
            y: Pe.y
          },
          over: i
        }
        O({
          type: ue.DragMove,
          event: s
        }),
          null == e || e(s)
      }, [Pe.x, Pe.y]),
      (0, s.useEffect)(() => {
        const { active: e, collisions: t, droppableContainers: n, scrollAdjustedTranslate: i } = ne.current
        if (!e || !C.current || !i) return
        const { onDragOver: s } = U.current,
          r = n.get(Ue),
          a =
            r && r.rect.current
              ? {
                  id: r.id,
                  rect: r.rect.current,
                  data: r.data,
                  disabled: r.disabled
                }
              : null,
          o = {
            active: e,
            collisions: t,
            delta: {
              x: i.x,
              y: i.y
            },
            over: a
          }
        ;(0, w.unstable_batchedUpdates)(() => {
          Be(a),
            O({
              type: ue.DragOver,
              event: o
            }),
            null == s || s(o)
        })
      }, [Ue]),
      K(() => {
        ;(ne.current = {
          active: L,
          activeNode: $,
          collisionRect: ke,
          collisions: Ce,
          droppableRects: V,
          draggableNodes: N,
          draggingNode: ae,
          draggingNodeRect: oe,
          droppableContainers: P,
          over: Fe,
          scrollableAncestors: _e,
          scrollAdjustedTranslate: Pe
        }),
          (k.current = {
            initial: oe,
            translated: ke
          })
      }, [L, $, Ce, ke, N, ae, oe, V, P, Fe, _e, Pe]),
      Je({
        ...(function () {
          const e = !1 === (null == D ? void 0 : D.autoScrollEnabled),
            n = "object" == typeof t ? !1 === t.enabled : !1 === t,
            i = !e && !n
          if ("object" == typeof t)
            return {
              ...t,
              enabled: i
            }
          return {
            enabled: i
          }
        })(),
        draggingRect: ke,
        pointerCoordinates: Ne,
        scrollableAncestors: _e,
        scrollableAncestorRects: we
      })
    const ze = (0, s.useMemo)(
        () => ({
          active: L,
          activeNode: $,
          activeNodeRect: J,
          activatorEvent: M,
          collisions: Ce,
          containerNodeRect: te,
          dragOverlay: re,
          draggableNodes: N,
          droppableContainers: P,
          droppableRects: V,
          over: Fe,
          measureDroppableContainers: G,
          scrollableAncestors: _e,
          scrollableAncestorRects: we,
          measuringScheduled: W,
          windowRect: fe
        }),
        [L, $, J, M, Ce, te, re, N, P, V, Fe, G, _e, we, W, fe]
      ),
      Ke = (0, s.useMemo)(
        () => ({
          activatorEvent: M,
          activators: We,
          active: L,
          activeNodeRect: J,
          ariaDescribedById: {
            draggable: F
          },
          dispatch: E,
          draggableNodes: N,
          over: Fe,
          measureDroppableContainers: G
        }),
        [M, We, L, J, E, F, N, Fe, G]
      )
    return s.createElement(
      Ee.Provider,
      {
        value: S
      },
      s.createElement(
        ge.Provider,
        {
          value: Ke
        },
        s.createElement(
          ve.Provider,
          {
            value: ze
          },
          s.createElement(
            Ct.Provider,
            {
              value: Ve
            },
            i
          )
        )
      ),
      s.createElement(Se, {
        announcements: n,
        hiddenTextDescribedById: F,
        screenReaderInstructions: c
      })
    )
  }),
  Rt = (0, s.createContext)(null),
  Mt = "button"
function jt({ id: e, data: t, disabled: n = !1, attributes: i }) {
  const r = X("Droppable"),
    { activators: a, activatorEvent: o, active: l, activeNodeRect: c, ariaDescribedById: d, draggableNodes: u, over: h } = (0, s.useContext)(ge),
    { role: p = Mt, roleDescription: m = "draggable", tabIndex: f = 0 } = null != i ? i : {},
    g = (null == l ? void 0 : l.id) === e,
    v = (0, s.useContext)(g ? Ct : Rt),
    [y, b] = Z(),
    E = (function (e, t) {
      return (0, s.useMemo)(
        () =>
          e.reduce(
            (e, { eventName: n, handler: i }) => (
              (e[n] = e => {
                i(e, t)
              }),
              e
            ),
            {}
          ),
        [e, t]
      )
    })(a, e),
    S = Y(t)
  K(
    () => (
      (u[e] = {
        id: e,
        key: r,
        node: y,
        data: S
      }),
      () => {
        const t = u[e]
        t && t.key === r && delete u[e]
      }
    ),
    [u, e]
  )
  return {
    active: l,
    activatorEvent: o,
    activeNodeRect: c,
    attributes: (0, s.useMemo)(
      () => ({
        role: p,
        tabIndex: f,
        "aria-pressed": !(!g || p !== Mt) || void 0,
        "aria-roledescription": m,
        "aria-describedby": d.draggable
      }),
      [p, f, g, m, d.draggable]
    ),
    isDragging: g,
    listeners: n ? void 0 : E,
    node: y,
    over: h,
    setNodeRef: b,
    transform: v
  }
}
function Ut() {
  return (0, s.useContext)(ve)
}
const Ft = {
  timeout: 25
}
const Ht = {
  duration: 250,
  easing: "ease",
  dragSourceOpacity: 0
}
const Bt = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1
  },
  Vt = e => (ne(e) ? "transform 250ms ease" : void 0),
  Gt = s.memo(
    ({
      adjustScale: e = !1,
      children: t,
      dropAnimation: n = Ht,
      style: i,
      transition: r = Vt,
      modifiers: a,
      wrapperElement: o = "div",
      className: l,
      zIndex: c = 999
    }) => {
      var d, u
      const {
          active: h,
          activeNodeRect: p,
          containerNodeRect: m,
          draggableNodes: f,
          activatorEvent: g,
          over: v,
          dragOverlay: y,
          scrollableAncestors: b,
          scrollableAncestorRects: E,
          windowRect: S
        } = Ut(),
        O = (0, s.useContext)(Ct),
        T = xt(a, {
          activatorEvent: g,
          active: h,
          activeNodeRect: p,
          containerNodeRect: m,
          draggingNodeRect: y.rect,
          over: v,
          overlayNodeRect: y.rect,
          scrollableAncestors: b,
          scrollableAncestorRects: E,
          transform: O,
          windowRect: S
        }),
        _ = null !== h,
        w = e
          ? T
          : {
              ...T,
              scaleX: 1,
              scaleY: 1
            },
        A = q(
          e =>
            _
              ? e ||
                (p
                  ? {
                      ...p
                    }
                  : null)
              : null,
          [_, p]
        ),
        N = A
          ? {
              position: "fixed",
              width: A.width,
              height: A.height,
              top: A.top,
              left: A.left,
              zIndex: c,
              transform: se.Transform.toString(w),
              touchAction: "none",
              transformOrigin: e && g ? _e(g, A) : void 0,
              transition: "function" == typeof r ? r(g) : r,
              ...i
            }
          : void 0,
        I = _
          ? {
              style: N,
              children: t,
              className: l,
              transform: w
            }
          : void 0,
        P = (0, s.useRef)(I),
        x = null != I ? I : P.current,
        { children: k, transform: L, ...C } = null != x ? x : {},
        D = (0, s.useRef)(null != (d = null == h ? void 0 : h.id) ? d : null),
        R = (function ({ animate: e, adjustScale: t, activeId: n, draggableNodes: i, duration: r, dragSourceOpacity: a, easing: o, node: l, transform: c }) {
          const [d, u] = (0, s.useState)(!1)
          return (
            K(() => {
              var s
              if (!(e && n && o && r)) return void (e && u(!0))
              const d = null == (s = i[n]) ? void 0 : s.node.current
              if (c && l && d && null !== d.parentNode) {
                const e = ct(l)
                if (e) {
                  const n = e.getBoundingClientRect(),
                    i = Re(d),
                    s = {
                      x: n.left - i.left,
                      y: n.top - i.top
                    }
                  if (Math.abs(s.x) || Math.abs(s.y)) {
                    const e = {
                        scaleX: t ? (i.width * c.scaleX) / n.width : 1,
                        scaleY: t ? (i.height * c.scaleY) / n.height : 1
                      },
                      h = se.Transform.toString({
                        x: c.x - s.x,
                        y: c.y - s.y,
                        ...e
                      }),
                      p = d.style.opacity
                    return (
                      null != a && (d.style.opacity = `${a}`),
                      void (l.animate(
                        [
                          {
                            transform: se.Transform.toString(c)
                          },
                          {
                            transform: h
                          }
                        ],
                        {
                          easing: o,
                          duration: r
                        }
                      ).onfinish = () => {
                        ;(l.style.display = "none"), u(!0), d && null != a && (d.style.opacity = p)
                      })
                    )
                  }
                }
              }
              u(!0)
            }, [e, n, t, i, r, o, a, l, c]),
            K(() => {
              d && u(!1)
            }, [d]),
            d
          )
        })({
          animate: Boolean(n && D.current && !h),
          adjustScale: e,
          activeId: D.current,
          draggableNodes: f,
          duration: null == n ? void 0 : n.duration,
          easing: null == n ? void 0 : n.easing,
          dragSourceOpacity: null == n ? void 0 : n.dragSourceOpacity,
          node: y.nodeRef.current,
          transform: null == (u = P.current) ? void 0 : u.transform
        }),
        M = Boolean(k && (t || (n && !R)))
      return (
        (0, s.useEffect)(() => {
          var e
          ;(null == h ? void 0 : h.id) !== D.current && (D.current = null != (e = null == h ? void 0 : h.id) ? e : null)
          h && P.current !== I && (P.current = I)
        }, [h, I]),
        (0, s.useEffect)(() => {
          R && (P.current = void 0)
        }, [R]),
        M
          ? s.createElement(
              ge.Provider,
              {
                value: fe
              },
              s.createElement(
                Ct.Provider,
                {
                  value: Bt
                },
                s.createElement(
                  o,
                  {
                    ...C,
                    ref: y.setRef
                  },
                  k
                )
              )
            )
          : null
      )
    }
  )
function Wt(e, t, n) {
  const i = e.slice()
  return i.splice(n < 0 ? i.length + n : n, 0, i.splice(t, 1)[0]), i
}
function zt(e, t) {
  return e.reduce((e, n, i) => {
    const s = t.get(n)
    return s && (e[i] = s), e
  }, Array(e.length))
}
function $t(e) {
  return null !== e && e >= 0
}
const Kt = {
    scaleX: 1,
    scaleY: 1
  },
  Yt = ({ rects: e, activeNodeRect: t, activeIndex: n, overIndex: i, index: s }) => {
    var r
    const a = null != (r = e[n]) ? r : t
    if (!a) return null
    const o = (function (e, t, n) {
      const i = e[t],
        s = e[t - 1],
        r = e[t + 1]
      if (!i || (!s && !r)) return 0
      if (n < t) return s ? i.left - (s.left + s.width) : r.left - (i.left + i.width)
      return r ? r.left - (i.left + i.width) : i.left - (s.left + s.width)
    })(e, s, n)
    if (s === n) {
      const t = e[i]
      return t
        ? {
            x: n < i ? t.left + t.width - (a.left + a.width) : t.left - a.left,
            y: 0,
            ...Kt
          }
        : null
    }
    return s > n && s <= i
      ? {
          x: -a.width - o,
          y: 0,
          ...Kt
        }
      : s < n && s >= i
        ? {
            x: a.width + o,
            y: 0,
            ...Kt
          }
        : {
            x: 0,
            y: 0,
            ...Kt
          }
  }
const qt = ({ rects: e, activeIndex: t, overIndex: n, index: i }) => {
    const s = Wt(e, n, t),
      r = e[i],
      a = s[i]
    return a && r
      ? {
          x: a.left - r.left,
          y: a.top - r.top,
          scaleX: a.width / r.width,
          scaleY: a.height / r.height
        }
      : null
  },
  Zt = {
    scaleX: 1,
    scaleY: 1
  },
  Qt = ({ activeIndex: e, activeNodeRect: t, index: n, rects: i, overIndex: s }) => {
    var r
    const a = null != (r = i[e]) ? r : t
    if (!a) return null
    if (n === e) {
      const t = i[s]
      return t
        ? {
            x: 0,
            y: e < s ? t.top + t.height - (a.top + a.height) : t.top - a.top,
            ...Zt
          }
        : null
    }
    const o = (function (e, t, n) {
      const i = e[t],
        s = e[t - 1],
        r = e[t + 1]
      if (!i) return 0
      if (n < t) return s ? i.top - (s.top + s.height) : r ? r.top - (i.top + i.height) : 0
      return r ? r.top - (i.top + i.height) : s ? i.top - (s.top + s.height) : 0
    })(i, n, e)
    return n > e && n <= s
      ? {
          x: 0,
          y: -a.height - o,
          ...Zt
        }
      : n < e && n >= s
        ? {
            x: 0,
            y: a.height + o,
            ...Zt
          }
        : {
            x: 0,
            y: 0,
            ...Zt
          }
  }
const Xt = "Sortable",
  Jt = s.createContext({
    activeIndex: -1,
    containerId: Xt,
    disableTransforms: !1,
    items: [],
    overIndex: -1,
    useDragOverlay: !1,
    sortedRects: [],
    strategy: qt
  })
function en({ children: e, id: t, items: n, strategy: i = qt }) {
  const { active: r, dragOverlay: a, droppableRects: o, over: l, measureDroppableContainers: c, measuringScheduled: d } = Ut(),
    u = X(Xt, t),
    h = Boolean(null !== a.rect),
    p = (0, s.useMemo)(() => n.map(e => ("string" == typeof e ? e : e.id)), [n]),
    m = null != r,
    f = r ? p.indexOf(r.id) : -1,
    g = l ? p.indexOf(l.id) : -1,
    v = (0, s.useRef)(p),
    y = ((b = p), (E = v.current), !(b.join() === E.join()))
  var b, E
  const S = (-1 !== g && -1 === f) || y
  K(() => {
    y && m && !d && c(p)
  }, [y, p, m, c, d]),
    (0, s.useEffect)(() => {
      v.current = p
    }, [p])
  const O = (0, s.useMemo)(
    () => ({
      activeIndex: f,
      containerId: u,
      disableTransforms: S,
      items: p,
      overIndex: g,
      useDragOverlay: h,
      sortedRects: zt(p, o),
      strategy: i
    }),
    [f, u, S, p, g, o, h, i]
  )
  return s.createElement(
    Jt.Provider,
    {
      value: O
    },
    e
  )
}
const tn = ({ id: e, items: t, activeIndex: n, overIndex: i }) => Wt(t, n, i).indexOf(e),
  nn = ({ containerId: e, isSorting: t, wasDragging: n, index: i, items: s, newIndex: r, previousItems: a, previousContainerId: o, transition: l }) =>
    !(!l || !n) && (a === s || i !== r) && (!!t || (r !== i && e === o)),
  sn = {
    duration: 200,
    easing: "ease"
  },
  rn = "transform",
  an = se.Transition.toString({
    property: rn,
    duration: 0,
    easing: "linear"
  }),
  on = {
    roleDescription: "sortable"
  }
function ln({
  animateLayoutChanges: e = nn,
  attributes: t,
  disabled: n,
  data: i,
  getNewIndex: r = tn,
  id: a,
  strategy: o,
  resizeObserverConfig: l,
  transition: c = sn
}) {
  const {
      items: d,
      containerId: u,
      activeIndex: h,
      disableTransforms: p,
      sortedRects: m,
      overIndex: f,
      useDragOverlay: g,
      strategy: v
    } = (0, s.useContext)(Jt),
    y = d.indexOf(a),
    b = (0, s.useMemo)(
      () => ({
        sortable: {
          containerId: u,
          index: y,
          items: d
        },
        ...i
      }),
      [u, i, y, d]
    ),
    E = (0, s.useMemo)(() => d.slice(d.indexOf(a)), [d, a]),
    {
      rect: S,
      node: O,
      isOver: T,
      setNodeRef: _
    } = (function ({ data: e, disabled: t = !1, id: n, resizeObserverConfig: i }) {
      const r = X("Droppable"),
        { active: a, dispatch: o, over: l, measureDroppableContainers: c } = (0, s.useContext)(ge),
        d = (0, s.useRef)(!1),
        u = (0, s.useRef)(null),
        h = (0, s.useRef)(null),
        {
          disabled: p,
          updateMeasurementsFor: m,
          timeout: f
        } = {
          ...Ft,
          ...i
        },
        g = Y(null != m ? m : n),
        v = nt({
          onResize: (0, s.useCallback)(() => {
            d.current
              ? (null != h.current && clearTimeout(h.current),
                (h.current = setTimeout(() => {
                  c("string" == typeof g.current ? [g.current] : g.current), (h.current = null)
                }, f)))
              : (d.current = !0)
          }, [f]),
          disabled: p || !a
        }),
        y = (0, s.useCallback)(
          (e, t) => {
            v && (t && (v.unobserve(t), (d.current = !1)), e && v.observe(e))
          },
          [v]
        ),
        [b, E] = Z(y),
        S = Y(e)
      return (
        (0, s.useEffect)(() => {
          v && b.current && (v.disconnect(), (d.current = !1), v.observe(b.current))
        }, [b, v]),
        K(
          () => (
            o({
              type: ue.RegisterDroppable,
              element: {
                id: n,
                key: r,
                disabled: t,
                node: b,
                rect: u,
                data: S
              }
            }),
            () =>
              o({
                type: ue.UnregisterDroppable,
                key: r,
                id: n
              })
          ),
          [n]
        ),
        (0, s.useEffect)(() => {
          o({
            type: ue.SetDroppableDisabled,
            id: n,
            key: r,
            disabled: t
          })
        }, [t]),
        {
          active: a,
          rect: u,
          isOver: (null == l ? void 0 : l.id) === n,
          node: b,
          over: l,
          setNodeRef: E
        }
      )
    })({
      id: a,
      data: b,
      resizeObserverConfig: {
        updateMeasurementsFor: E,
        ...l
      }
    }),
    {
      active: w,
      activatorEvent: A,
      activeNodeRect: N,
      attributes: I,
      setNodeRef: P,
      listeners: x,
      isDragging: k,
      over: L,
      transform: C
    } = jt({
      id: a,
      data: b,
      attributes: {
        ...on,
        ...t
      },
      disabled: n
    }),
    D = (function (...e) {
      return (0, s.useMemo)(
        () => t => {
          e.forEach(e => e(t))
        },
        e
      )
    })(_, P),
    R = Boolean(w),
    M = R && !p && $t(h) && $t(f),
    j = !g && k,
    U = j && M ? C : null,
    F = M
      ? null != U
        ? U
        : (null != o ? o : v)({
            rects: m,
            activeNodeRect: N,
            activeIndex: h,
            overIndex: f,
            index: y
          })
      : null,
    H =
      $t(h) && $t(f)
        ? r({
            id: a,
            items: d,
            activeIndex: h,
            overIndex: f
          })
        : y,
    B = null == w ? void 0 : w.id,
    V = (0, s.useRef)({
      activeId: B,
      items: d,
      newIndex: H,
      containerId: u
    }),
    G = d !== V.current.items,
    W = e({
      active: w,
      containerId: u,
      isDragging: k,
      isSorting: R,
      id: a,
      index: y,
      items: d,
      newIndex: V.current.newIndex,
      previousItems: V.current.items,
      previousContainerId: V.current.containerId,
      transition: c,
      wasDragging: null != V.current.activeId
    }),
    z = (function ({ disabled: e, index: t, node: n, rect: i }) {
      const [r, a] = (0, s.useState)(null),
        o = (0, s.useRef)(t)
      return (
        K(() => {
          if (!e && t !== o.current && n.current) {
            const e = i.current
            if (e) {
              const t = De(n.current, {
                  ignoreTransform: !0
                }),
                i = {
                  x: e.left - t.left,
                  y: e.top - t.top,
                  scaleX: e.width / t.width,
                  scaleY: e.height / t.height
                }
              ;(i.x || i.y) && a(i)
            }
          }
          t !== o.current && (o.current = t)
        }, [e, t, n, i]),
        (0, s.useEffect)(() => {
          r &&
            requestAnimationFrame(() => {
              a(null)
            })
        }, [r]),
        r
      )
    })({
      disabled: !W,
      index: y,
      node: O,
      rect: S
    })
  return (
    (0, s.useEffect)(() => {
      R && V.current.newIndex !== H && (V.current.newIndex = H),
        u !== V.current.containerId && (V.current.containerId = u),
        d !== V.current.items && (V.current.items = d),
        B !== V.current.activeId && (V.current.activeId = B)
    }, [B, R, H, u, d]),
    {
      active: w,
      activeIndex: h,
      attributes: I,
      rect: S,
      index: y,
      newIndex: H,
      items: d,
      isOver: T,
      isSorting: R,
      isDragging: k,
      listeners: x,
      node: O,
      overIndex: f,
      over: L,
      setNodeRef: D,
      setDroppableNodeRef: _,
      setDraggableNodeRef: P,
      transform: null != z ? z : F,
      transition: (function () {
        if (z || (G && V.current.newIndex === y)) return an
        if ((j && !ne(A)) || !c) return
        if (R || W)
          return se.Transition.toString({
            ...c,
            property: rn
          })
        return
      })()
    }
  )
}
mt.Down, mt.Right, mt.Up, mt.Left
function cn(e) {
  const { distance: t, delay: n, tolerance: i } = e
  return t
    ? {
        distance: t
      }
    : n && i
      ? {
          delay: n,
          tolerance: i
        }
      : void 0
}
function dn(e) {
  return (function (...e) {
    return (0, s.useMemo)(() => [...e].filter(e => null != e), [...e])
  })(
    dt(Nt, {
      activationConstraint: cn(e)
    }),
    dt(Pt, {
      activationConstraint: cn(e)
    })
  )
}
const un = ({ transform: e }) => ({
  ...e,
  y: 0
})
function hn(e, t, n) {
  const i = {
    ...e
  }
  return (
    t.top + e.y <= n.top ? (i.y = n.top - t.top) : t.bottom + e.y >= n.top + n.height && (i.y = n.top + n.height - t.bottom),
    t.left + e.x <= n.left ? (i.x = n.left - t.left) : t.right + e.x >= n.left + n.width && (i.x = n.left + n.width - t.right),
    i
  )
}
const pn = ({ containerNodeRect: e, draggingNodeRect: t, transform: n }) => (t && e ? hn(n, t, e) : n),
  mn = ({ draggingNodeRect: e, transform: t, scrollableAncestorRects: n }) => {
    const i = n[0]
    return e && i ? hn(t, e, i) : t
  },
  fn = ({ transform: e }) => ({
    ...e,
    x: 0
  }),
  gn = ({ transform: e, draggingNodeRect: t, windowRect: n }) => (t && n ? hn(e, t, n) : e)
function vn({
  Item: e,
  delay: t,
  direction: n,
  distance: r,
  items: a,
  restrictToAxis: o,
  restrictToContainer: l,
  onSortEnd: c,
  onSortStart: d,
  tolerance: u,
  children: h
}) {
  const [p, m] = (0, s.useState)(null),
    f = dn({
      distance: r,
      delay: t,
      tolerance: u
    }),
    g = (function (e, t, n) {
      const i = []
      return (
        e && ("horizontal" === n ? i.push(un) : i.push(fn)),
        "window" === t ? i.push(gn) : "parent" === t ? i.push(pn) : "firstScrollableAncestor" === t && i.push(mn),
        i
      )
    })(!!o, l, n),
    v = (function (e) {
      return "horizontal" === e ? Yt : Qt
    })(n),
    y = (0, s.useCallback)(
      e => {
        const { active: t } = e
        m(a.find(e => e.id === t.id) || null), d && d()
      },
      [a, d]
    ),
    b = (0, s.useCallback)(
      e => {
        const { active: t, over: n } = e
        if (n && t.id !== n.id) {
          const e = a.findIndex(e => e.id === t.id),
            i = a.findIndex(e => e.id === n.id)
          c(Wt(a, e, i), e, i)
        }
        m(null)
      },
      [a, c]
    )
  return (0, i.jsxs)(
    Dt,
    Object.assign(
      {
        sensors: f,
        modifiers: g,
        collisionDetection: Ie,
        onDragStart: y,
        onDragEnd: b
      },
      {
        children: [
          (0, i.jsx)(
            en,
            Object.assign(
              {
                items: a,
                strategy: v
              },
              {
                children: h
              }
            )
          ),
          (0, i.jsx)(Gt, {
            children: p
              ? (0, i.jsx)(e, {
                  item: p,
                  isDragOverlay: !0
                })
              : null
          })
        ]
      }
    )
  )
}
var yn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
function bn(e) {
  const { item: t, Item: n } = e,
    s = yn(e, ["item", "Item"]),
    {
      attributes: r,
      isDragging: a,
      listeners: o,
      setNodeRef: l,
      transform: c,
      transition: d
    } = ln({
      id: t.id
    }),
    u = Object.assign(Object.assign({}, e.style), {
      transform: se.Transform.toString(c),
      transition: d
    })
  return (0, i.jsx)(
    "div",
    Object.assign(
      {},
      r,
      o,
      {
        className: e.className,
        style: u,
        ref: l
      },
      {
        children: (0, i.jsx)(
          n,
          Object.assign({}, s, {
            item: t,
            isDragging: a
          })
        )
      }
    )
  )
}
const En = 9,
  Sn = 13,
  On = 27,
  Tn = (0, s.forwardRef)(
    (
      {
        text: e,
        name: t,
        label: n,
        type: r = "text",
        readonly: o,
        autofocus: l,
        autocomplete: c = "on",
        placeholder: d,
        className: u,
        maxLength: h,
        onInput: p,
        onBlur: m,
        onFocus: f,
        onKeyDown: g,
        onKeyUp: v,
        onReturn: y,
        onCancel: b,
        onPaste: E
      },
      S
    ) => {
      const O = (0, s.useRef)(null),
        [T, _] = (0, s.useState)(e),
        [w, A] = (0, s.useState)(!!l),
        [N, I] = (0, s.useState)(!1),
        P = (0, s.useId)(),
        x = t || P
      ;(0, s.useImperativeHandle)(
        S,
        () => ({
          focus: () => {
            var e, t
            O.current === document.activeElement && (null === (e = O.current) || void 0 === e || e.blur()),
              null === (t = O.current) || void 0 === t || t.focus()
          },
          blur: () => {
            var e
            null === (e = O.current) || void 0 === e || e.blur()
          },
          setText: e => {
            var t
            null === (t = O.current) || void 0 === t || t.setRangeText(e)
          }
        }),
        [O]
      ),
        (0, s.useEffect)(() => (_(e), I(!1), () => {}), [e]),
        (0, s.useEffect)(() => (O.current && l && O.current.focus(), () => {}), [l, O]),
        (0, s.useEffect)(() => (N && y && O.current && O.current.blur(), () => {}), [N, O, y])
      const k = (0, s.useCallback)(
          e => {
            const t = e.target
            _(t.value), p(t.value)
          },
          [p, _]
        ),
        L = (0, s.useCallback)(
          e => {
            const t = e.target.value
            N && y ? (I(!1), y(t)) : m && m(t), A(!1)
          },
          [m, y, N]
        ),
        C = (0, s.useCallback)(
          e => {
            f && f(e), A(!0)
          },
          [f]
        ),
        D = (0, s.useCallback)(
          e => {
            e.stopPropagation()
            const t = e.which || e.keyCode
            t === Sn && I(!0)
            const n = [En, Sn, On]
            if ("keydown" === e.type && !n.includes(t)) return !1
            const i = e.target.value
            switch ((h && i.length > h && e.preventDefault(), t)) {
              case On:
                b && b()
            }
            return !1
          },
          [b, h]
        ),
        R = (0, s.useCallback)(
          e => {
            let t = !1
            g && (t = g(e)), t || D(e)
          },
          [D, g]
        ),
        M = (0, s.useCallback)(
          e => {
            let t = e.clipboardData.getData("text/plain").trim()
            h && (t = t.substring(0, Math.min(h, t.length))), E && E(t)
          },
          [E, h]
        ),
        j = a("mp-text-input", u, {
          focused: w
        }),
        U = n && (w || !("" === T)),
        F = w ? "" : d
      return (0, i.jsxs)(
        "div",
        Object.assign(
          {
            className: j
          },
          {
            children: [
              U &&
                (0, i.jsx)(
                  "label",
                  Object.assign(
                    {
                      className: "mp-text-input-label",
                      htmlFor: x
                    },
                    {
                      children: n
                    }
                  )
                ),
              (0, i.jsx)("input", {
                ref: O,
                autoComplete: c,
                className: "mp-input",
                name: x,
                type: r,
                value: T,
                placeholder: F,
                maxLength: h,
                onInput: k,
                onBlur: L,
                onFocus: C,
                onKeyPress: D,
                onKeyDown: R,
                onKeyUp: v,
                onPaste: M,
                readOnly: o
              })
            ]
          }
        )
      )
    }
  )
import * as _n from "./97372"
import { CheckmarkSize } from "./13727"
function wn({ isSelected: e, isActive: t, option: n, onSelect: r, onHover: o, tooltip: l }) {
  const [c, d] = (0, s.useState)(null),
    u = (0, s.useCallback)(
      e => {
        e.stopPropagation(), e.preventDefault(), r(n, e)
      },
      [r, n]
    ),
    h = (0, s.useCallback)(() => {
      o(n)
    }, [o, n])
  return (0, i.jsxs)(i.Fragment, {
    children: [
      (0, i.jsxs)(
        "div",
        Object.assign(
          {
            ref: l ? d : null,
            className: a("nova-select-option", n.className, {
              "is-selected": e,
              "is-active": t,
              disabled: !!n.disabled
            }),
            onClick: u,
            onMouseEnter: h
          },
          {
            children: [
              n.icon &&
                (0, i.jsx)(x.I, {
                  className: "select-menu-icon",
                  name: n.icon,
                  style: n.iconStyle
                }),
              (0, i.jsx)(
                "span",
                Object.assign(
                  {
                    className: "nova-select-option-text"
                  },
                  {
                    children: n.text
                  }
                )
              )
            ]
          }
        )
      ),
      l &&
        (0, i.jsx)(_n.u, {
          target: c,
          title: l
        })
    ]
  })
}
const An = Object.freeze({
    white: "#FFF",
    moonrock: "#F5F4F3",
    mirror: "#DADADA",
    sine: "#B5B4B3",
    cosine: "#999",
    tangent: "#6D6D6D",
    lens: "#444",
    portal: "#222",
    laser: "#FF3158"
  }),
  Nn = Object.freeze({
    neutron: "#5C7FFF",
    naiad: "#8BBBFF",
    neptune: "#385DFF",
    triton: "#0000EA",
    proton: "#00A170",
    sputnik: "#00CC8C",
    earth: "#007D57",
    iss: "#006644",
    electron: "#FFBB00",
    ring: "#FFDD55",
    saturn: "#C99100",
    titan: "#906900",
    gamma: "#FA5300",
    deimos: "#FF9955",
    mars: "#C74200",
    phobos: "#AA3300"
  }),
  In =
    (Object.freeze({
      heliosphere: "#CA003D",
      mesosphere: "#990033",
      exosphere: "#660022",
      thermosphere: "#D22288",
      troposphere: "#A727D7",
      noosphere: "#7733F3",
      atmosphere: "#1A298C",
      stratosphere: "#1333CC",
      hydrosphere: "#1444FF",
      biosphere: "#006EE1",
      geosphere: "#0090C0",
      ecosphere: "#00AFAA",
      lithosphere: "#00705D",
      athenosphere: "#004844"
    }),
    Object.freeze({
      primary: An,
      semantic: Nn
    }),
    (0, s.forwardRef)(({ className: e, children: t }, n) => {
      const r = (0, s.useRef)(null)
      return (
        (0, s.useImperativeHandle)(
          n,
          () => ({
            scrollToSelector: e => {
              if (r.current) {
                const t = r.current.querySelector(e)
                t ? t.scrollIntoView() : (r.current.scrollTop = 0)
              }
            },
            getScroller: () => (null == r ? void 0 : r.current) || void 0
          }),
          [r]
        ),
        (0, i.jsx)(
          "div",
          Object.assign(
            {
              ref: r,
              className: e
            },
            {
              children: t
            }
          )
        )
      )
    })),
  Pn = ({ group: e, options: t, renderOption: n, observer: r }) => {
    const [a, o] = (0, s.useState)(null)
    return (
      (0, s.useEffect)(() => {
        if (a)
          return (
            null == r || r.observe(a),
            () => {
              null == r || r.unobserve(a)
            }
          )
      }, [r, a, e.id]),
      (0, i.jsxs)(
        "div",
        Object.assign(
          {
            className: "nova-select-menu-group",
            "data-group-container-id": e.id
          },
          {
            children: [
              (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "nova-select-menu-group-header"
                  },
                  {
                    children: e.displayText
                  }
                )
              ),
              (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    ref: o,
                    className: "nova-select-menu-grouped-options",
                    "data-group-id": e.id
                  },
                  {
                    children: t.map(n)
                  }
                )
              )
            ]
          }
        ),
        e.id
      )
    )
  }
enum xn {
  JUSTIFY = "justify",
  LEFT = "left",
  RIGHT = "right"
}
const kn = (0, s.forwardRef)(
    (
      {
        children: e,
        target: t,
        className: n,
        isOpen: r,
        onClose: o,
        onChange: l,
        options: c = [],
        selectedOptionId: d = "",
        focusedOptionId: u = "",
        setFocusedOptionId: h,
        autoFocus: p,
        filterText: m,
        onKeyDown: f,
        align: g = xn.JUSTIFY,
        groups: v,
        includeUngrouped: y = !1,
        getNoResultsText: b,
        scrollbarComponent: E = In,
        onGroupIntersected: S
      },
      O
    ) => {
      const [T, _] = (0, s.useState)(),
        [I, P] = (0, s.useState)(null),
        [x, k] = (0, s.useState)(),
        [L, C] = (0, s.useState)(0),
        D = (0, s.useDeferredValue)(c),
        R = (0, s.useDeferredValue)(m),
        { styles: M, attributes: j } = (0, N.D)(t, I, {
          placement: g === xn.RIGHT ? "bottom-end" : "bottom-start",
          strategy: "fixed",
          modifiers: [
            {
              name: "flip"
            },
            {
              name: "hide"
            },
            {
              name: "offset",
              options: {
                offset: [0, 4]
              }
            }
          ]
        }),
        [U, F] = (0, s.useState)(!1),
        H = (0, A.Z)(t)
      ;(0, s.useImperativeHandle)(
        O,
        () => ({
          scrollToGroupId: e => {
            T && (null == T ? void 0 : T.scrollToSelector) && (null == T || T.scrollToSelector(`[data-group-container-id="${e}"]`, "top", !0))
          }
        }),
        [T]
      )
      const B = g === xn.JUSTIFY,
        V = (0, s.useCallback)(
          (e, t) => {
            l(e, t)
          },
          [l]
        ),
        G = (0, s.useCallback)(
          e => {
            h && h(e.id)
          },
          [h]
        ),
        W = (0, s.useCallback)(() => {
          F(!0)
        }, [F]),
        z = (0, s.useCallback)(() => {
          F(!1)
        }, [F])
      ;(0, s.useLayoutEffect)(() => {
        if (B && r && t) {
          const { width: e } = t.getBoundingClientRect()
          C(e)
        }
        return () => {}
      }, [r, B, t]),
        (0, s.useEffect)(() => {
          const e = e => {
            if (t && I) {
              const n = e.composedPath(),
                i = !n.includes(t),
                s = !n.includes(I)
              i && s && o()
            }
          }
          return (
            r && I
              ? window.addEventListener("click", e, {
                  capture: !0
                })
              : window.removeEventListener("click", e, {
                  capture: !0
                }),
            () => {
              window.removeEventListener("click", e, {
                capture: !0
              })
            }
          )
        }, [I, t, r, o]),
        (0, s.useEffect)(() => (r && p && I && I.focus(), () => {}), [p, r, I])
      const $ = (0, s.useMemo)(() => (R ? D.filter(e => -1 !== e.text.toLowerCase().indexOf(R.toLowerCase())) : D), [D, R]),
        K = B ? Math.min(L, 380) : void 0,
        Y = (0, s.useMemo)(() => {
          if (v) {
            const e = v.map(e => e.id)
            return $.reduce((t, n) => {
              let i = n.group && e.includes(n.group) && n.group
              return !i && y && (i = "_ungrouped"), i && (t[i] || (t[i] = []), t[i].push(n)), t
            }, {})
          }
          return null
        }, [v, $, y])
      ;(0, s.useEffect)(() => {
        if (!T || !S) return
        const e = T.getScroller()
        if (!e) return
        const t = new IntersectionObserver(
          e => {
            if ((e = e.filter(e => e.isIntersecting).sort((e, t) => t.intersectionRatio - e.intersectionRatio)).length > 0) {
              const t = e[0].target,
                { groupId: n } = t.dataset
              S(n)
            }
          },
          {
            root: e,
            threshold: [0.1, 0.9]
          }
        )
        return (
          k(t),
          () => {
            t.disconnect()
          }
        )
      }, [T, k, S])
      const q = E,
        Z = e =>
          (0, i.jsx)(
            wn,
            {
              option: e,
              isSelected: e.id === d,
              isActive: e.id === u,
              onSelect: V,
              onHover: G,
              tooltip: e.tooltip
            },
            e.id
          ),
        Q = $.length,
        X = r && (Q || "" !== m)
      return (0, i.jsx)(i.Fragment, {
        children: (0, w.createPortal)(
          X &&
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  style: Object.assign(Object.assign({}, M.popper), {
                    width: K
                  })
                },
                j.popper,
                {
                  ref: P,
                  tabIndex: 0,
                  onKeyDown: f,
                  className: a("nova-select-menu", n, {
                    "has-focus": U
                  }),
                  onFocus: W,
                  onBlur: z
                },
                {
                  children: (0, i.jsxs)(i.Fragment, {
                    children: [
                      e,
                      (0, i.jsx)(
                        q,
                        Object.assign(
                          {
                            className: "nova-select-items-wrap",
                            ref: _
                          },
                          {
                            children: (0, i.jsxs)(
                              s.Suspense,
                              Object.assign(
                                {
                                  fallback: "Loading..."
                                },
                                {
                                  children: [
                                    0 === Q &&
                                      "" !== m &&
                                      b &&
                                      (0, i.jsx)(
                                        "span",
                                        Object.assign(
                                          {
                                            className: "nova-select-no-results"
                                          },
                                          {
                                            children: b(m || "")
                                          }
                                        )
                                      ),
                                    v && Y
                                      ? v.map((e, t) =>
                                          Y[e.id]
                                            ? (0, i.jsx)(
                                                Pn,
                                                {
                                                  group: e,
                                                  renderOption: Z,
                                                  options: Y[e.id],
                                                  observer: x
                                                },
                                                e.id
                                              )
                                            : null
                                        )
                                      : $.map(Z)
                                  ]
                                }
                              )
                            )
                          }
                        )
                      )
                    ]
                  })
                }
              )
            ),
          H
        )
      })
    }
  ),
  Ln = ({ items: e = [], focusedItemId: t, selectedItemId: n, onItemFocused: i, onItemSelected: r, onCancel: a, tabSelects: o = !1 }) => {
    const l = (0, s.useMemo)(() => e.map(e => e.id), [e]),
      c = e.length
    ;(0, s.useEffect)(() => {
      i(e.length > 0 ? e[0].id : "")
    }, [e, i])
    const d = (0, s.useCallback)(
      (e = !1) => {
        let s = (l.indexOf(t || n || "") + (e ? 1 : -1)) % c
        s < 0 && (s = c - 1), i(l[s])
      },
      [t, n, i, l, c]
    )
    return (0, s.useCallback)(
      e => {
        let n = !1
        const i = e.code
        switch (i) {
          case "ArrowDown":
            d(!0), (n = !0)
            break
          case "ArrowUp":
            d(!1), (n = !0)
            break
          case "Escape":
            a(), (n = !0)
            break
          case "Enter":
          case "Tab":
            if ("Tab" !== i || o) {
              t && (r(t), (n = !0))
              break
            }
        }
        return n && e.preventDefault(), n
      },
      [d, a, o, t, r]
    )
  }
var Cn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Dn = (0, s.forwardRef)((e, t) => {
  var n,
    {
      options: r = [],
      onChange: o,
      clearOnSelect: l = !1,
      insertOnSelect: c = !1,
      onBlur: d,
      onFocus: u,
      onKeyDown: h,
      onKeyUp: p,
      onPaste: m,
      selectedOptionId: f,
      getNoResultsText: g,
      onCancel: v
    } = e,
    y = Cn(e, [
      "options",
      "onChange",
      "clearOnSelect",
      "insertOnSelect",
      "onBlur",
      "onFocus",
      "onKeyDown",
      "onKeyUp",
      "onPaste",
      "selectedOptionId",
      "getNoResultsText",
      "onCancel"
    ])
  const [b, E] = (0, s.useState)(null),
    S = (0, s.useRef)(null),
    [O, T] = (0, s.useState)((f && (null === (n = r.find(e => e.id === f)) || void 0 === n ? void 0 : n.text)) || ""),
    [_, w] = (0, s.useState)(""),
    [A, N] = (0, s.useState)(!1)
  ;(0, s.useImperativeHandle)(
    t,
    () => ({
      focus: () => {
        var e
        null === (e = S.current) || void 0 === e || e.focus()
      },
      blur: () => {
        var e
        null === (e = S.current) || void 0 === e || e.blur(), N(!1)
      },
      clear: () => {
        T("")
      },
      setText: e => {
        T(e)
      }
    }),
    [S, T]
  )
  const I = (0, s.useMemo)(() => (O ? r.filter(e => -1 !== e.text.toLowerCase().indexOf(O.toLowerCase())) : r), [r, O]),
    P = (0, s.useCallback)(
      e => {
        var t
        const n = "string" == typeof e
        ;(n && 0 === e.trim().length) || (o(e), N(!1), l ? T("") : !n && c && T(e.text), null === (t = S.current) || void 0 === t || t.blur())
      },
      [o, l, c]
    ),
    x = (0, s.useCallback)(
      e => {
        if (e) {
          const t = I.find(t => t.id === e)
          t && P(t)
        }
      },
      [P, I]
    ),
    k = (0, s.useCallback)(() => {
      var e
      N(!1), null === (e = S.current) || void 0 === e || e.blur(), v && v()
    }, [v]),
    L = Ln({
      items: I,
      focusedItemId: _,
      onItemFocused: w,
      onItemSelected: x,
      onCancel: k,
      tabSelects: !0
    }),
    C = (0, s.useCallback)(
      e => {
        let t = !1
        return h && (t = h(e)), t || (t = L(e)), t
      },
      [h, L]
    ),
    D = (0, s.useCallback)(
      e => {
        N(!0), u && u(e)
      },
      [u]
    ),
    R = (0, s.useCallback)(
      e => {
        d && d(e)
      },
      [d]
    ),
    M = (0, s.useCallback)(
      e => {
        m && m(e), T(e)
      },
      [m, T]
    ),
    j = (0, s.useCallback)(
      e => {
        x(e.id)
      },
      [x]
    )
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: a("nova-typeahead-input"),
        ref: E,
        "aria-autocomplete": "list"
      },
      {
        children: [
          (0, i.jsx)(
            Tn,
            Object.assign({}, y, {
              ref: S,
              text: O,
              onInput: T,
              autocomplete: "off",
              onReturn: P,
              onCancel: k,
              onFocus: D,
              onBlur: R,
              onKeyDown: C,
              onKeyUp: p,
              onPaste: M
            })
          ),
          (0, i.jsx)(kn, {
            options: I,
            target: b,
            isOpen: A,
            onClose: k,
            onChange: j,
            filterText: O,
            focusedOptionId: _,
            setFocusedOptionId: w,
            getNoResultsText: g,
            autoFocus: !1
          })
        ]
      }
    )
  )
})
var Rn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Mn = (0, s.forwardRef)((e, t) => {
  var {
      className: n,
      buttonClassName: r = "button-select-anchor",
      onChange: o,
      selectedOptionId: l = "",
      options: c = [],
      children: d,
      placeholder: u,
      placeholderIcon: h,
      selectMenuClassName: p,
      onClick: f,
      align: g = xn.LEFT,
      groups: v,
      filterText: y,
      allowClear: b,
      onClear: E,
      getNoResultsText: S,
      scrollbarComponent: O,
      selectMenuRef: T,
      onGroupIntersected: _
    } = e,
    w = Rn(e, [
      "className",
      "buttonClassName",
      "onChange",
      "selectedOptionId",
      "options",
      "children",
      "placeholder",
      "placeholderIcon",
      "selectMenuClassName",
      "onClick",
      "align",
      "groups",
      "filterText",
      "allowClear",
      "onClear",
      "getNoResultsText",
      "scrollbarComponent",
      "selectMenuRef",
      "onGroupIntersected"
    ])
  const A = (0, s.useRef)(null),
    [N, I] = (0, s.useState)(!1),
    [P, k] = (0, s.useState)("")
  ;(0, s.useImperativeHandle)(
    t,
    () => ({
      closeMenu: () => {
        I(!1)
      }
    }),
    []
  )
  const L = (0, s.useCallback)(e => {
      null == e || e.stopPropagation(), I(!1), k("")
    }, []),
    C = (0, s.useCallback)(
      e => {
        e.stopPropagation(), e.preventDefault(), f && f(e), I(!N)
      },
      [N, f]
    ),
    D = (0, s.useCallback)(
      (e, t) => {
        o(e, t), L()
      },
      [L, o]
    ),
    R = (0, s.useCallback)(
      e => {
        const t = c.find(t => t.id === e)
        t && D(t, void 0)
      },
      [c, D]
    ),
    M = Ln({
      items: c,
      focusedItemId: P,
      selectedItemId: l,
      onItemFocused: k,
      onItemSelected: R,
      onCancel: L
    }),
    j = (0, s.useMemo)(() => l && c.find(e => e.id === l), [l, c]),
    U = (0, s.useCallback)(
      e => {
        e.stopPropagation(), E && E()
      },
      [E]
    )
  return (0, i.jsxs)(
    "div",
    Object.assign(
      {
        className: a("nova-button-select", n),
        ref: A
      },
      {
        children: [
          (0, i.jsxs)(
            m.zx,
            Object.assign(
              {},
              w,
              {
                onClick: C,
                className: a(r, {
                  "mp-nova-menu-open": N
                }),
                onKeyDown: M
              },
              {
                children: [
                  j &&
                    (0, i.jsxs)(i.Fragment, {
                      children: [
                        j.icon &&
                          (0, i.jsx)(x.I, {
                            className: "select-menu-icon",
                            name: j.icon,
                            style: j.iconStyle
                          }),
                        (0, i.jsx)(
                          "span",
                          Object.assign(
                            {
                              className: "selection-text"
                            },
                            {
                              children: j.text
                            }
                          )
                        )
                      ]
                    }),
                  !j &&
                    u &&
                    (0, i.jsxs)(i.Fragment, {
                      children: [
                        h &&
                          (0, i.jsx)(x.I, {
                            className: "select-menu-icon",
                            name: h
                          }),
                        (0, i.jsx)(
                          "span",
                          Object.assign(
                            {
                              className: "select-placeholder"
                            },
                            {
                              children: u
                            }
                          )
                        )
                      ]
                    }),
                  b &&
                    l &&
                    (0, i.jsx)(x.I, {
                      name: "close",
                      className: "select-button-clear mp-nova-btn mp-nova-btn-light mp-nova-btn-icon",
                      onClick: U
                    }),
                  (0, i.jsx)(x.I, {
                    className: "select-caret",
                    name: "dpad-down"
                  })
                ]
              }
            )
          ),
          (0, i.jsx)(
            kn,
            Object.assign(
              {
                ref: T,
                target: A.current,
                isOpen: N,
                className: p,
                onClose: L,
                onChange: D,
                onKeyDown: M,
                selectedOptionId: l,
                focusedOptionId: P,
                setFocusedOptionId: k,
                align: g,
                options: c,
                autoFocus: !1,
                groups: v,
                filterText: y,
                getNoResultsText: S,
                scrollbarComponent: O,
                onGroupIntersected: _
              },
              {
                children: d
              }
            )
          )
        ]
      }
    )
  )
})
var jn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Un = e => {
  var { selectedColor: t, options: n, onChange: r, noSelectionText: o, selectMenuClassName: l } = e,
    c = jn(e, ["selectedColor", "options", "onChange", "noSelectionText", "selectMenuClassName"])
  const d = (0, s.useMemo)(
      () =>
        n.map(e =>
          Object.assign(Object.assign({}, e), {
            icon: "simple-tag",
            iconStyle: {
              color: `${e.value}`
            }
          })
        ),
      [n]
    ),
    u = (0, s.useCallback)(
      e => {
        r(e.id)
      },
      [r]
    )
  return (0, i.jsx)(
    Mn,
    Object.assign(
      {
        className: "nova-color-select",
        options: d,
        onChange: u,
        selectMenuClassName: a("color-select-menu", l),
        selectedOptionId: t
      },
      c
    )
  )
}
var Fn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Hn = e => e.stopPropagation(),
  Bn = e => {
    var {
        selectedIcon: t,
        options: n,
        onChange: r,
        noSelectionText: o = "Choose an icon...",
        recentIconIds: l,
        groups: c,
        searchPlaceholder: d,
        selectMenuClassName: u
      } = e,
      h = Fn(e, ["selectedIcon", "options", "onChange", "noSelectionText", "recentIconIds", "groups", "searchPlaceholder", "selectMenuClassName"])
    const p = (0, s.useRef)(null),
      [m, f] = (0, s.useState)(""),
      [g, v] = (0, s.useState)(c.length > 0 ? c[0].id : void 0),
      y = (0, s.useRef)(null),
      b = (0, s.useMemo)(
        () =>
          n.map(e =>
            Object.assign(Object.assign({}, e), {
              icon: e.id
            })
          ),
        [n]
      ),
      E = (0, s.useCallback)(
        e => {
          r(e.id)
        },
        [r]
      ),
      S = e => {
        var t
        null === (t = y.current) || void 0 === t || t.scrollToGroupId(e)
      },
      O = (0, s.useCallback)(e => {
        var t
        e.stopPropagation(), f(""), null === (t = p.current) || void 0 === t || t.focus()
      }, []),
      T = (0, s.useCallback)(
        e => {
          v(e)
        },
        [v]
      ),
      _ = (0, s.useMemo)(() => c.map(e => e.id), [c]),
      w = 100 / Math.max(c.length, 1)
    return (0, i.jsx)(
      Mn,
      Object.assign(
        {
          className: "nova-icon-select",
          options: b,
          onChange: E,
          selectMenuClassName: a("icon-select-menu", u),
          selectedOptionId: t,
          align: xn.JUSTIFY,
          filterText: m,
          showGroupings: !0,
          groups: c,
          selectMenuRef: y,
          onGroupIntersected: T
        },
        h,
        {
          children: (0, i.jsxs)(
            "header",
            Object.assign(
              {
                onClick: Hn
              },
              {
                children: [
                  c &&
                    (0, i.jsxs)(
                      "div",
                      Object.assign(
                        {
                          className: "nova-button-tabs"
                        },
                        {
                          children: [
                            c.map(e =>
                              (0, i.jsx)(
                                Vn,
                                {
                                  group: e,
                                  onSelect: S,
                                  selectedId: g
                                },
                                e.id
                              )
                            ),
                            g &&
                              (0, i.jsx)("div", {
                                className: "nova-button-tabs-indicator",
                                style: {
                                  width: `${w}%`,
                                  transform: `translateX(${100 * _.indexOf(g)}%)`
                                }
                              })
                          ]
                        }
                      )
                    ),
                  (0, i.jsxs)(
                    "div",
                    Object.assign(
                      {
                        className: "search-input-wrap"
                      },
                      {
                        children: [
                          (0, i.jsx)(x.I, {
                            name: "magnifying-glass"
                          }),
                          (0, i.jsx)(Tn, {
                            ref: p,
                            text: m,
                            onInput: f,
                            placeholder: d,
                            autofocus: !0
                          }),
                          !!m &&
                            (0, i.jsx)(x.I, {
                              name: "close",
                              onClick: O
                            })
                        ]
                      }
                    )
                  )
                ]
              }
            )
          )
        }
      )
    )
  }
function Vn({ group: e, selectedId: t, onSelect: n }) {
  const { id: s, icon: r, displayText: a } = e
  return (0, i.jsx)(m.zx, {
    icon: r,
    tooltip: a,
    onClick: () => n(s),
    className: t === s ? "nova-button-tabs-selected" : ""
  })
}
var Gn = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Wn = (0, s.forwardRef)((e, t) => {
    var { allowSelect: n, isSelected: r, isFocused: o, onClick: l, onFocus: c, onRemoveClick: d, className: u, size: h = "standard", theme: p = "light" } = e,
      f = Gn(e, ["allowSelect", "isSelected", "isFocused", "onClick", "onFocus", "onRemoveClick", "className", "size", "theme"])
    const g = (0, s.useRef)(null)
    ;(0, s.useImperativeHandle)(
      t,
      () => ({
        focus: () => {
          var e
          null === (e = g.current) || void 0 === e || e.focus()
        }
      }),
      [g]
    )
    const v = (0, s.useCallback)(() => {
        d && d(f)
      }, [d, f]),
      y = (0, s.useCallback)(
        e => {
          var t
          null === (t = g.current) || void 0 === t || t.focus(), l && l(f, e)
        },
        [l, f]
      ),
      b = (0, s.useCallback)(
        e => {
          c && c(f)
        },
        [c, f]
      ),
      E = void 0 !== f.count
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("nova-token", `token-size-${h}`, `token-theme-${p}`, u, {
            "is-selected": r,
            "is-focused": o,
            "has-count": E,
            "can-select": n,
            "can-remove": !!d
          }),
          title: f.text,
          onClick: y,
          onFocus: b,
          tabIndex: 0,
          ref: g,
          "data-token-id": f.id
        },
        {
          children: [
            n &&
              r &&
              (0, i.jsx)(x.I, {
                size: CheckmarkSize.SMALL,
                name: "checkmark"
              }),
            (0, i.jsx)(
              "div",
              Object.assign(
                {
                  className: "token-text"
                },
                {
                  children: f.text
                }
              )
            ),
            E &&
              (0, i.jsx)(
                "div",
                Object.assign(
                  {
                    className: "token-count"
                  },
                  {
                    children: f.count
                  }
                )
              ),
            !!d &&
              (0, i.jsx)(m.zx, {
                onClick: v,
                icon: "close",
                size: "small"
              })
          ]
        }
      )
    )
  }),
  zn = ({ tokens: e, className: t, allowSelect: n, maxVisibleTruncated: r, selectedTokenIds: o = [], onTokenClick: l, tokenSize: c, tokenTheme: d }) => {
    const [u, h] = (0, s.useState)(!1),
      p = (0, s.useCallback)(
        (e, t) => {
          h(!u)
        },
        [h, u]
      ),
      m = !!r,
      f = (0, s.useMemo)(() => m && e.length - r, [e, r, m]),
      g = (0, s.useMemo)(() => (u ? e : e.slice(0, r)), [e, r, u])
    return g.length > 0
      ? (0, i.jsxs)(
          "div",
          Object.assign(
            {
              className: a("nova-token-list", t, {
                "is-viewing-all": u
              })
            },
            {
              children: [
                g.map(e =>
                  (0, s.createElement)(
                    Wn,
                    Object.assign({}, e, {
                      isSelected: e.isSelected || o.includes(e.id),
                      key: e.id,
                      onClick: l,
                      allowSelect: n,
                      size: c,
                      theme: d
                    })
                  )
                ),
                m &&
                  e.length > r &&
                  (0, i.jsx)(Wn, {
                    className: "view-more-btn",
                    onClick: p,
                    size: c,
                    theme: d,
                    id: "_token_list_view_more_btn",
                    text: u ? `Hide ${f}...` : `View ${f} more...`
                  })
              ]
            }
          )
        )
      : null
  }
var $n = function (e, t) {
  var n = {}
  for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (i = Object.getOwnPropertySymbols(e); s < i.length; s++)
      t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]])
  }
  return n
}
const Kn = (function* () {
    let e = 0
    for (;;) yield e++
  })(),
  Yn = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"],
  qn = () => {},
  Zn = (0, s.forwardRef)((e, t) => {
    var {
        initialTokens: n = [],
        options: r = [],
        placeholder: o,
        onChange: l,
        maxTokens: c,
        maxTokensValidationMsg: d,
        helpMessage: u,
        tokenDisplayName: h = "Token",
        validateNewToken: p = qn
      } = e,
      m = $n(e, [
        "initialTokens",
        "options",
        "placeholder",
        "onChange",
        "maxTokens",
        "maxTokensValidationMsg",
        "helpMessage",
        "tokenDisplayName",
        "validateNewToken"
      ])
    const f = (0, s.useRef)(null),
      g = (0, s.useRef)(null),
      v = (0, s.useRef)(null),
      [y, b] = (0, s.useState)(),
      [E, S] = (0, s.useState)(n),
      [O, T] = (0, s.useState)(),
      [_, w] = (0, s.useState)(!1),
      A = (0, s.useMemo)(() => E.findIndex(e => e.id === y), [y, E])
    ;(0, s.useImperativeHandle)(
      t,
      () => ({
        focus: () => {
          var e
          null === (e = g.current) || void 0 === e || e.focus()
        },
        blur: () => {
          var e
          null === (e = g.current) || void 0 === e || e.blur()
        }
      }),
      [g]
    )
    const N = (0, s.useCallback)(() => {
        var e
        null === (e = g.current) || void 0 === e || e.focus()
      }, [g]),
      I = (0, s.useCallback)(e => (E.some(t => e === t.text) ? `${h} "${e}" would duplicate an existing value.` : void 0), [E, h]),
      P = (0, s.useCallback)(
        e => {
          const t = I(e) || p(e)
          return T(t), !t
        },
        [p, I, T]
      ),
      x = (0, s.useCallback)(
        e => {
          var t
          let n = null
          if (
            ("string" == typeof e
              ? P(e) &&
                (n = {
                  text: e,
                  id: `new_token_${Kn.next().value}`
                })
              : (n = e),
            n)
          ) {
            const e = [...E, n]
            S(e),
              l(e),
              null === (t = g.current) || void 0 === t || t.clear(),
              cancelAnimationFrame(v.current || 0),
              (v.current = requestAnimationFrame(() => {
                var e
                null === (e = g.current) || void 0 === e || e.focus()
              }))
          }
        },
        [E, P]
      ),
      k = (0, s.useCallback)(
        e => {
          const t = E.filter(t => t.id !== e)
          S(t), l(t)
        },
        [E]
      ),
      L = (0, s.useCallback)(
        e => {
          if (f.current) {
            f.current.querySelector(`[data-token-id="${e}"]`).focus()
          }
        },
        [f]
      ),
      C = (0, s.useCallback)(
        e => {
          var t, n, i
          e.stopPropagation()
          const s = E.length - 1,
            r = e.code,
            a = "Backspace" === r || "Delete" === r,
            o = "ArrowLeft" === r,
            l = "ArrowRight" === r
          if (y) {
            if (a) {
              k(y), b("")
              const e = A - 1
              e > -1 && L(E[e].id)
            } else if (l)
              if (A === s) N()
              else {
                L(E[A + 1].id)
              }
            else if (o) {
              const e = A - 1
              ;-1 === e ? null === (n = (t = document.activeElement).blur) || void 0 === n || n.call(t) : L(E[e].id)
            }
          } else E.length > 0 && (a || o) && L(E[E.length - 1].id)
          "Escape" === r && (null === (i = f.current) || void 0 === i || i.blur())
        },
        [k, y, E, A, N, L]
      ),
      D = (0, s.useCallback)(
        e => {
          const { selectionStart: t, selectionEnd: n } = e.target,
            i = 0 === t && t === n
          return e.stopPropagation(), Yn.includes(e.code) && i && C(e), !1
        },
        [C]
      ),
      R = (0, s.useCallback)(
        e => {
          const { value: t } = e.target
          P(t)
        },
        [P]
      ),
      M = (0, s.useCallback)(
        e => {
          P(e)
        },
        [P]
      ),
      j = (0, s.useCallback)(
        e => {
          k(e.id)
        },
        [k]
      ),
      U = (0, s.useCallback)(e => {
        const { id: t } = e
        b(t), w(!0)
      }, []),
      F = (0, s.useCallback)(() => {
        b(""), w(!0)
      }, []),
      H = (0, s.useCallback)(() => {
        w(!1), b("")
      }, []),
      B = (0, s.useMemo)(() => {
        const e = E.map(e => e.id)
        return r.filter(t => !e.includes(t.id))
      }, [r, E]),
      V = void 0 !== c && E.length >= c,
      G = V && d ? d : O || u
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("nova-token-input", {
            "has-focus": _,
            "has-warning": V,
            "has-error": !!O
          }),
          onKeyDown: C,
          onBlur: H,
          ref: f
        },
        {
          children: [
            (0, i.jsxs)(
              "div",
              Object.assign(
                {
                  className: "nova-token-input-container"
                },
                {
                  children: [
                    E.map(e =>
                      (0, i.jsx)(
                        Wn,
                        Object.assign(
                          {
                            isFocused: e.id === y,
                            onFocus: U,
                            onRemoveClick: j
                          },
                          e
                        ),
                        e.id
                      )
                    ),
                    !V &&
                      (0, i.jsx)(
                        Dn,
                        Object.assign({}, m, {
                          ref: g,
                          options: B,
                          onChange: x,
                          placeholder: o,
                          onFocus: F,
                          onBlur: H,
                          onKeyDown: D,
                          onKeyUp: R,
                          onPaste: M
                        })
                      )
                  ]
                }
              )
            ),
            (0, i.jsxs)(
              "div",
              Object.assign(
                {
                  className: "nova-input-help"
                },
                {
                  children: [
                    (0, i.jsxs)(
                      "span",
                      Object.assign(
                        {
                          className: "nova-input-counter"
                        },
                        {
                          children: [
                            E.length,
                            void 0 !== c &&
                              c > 0 &&
                              (0, i.jsxs)(i.Fragment, {
                                children: ["/", c]
                              })
                          ]
                        }
                      )
                    ),
                    G &&
                      (0, i.jsx)(
                        "span",
                        Object.assign(
                          {
                            className: "nova-helper-text"
                          },
                          {
                            children: G
                          }
                        )
                      )
                  ]
                }
              )
            )
          ]
        }
      )
    )
  })
//

export const UQ = p
export const _m = v
export const jL = y
export const Vr = T
export const zx = m.zx
export const hE = _
export const xz = L
export const Wo = C
//@ts-ignore彭
export const do1 = Mn
//@ts-ignore
export const qE = m.qE
export const Wu = m.Wu
export const XZ = D
export const Q5 = Un
export const Vq = R
export const gQ = M
export const JO = x.I
export const xG = Bn
export const Jh = CheckmarkSize
export const w0 = j
export const HC = U
export const v2 = P
export const o3 = F
export const jr = xn
export const cm = vn
export const oi = Tn
export const rR = Zn
export const no = zn
export const u = _n.u
export const R7 = Dn
export const CP = d
export const sr = bn
