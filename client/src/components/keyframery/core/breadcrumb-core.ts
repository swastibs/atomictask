import { definePrimitive } from "@ui-sdk/core"

import { bindAgentContent } from "@/components/keyframery/core/agent-content-core"

const breadcrumb = definePrimitive({
  name: "breadcrumb",
  state: () => ({ content: "" }),
  controlled: ["content"],
  api: () => ({}),
  slots: (slot) => ({
    /* The navigation landmark. Name it with `aria-label`; the React part defaults it to "Breadcrumb". */
    root: slot({
      role: "navigation",
      bind: (el, part) => bindAgentContent(el, (content) => part.store.set({ content })),
    }),
    list: slot({ role: "list" }),
    item: slot({ role: "listitem" }),
    /* A page above this one. Renders an <a>; pass `render` for your router's link. */
    link: slot({}),
    /* This page: not a link, so it can't be followed, but read as the last step of the trail. */
    page: slot({
      role: "link",
      focus: { none: "The current page is the end of the trail, not somewhere to go." },
      press: { none: "The current page does nothing when pressed." },
      attrs: () => ({ "aria-disabled": "true", "aria-current": "page" }),
    }),
    separator: slot({
      role: "presentation",
      attrs: () => ({ "aria-hidden": "true" }),
    }),
    /* Stands for pages left out of a long trail. It's a picture: put it in a menu trigger with a name. */
    ellipsis: slot({
      role: "presentation",
      attrs: () => ({ "aria-hidden": "true" }),
    }),
  }),
  /* The trail is readable context; its links retain their native navigation. */
  agent: { actions: [] },
})

export { breadcrumb }
