import { format } from "date-fns"
import { CreditCard, Building, Users, Calendar, DollarSign, Package } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function PaymentDetails({ payment }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-medium">{payment.id}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date & Time:</span>
              </div>
              <span className="font-medium">{format(payment.date, "PPP p")}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Amount:</span>
              </div>
              <span className="font-medium">${payment.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {payment.method === "visa" ? (
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Building className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Payment Method:</span>
              </div>
              <span className="font-medium">{payment.method === "visa" ? "Visa Card" : "Bank Transfer"}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tour Package:</span>
              </div>
              <span className="font-medium">{payment.package}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Number of Guests:</span>
              </div>
              <span className="font-medium">{payment.guests}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {payment.method === "visa" && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Card Number:</span>
                <span className="font-medium">**** **** **** 4321</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Card Holder:</span>
                <span className="font-medium">John Doe</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {payment.method === "bank" && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Bank Transfer Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">Bangkok Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-medium">REF-{payment.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

