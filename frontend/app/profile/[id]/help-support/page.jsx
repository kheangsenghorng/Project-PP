"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpCenter() {
  const faqItems = [
    {
      id: 1,
      question: "What is Travel With Us?",
      answer:
        "Travel With Us is a premium travel service that helps you plan and book your perfect vacation with personalized recommendations and 24/7 support.",
    },
    {
      id: 2,
      question: "What is Travel With Us?",
      answer:
        "We offer vacation packages, flight bookings, hotel reservations, car rentals, and guided tours to destinations worldwide.",
    },
    {
      id: 3,
      question: "What is Travel With Us?",
      answer:
        "Our service is available in over 150 countries, with local representatives in major tourist destinations.",
    },
    {
      id: 4,
      question: "What is Travel With Us?",
      answer: "You can contact our customer service team 24/7 via phone, email, or live chat for immediate assistance.",
    },
    {
      id: 5,
      question: "What is Travel With Us?",
      answer: "We offer a satisfaction guarantee and flexible cancellation policies on most bookings.",
    },
    {
      id: 6,
      question: "What is Travel With Us?",
      answer: "Join our loyalty program to earn points on every booking and get exclusive discounts and perks.",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-emerald-700 rounded-lg p-6 text-white flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-6 left-6 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute top-6 right-6 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute top-12 left-8 w-8 h-4 bg-black rounded-full"></div>
            <div className="absolute bottom-4 left-0 w-6 h-2 bg-yellow-500 rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-4 right-0 w-6 h-2 bg-yellow-500 rounded-full transform rotate-45"></div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Need help? We're here for you!</h2>
          <p className="text-white/90">
            Get quick answers, contact Travel With Us customer care, and more with our self-service help features.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-white border border-gray-200 rounded-full py-3 px-6 text-blue-600 hover:bg-blue-50 transition-colors">
          Contact Travel With Us Customer Service
        </button>
      </div>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.id} className="bg-white rounded-full border border-gray-200 overflow-hidden">
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${item.id}`} className="border-none">
                <AccordionTrigger className="px-8 py-4 hover:no-underline">
                  <span className="text-gray-700">What is Travel With Us?</span>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-4">
                  <p className="text-gray-600">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 space-y-4">
        <h3 className="text-xl text-gray-700">Didn't find answer to your question?</h3>
        <p className="text-gray-600">Get in touch with us to additional service and customer pricing</p>
        <button className="bg-emerald-600 text-white rounded-full py-2 px-6 hover:bg-emerald-700 transition-colors uppercase text-sm font-medium">
          Contact Us
        </button>
      </div>
    </div>
  )
}

