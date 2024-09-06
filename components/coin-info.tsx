import Image from "next/image";

type CoinInfoProps = {
  name: string;
  symbol: string;
  amount: string;
  logo: string;
  alt: string;
};

export default function CoinInfo({ coinInfoProps }: { coinInfoProps: CoinInfoProps }) {
  return (
    <div>
      <Image
        src={coinInfoProps.logo}
        alt={coinInfoProps.alt}
        width={50}
        height={50}
      />
      <h2>{coinInfoProps.name}</h2>
      <p>{coinInfoProps.symbol}</p>
      <p>{coinInfoProps.amount}</p>
    </div>
  );
} 