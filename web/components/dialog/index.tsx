import styled from "@emotion/styled";
import * as _Dialog from "@radix-ui/react-dialog";

export function Dialog({
  open,
  trigger,
  children,
}: React.PropsWithChildren<{
  trigger?: React.ReactNode;
  open?: boolean;
}>) {
  return (
    <_Dialog.Root open={open}>
      {trigger && <_Dialog.Trigger asChild>{trigger}</_Dialog.Trigger>}
      <_Dialog.Portal>
        <DialogOverlay className="dialog-overlay" />
        <DialogContent id="dialog-content" className="dialog-content">
          {children}
        </DialogContent>
      </_Dialog.Portal>
    </_Dialog.Root>
  );
}

const DialogContent = styled(_Dialog.Content)`
  border: solid 2px rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  position: relative;
  box-shadow: 0px 4px 16px 4px rgba(255, 255, 255, 0.04);
  width: 860px;

  overflow: hidden;
`;

const DialogOverlay = styled(_Dialog.Overlay)`
  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(40px);
`;
