import { Box, Heading, Stack, Spinner, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";
import transactionApi from "@/api/transaction";
import LedgerTable from "@/components/ledger-table";

export default function TripsPage() {
  //   const [trips, setTrips] = useState([]);

  const tripId = "bzgnFDPfc2z4QDhzOqGX";
  const [loading, setLoading] = useState(true);
  const [ledger, setLedger] = useState([]);
  const [ledgerRefresh, setLedgerRefresh] = useState(false);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await transactionApi.get(`/trips/${tripId}/ledger`);
        setLedger(response.data);
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
    fetchLedger();
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
    return (
      <Center minHeight="100vh">
        <Spinner size="xl" color="red" />
      </Center>
    );
  }

  return (
    <Box>
      <Heading mb="6" size="2xl">
        All Transactions
      </Heading>
      <LedgerTable ledgerRecords={ledger} onResolve={handleResolve} />
    </Box>
  );
}
