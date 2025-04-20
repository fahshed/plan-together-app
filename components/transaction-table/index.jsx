import { Avatar, AvatarGroup, Box, Table, Link, Text } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { useId, useMemo } from "react";

const categoryLabelMap = {
  food: "🍔 Food",
  transport: "🚗 Transport",
  stay: "🏨 Stay",
  activity: "🎫 Activity",
  shopping: "🛍️ Shopping",
};

export default function TransactionTable({ transactions }) {
  const baseId = useId();

  const tooltipIds = useMemo(() => {
    const ids = {};
    transactions?.forEach((txn) => {
      ids[txn.id] = {
        paidBy: `${baseId}-${txn.id}-paidBy`,
        splitBetween: txn.splitBetween.map(
          (user, idx) => `${baseId}-${txn.id}-${user.userId}-${idx}`
        ),
      };
    });
    return ids;
  }, [transactions, baseId]);

  return (
    <Box
      overflowX="auto"
      borderRadius="md"
      borderColor="gray.300"
      borderWidth="1px"
    >
      <Table.Root variant="outline" bg="white">
        <Table.Header p="4" bg="blue.800">
          <Table.Row>
            <Table.ColumnHeader color="white">Description</Table.ColumnHeader>
            <Table.ColumnHeader color="white">Category</Table.ColumnHeader>
            <Table.ColumnHeader color="white">Paid By</Table.ColumnHeader>
            <Table.ColumnHeader color="white">Split Between</Table.ColumnHeader>
            <Table.ColumnHeader color="white">Created At</Table.ColumnHeader>
            <Table.ColumnHeader color="white">Receipt</Table.ColumnHeader>
            <Table.ColumnHeader color="white" textAlign="end">
              Amount $
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions?.map((txn) => (
            <Table.Row key={txn.id}>
              <Table.Cell>{txn.description}</Table.Cell>
              <Table.Cell>{categoryLabelMap[txn.category]}</Table.Cell>
              <Table.Cell>
                <Tooltip
                  ids={{ trigger: tooltipIds[txn.id].paidBy }}
                  content={txn.paidBy.name}
                >
                  <Avatar.Root ids={{ root: tooltipIds[txn.id].paidBy }}>
                    <Avatar.Image
                      src={`https://avatar.iran.liara.run/public?username=${txn.paidBy.userId}`}
                    />
                  </Avatar.Root>
                </Tooltip>
              </Table.Cell>
              <Table.Cell>
                <AvatarGroup gap="0" spaceX="-3" size="lg">
                  {txn.splitBetween.map((user, idx) => (
                    <Tooltip
                      key={user.userId}
                      ids={{ trigger: tooltipIds[txn.id].splitBetween[idx] }}
                      content={user.name}
                    >
                      <Avatar.Root
                        ids={{ root: tooltipIds[txn.id].splitBetween[idx] }}
                      >
                        <Avatar.Image
                          src={`https://avatar.iran.liara.run/public?username=${user.userId}`}
                        />
                      </Avatar.Root>
                    </Tooltip>
                  ))}
                  {txn.splitBetween.length > 6 && (
                    <Avatar.Root variant="solid">
                      <Avatar.Fallback>
                        +{txn.splitBetween.length - 6}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  )}
                </AvatarGroup>
              </Table.Cell>
              <Table.Cell>
                {new Date(txn.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Table.Cell>
              <Table.Cell>
                {txn.receiptUrl ? (
                  <Link
                    href={txn.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Receipt <LuExternalLink />
                  </Link>
                ) : (
                  <Text>Not Available</Text>
                )}
              </Table.Cell>
              <Table.Cell textAlign="end">{txn.amount.toFixed(2)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
