import { definePrimitive } from "@ui-sdk/core"

import { bindAgentContent } from "@/components/keyframery/core/agent-content-core"
import { enter } from "@/components/keyframery/core/message-scroller-core"

type MessageOptions = {
  /** `"start"` for the other person, `"end"` for your own: the avatar and bubbles move across. */
  align?: "start" | "end"
}

type MessageState = { align: "start" | "end"; content: string }

const message = definePrimitive({
  name: "message",
  options: { align: "string" },
  state: (options: MessageOptions): MessageState => ({ align: options.align ?? "start", content: "" }),
  sync: (options) => ({ align: options.align ?? "start" }),
  controlled: ["align", "content"],
  api: () => ({}),
  slots: (slot) => ({
    root: slot<{}, Pick<MessageState, "align">>({
      state: (state) => ({ align: state.align }),
      attrs: (state) => ({ "data-align": state.align }),
      bind: (el, part) => {
        enter(el)
        return bindAgentContent(el, (content) => part.store.set({ content }))
      },
    }),
    avatar: slot({}),
    content: slot({}),
    header: slot({}),
    footer: slot({}),
  }),
  /* Messages are readable entries; actions belong to the controls they contain. */
  agent: { actions: [] },
})

const messageGroup = definePrimitive({
  name: "message-group",
  state: () => ({}),
  controlled: [],
  api: () => ({}),
  slots: (slot) => ({
    root: slot({}),
  }),
  agent: { actions: [] },
})

export { message, messageGroup, type MessageOptions }
