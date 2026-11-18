import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/keyframery/dialog";

export default function Modal({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose aria-label="Close dialog" className="top-4 right-4" variant="icon" />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
