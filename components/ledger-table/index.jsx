import { Avatar, Table, Text, HStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getUserFromLocalStorage } from "@/utils/auth";
import ResolveDialog from "@/components/resolve-dialog";
import { toaster } from "@/components/ui/toaster";
import transactionApi from "@/api/transaction";

export default function LedgerTable({ tripId }) {
  const currentUser = getUserFromLocalStorage();

  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ledgerRefresh, setLedgerRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ledgerResponse = await transactionApi.get(
          `/trips/${tripId}/ledger`
        );
        setLedger(ledgerResponse.data || []);
      } catch (error) {
        toaster.create({
          title: `Error fetching ledger: ${error}`,
          type: "error",
        });
        console.error("Error fetching ledger:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ledgerRefresh]);

  const handleResolve = async (txn) => {
    setLoading(true);
    try {
      await transactionApi.post(`/trips/${tripId}/settlements`, {
        from: txn.borrower.userId,
        to: txn.lender.userId,
        amount: txn.amount,
        createdAt: new Date().toISOString(),
      });
      toaster.create({
        title: "Ledger record resolved successfully!",
        type: "success",
      });
      setLedgerRefresh((prev) => !prev);
    } catch (error) {
      toaster.create({
        title: `Error resolving legder: ${
          error.response?.data?.error || error.message
        }`,
        type: "error",
      });
      console.error("Error resolving legder:", error);
    }
  };

  if (loading) {
    return <Spinner size="xl" color="red" />;
  }

  return (
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
          {ledger?.map((txn) => (
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
                  <ResolveDialog txn={txn} onResolve={handleResolve} />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
