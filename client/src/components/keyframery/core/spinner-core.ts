import { definePrimitive } from "@ui-sdk/core"

type SpinnerVariant = "ring" | "spokes"

type SpinnerOptions = {
  /** What a screen reader hears. @defaultValue "Loading" */
  label?: string
  /** The drawing: `"ring"`, an arc that turns and stretches, or `"spokes"`, eight spokes fading round. @defaultValue "ring" */
  variant?: SpinnerVariant
}

const spinner = definePrimitive({
  name: "spinner",
  options: { label: "string", variant: "string" },
  state: (options: SpinnerOptions) => ({ label: options.label ?? "Loading", variant: options.variant ?? "ring" }),
  sync: (options) => ({ label: options.label ?? "Loading", variant: options.variant ?? "ring" }),
  controlled: ["label"],
  api: () => ({}),
  slots: (slot) => ({
    root: slot<{}, { label: string; variant: SpinnerVariant }>({
      role: "status",
      state: (state) => ({ label: state.label, variant: state.variant }),
      attrs: (state) => ({ "aria-label": state.label, "data-variant": state.variant }),
    }),
  }),
  /* Agents read the loading status; the spinner itself has no actions. */
  agent: { actions: [] },
})

export { spinner, type SpinnerOptions, type SpinnerVariant }
