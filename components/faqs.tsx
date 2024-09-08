import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <h2 className="border-b pb-2 text-xl font-semibold">FAQs</h2>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is GMGN wallet safe?</AccordionTrigger>
          <AccordionContent>
            Yes. GMGN wallet is a non-custodial wallet, which means you are in control. Your private key is stored locally in your device Secured Enclave and never leaves it.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>I just created my wallet, what&apos;s next?</AccordionTrigger>
          <AccordionContent>
            At the moment, after creating your wallet, you have to click &quot;Load&quot; button to load your wallet. Everytime you access the website after wallet creation, you also have to load your wallet. We are working on improving this process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Things are not loading automatically</AccordionTrigger>
          <AccordionContent>
            At the moment, every interactions require you to click a button to initiate. We are working on improving this process.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
