"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentDetails } from "@/components/PaymentDetails";
import { useTourHistoryStore } from "@/store/useTourHistoryStore";
import { useParams } from "next/navigation";

// Sample payment history data

const paymentHistoryData = [
  {
    id: "PAY-001",
    date: new Date("2023-12-15T14:30:00"),
    amount: 1250.0,
    method: "visa",
    package: "Bangkok City Tour",
    guests: 2,
    status: "completed",
  },
  {
    id: "PAY-002",
    date: new Date("2023-12-10T09:15:00"),
    amount: 3600.0,
    method: "bank",
    package: "Phuket Island Adventure",
    guests: 4,
    status: "completed",
  },
  {
    id: "PAY-003",
    date: new Date("2023-11-28T16:45:00"),
    amount: 950.0,
    method: "visa",
    package: "Chiang Mai Cultural Tour",
    guests: 1,
    status: "completed",
  },
  {
    id: "PAY-004",
    date: new Date("2023-11-20T11:30:00"),
    amount: 2800.0,
    method: "bank",
    package: "Krabi Beach Getaway",
    guests: 3,
    status: "completed",
  },
  {
    id: "PAY-005",
    date: new Date("2023-11-05T10:00:00"),
    amount: 1800.0,
    method: "visa",
    package: "Ayutthaya Historical Park",
    guests: 2,
    status: "completed",
  },
];

const PaymentHistoryTable = () => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const params = useParams();
  const {
    bookings,
    fetchBookings,
    isLoading,
    error: historyError,
  } = useTourHistoryStore();

  useEffect(() => {
    if (params.id) {
      fetchBookings(params.id);
    }
  }, [params.id]);

  console.log("Payment History Data:", bookings);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // const sortedData = [...paymentHistoryData].sort((a, b) => {
  //   if (sortField === "date") {
  //     return sortDirection === "asc"
  //       ? a.date.getTime() - b.date.getTime()
  //       : b.date.getTime() - a.date.getTime();
  //   } else if (sortField === "amount") {
  //     return sortDirection === "asc"
  //       ? a.amount - b.amount
  //       : b.amount - a.amount;
  //   } else if (sortField === "guests") {
  //     return sortDirection === "asc"
  //       ? a.guests - b.guests
  //       : b.guests - a.guests;
  //   } else {
  //     return sortDirection === "asc"
  //       ? a[sortField].localeCompare(b[sortField])
  //       : b[sortField].localeCompare(a[sortField]);
  //   }
  // });

  return (
    <div className="rounded-md border">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Payment History</h1>
        <p className="text-muted-foreground ">
          View all your past payments for tour bookings
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("id")}
            >
              Payment ID
              {sortField === "id" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date & Time
              {sortField === "date" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              Amount
              {sortField === "amount" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            {/* <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("method")}
            >
              Method
              {sortField === "method" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead> */}
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("package")}
            >
              Package
              {sortField === "package" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("guests")}
            >
              Guests
              {sortField === "guests" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((payment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {payment?.bookingId}
              </TableCell>
              <TableCell>{format(payment.bookingDate, "PPP p")}</TableCell>
              <TableCell>${payment.total.toFixed(2)}</TableCell>
              <TableCell>
                {payment.method === "visa" ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <CreditCard className="h-3 w-3" />
                    Visa Card
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Building className="h-3 w-3" />
                    Bank Transfer
                  </Badge>
                )}
              </TableCell>
              <TableCell>{payment?.tourId?.tour_name || "N/A"}</TableCell>
              <TableCell>{payment?.sit}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Payment Details</DialogTitle>
                    </DialogHeader>
                    <PaymentDetails payment={payment} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentHistoryTable;
