import { defineComponent as e, createElementBlock as n, openBlock as r, renderSlot as s, createTextVNode as l } from "vue";
import "./style/index.css";
const u = { class: "m-button" }, _ = e({
  name: "MButton"
  // M 前缀，使用时 <m-button>
}), c = /* @__PURE__ */ e({
  ..._,
  setup(a) {
    return (o, t) => (r(), n("button", u, [
      s(o.$slots, "default", {}, () => [
        t[0] || (t[0] = l("按钮", -1))
      ])
    ]));
  }
});
export {
  c as default
};
