import { css, definePrimitive } from "@ui-sdk/core"

type AspectRatioOptions = {
  /** Width divided by height, like `16 / 9`. @defaultValue 1 */
  ratio?: number
}

const ratioOf = (options: AspectRatioOptions) => (options.ratio && options.ratio > 0 ? options.ratio : 1)

const aspectRatio = definePrimitive({
  name: "aspect-ratio",
  options: { ratio: "number" },
  state: (options: AspectRatioOptions) => ({ ratio: ratioOf(options) }),
  sync: (options) => ({ ratio: ratioOf(options) }),
  controlled: ["ratio"],
  api: () => ({}),
  slots: (slot) => ({
    root: slot<{}, { ratio: number }>({
      state: (state) => ({ ratio: state.ratio }),
      attrs: (state) => ({
        "data-orientation": state.ratio > 1 ? "landscape" : state.ratio < 1 ? "portrait" : "square",
        style: css({ "--aspect-ratio": String(state.ratio), "aspect-ratio": "var(--aspect-ratio)" }),
      }),
    }),
  }),
  /* Agents can read the frame ratio; its content owns any actions. */
  agent: { actions: [] },
})

export { aspectRatio, type AspectRatioOptions }
