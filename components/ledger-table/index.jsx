import {
  Avatar,
  AvatarGroup,
  Box,
  Table,
  Link,
  Text,
  HStack,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { getUserFromLocalStorage } from "@/utils/auth";
import ResolveDialog from "../resolve-dialog";

export default function LedgerTable({ ledgerRecords, onResolve }) {
  const currentUser = getUserFromLocalStorage();

  return (
    <>
      <Table.ScrollArea
        borderWidth="1px"
        rounded="md"
        overflowX="auto"
        maxW="800px"
      >
        <Table.Root variant="outline" bg="white" interactive size="sm">
          <Table.Header p="4" bg="blue.800">
            <Table.Row>
              <Table.ColumnHeader color="white">Borrower</Table.ColumnHeader>
              <Table.ColumnHeader color="white">Lender</Table.ColumnHeader>
              <Table.ColumnHeader color="white" textAlign="end">
                Amount $
              </Table.ColumnHeader>
              <Table.ColumnHeader color="white" textAlign="center">
                Action
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ledgerRecords?.map((txn) => (
              <Table.Row key={`${txn.borrower.userId}-${txn.lender.userId}`}>
                <Table.Cell>
                  <HStack gap="2">
                    <Avatar.Root>
                      <Avatar.Image
                        src={`https://avatar.iran.liara.run/public?username=${txn.borrower.userId}`}
                      />
                    </Avatar.Root>
                    <Text>{txn.borrower.name}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell>
                  <HStack gap="2">
                    <Avatar.Root>
                      <Avatar.Image
                        src={`https://avatar.iran.liara.run/public?username=${txn.lender.userId}`}
                      />
                    </Avatar.Root>
                    <Text>{txn.lender.name}</Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell textAlign="end">{txn.amount.toFixed(2)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {(txn.borrower.userId === currentUser.id ||
                    txn.lender.userId === currentUser.id) && (
                    <ResolveDialog txn={txn} onResolve={onResolve} />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
}
