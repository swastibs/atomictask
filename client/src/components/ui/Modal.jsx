import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return undefined;
  }, [open]);

  return (
    <dialog
      aria-labelledby="modal-title"
      className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-white/10 bg-[#11111a] p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      ref={ref}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <h2 className="font-display text-xl font-semibold" id="modal-title">{title}</h2>
        <button
          aria-label="Close dialog"
          className="rounded-lg p-2 text-muted hover:bg-white/[.06] hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}
