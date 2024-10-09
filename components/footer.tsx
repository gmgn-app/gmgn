import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Rss } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 p-4 item-center justify-center w-screen md:w-[768px] pt-12 text-left text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-primary">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 border border-primary p-10">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4">
              Join our community
            </h2>
            <div className="flex flex-row gap-6 items-center">
              <Button className="w-fit">
                <a
                  className="flex flex-row gap-2 items-center"
                  href="https://t.me/gmgnhq"
                  target="_blank"
                >
                  Go to group chat <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <a
                className="flex flex-row gap-2 items-center underline underline-offset-2"
                target="_blank"
                href="https://x.com/gmgnHQ"
              >
                <Rss className="w-4 h-4" />
                Feed
              </a>
            </div>
          </div>
          <div className="border border-primary p-10 grow">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-6">
              Here are some links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                  About
                </h3>
                <Link href="/our-story" className="text-gray-500 text-sm">
                  Our story
                </Link>
                <Link href="/our-goals" className="text-gray-500 text-sm">
                  Our goals
                </Link>
                {/* <Link href="/treasury" className="text-gray-500 text-sm">
                    Treasury
                  </Link>
                  <Link href="/contributors" className="text-gray-500 text-sm">
                    Contributors
                  </Link> */}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                  Legal
                </h3>
                <Link href="/privacy" className="text-gray-500 text-sm">
                  Privacy policy
                </Link>
                <Link href="/community-rules" className="text-gray-500 text-sm">
                  Community rules
                </Link>
              </div>
            
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="grow border border-primary p-10">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              For developers
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-6">
              So you are ready to contribute, huh? Go to GM GN GitHub and help
              us shape the future of crypto wallet.
            </p>
            <a
              className="flex flex-row gap-2 items-center text-blue-500"
              href="https://github.com/gmgn-app"
            >
              Explore our repositories <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
