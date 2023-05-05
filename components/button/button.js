import { h, defineComponent } from "vue";
import "./index.less";

export default defineComponent({
  name: "JinkeButton",
  props: {
    type: {
      type: String,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "button",
        {
          class: {
            "jinke-button": true,
            [`jinke-button--${props.type}`]: true,
          },
        },
        slots
      );
  },
});
