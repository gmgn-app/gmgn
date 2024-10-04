export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 p-4 item-center justify-center w-screen md:w-[768px] border-t-2 border-secondary pt-4 text-left text-muted-foreground text-sm">
      <p>
        GM GN Wallet is an independent, self-funded software built by <a href="https://blockcmd.com" className="underline underline-4 text-blue-500">BlockCMD</a>.
      </p>
      <p>
        We provide a free, open-source, client-side tool for interacting with
        the blockchain.
      </p>
      <p>
        We do not collect, hold, or store keys, account information, or
        passwords.
      </p>
      <p>
        We do not collect data passively, do not monetize the collection of
        data, and do not use your data for marketing or advertising.
      </p>
    </footer>
  );
}
