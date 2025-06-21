"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export function PaymentOptions({ onSelect}) {
  const {id} = useParams();
  const [selected, setSelected] = useState("card");
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    // If the id is provided, we can assume the user is logged in (customize this logic as needed)
    if (id) {
      setIsLoggedIn(true);
    }
  }, [id]);

  const handleSelect = (method) => {
    setSelected(method);
    onSelect(method);
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-xs">
      <Card
        className={`cursor-pointer border-2 ${
          selected === "card" ? "border-primary" : "border-border"
        }`}
        onClick={() => handleSelect("card")}
      >
        <CardContent className="flex flex-col items-center justify-center p-4">
          <CreditCard className="h-6 w-6 mb-1" />
          <span className="text-sm">Card</span>
        </CardContent>
      </Card>
      <Card
        className={`cursor-pointer border-2 ${
          selected === "aba" ? "border-primary" : "border-border"
        }`}
        onClick={() => handleSelect("asa")}
      >
        <CardContent className="flex flex-col items-center justify-center p-4">
          <div className="font-bold text-lg">ASA</div>
        </CardContent>
      </Card>
    </div>
  );
}
