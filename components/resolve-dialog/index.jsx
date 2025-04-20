import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ResolveDialog({ txn, onResolve }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    onResolve(txn);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} placement="center">
      <Dialog.Trigger asChild>
        <Button size="xs">Resolve</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                This action cannot be undone. This will permanently resolve this
                record:
              </Text>
              Borrower: {txn.borrower.name}
              <br />
              Lender: {txn.lender.name}
              <br />
              Amount: <b>${txn.amount}</b>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button colorPalette="red" onClick={handleSubmit}>
                Resolve
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
