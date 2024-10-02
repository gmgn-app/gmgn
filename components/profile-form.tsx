"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Save, Rainbow, Pencil } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function ProfileForm() {
  const { toast } = useToast();
  const [walletName, setWalletName] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [walletIcon, setWalletIcon] = useState("");
  // state for file input
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const GMGN_WALLET = localStorage.getItem("gmgn-wallet");
    if (GMGN_WALLET) {
      const wallet = JSON.parse(GMGN_WALLET);
      setWalletName(wallet.username);
      setWalletIcon(wallet.icon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the preview when image changes
  useEffect(() => {
    if (uploadedImage) {
      setPreview(uploadedImage);
    }
  }, [uploadedImage]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleImageSave() {
    if (preview === null) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "No image uploaded",
        description: "Please upload an image before saving.",
      });
      return;
    }
    // Save the image to localStorage
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: preview,
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
    setPreview(null);
    setUploadedImage(null);
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Profile image uploaded",
      description: "Your profile image has been updated successfully",
    });
  }

  function resetDefaultImage() {
    // Save the image to localStorage
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: "/default-profile.svg",
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Profile image reset",
      description: "Your profile image has been reset to default image!",
    });
  }

  function saveName() {
    // Save the name to localStorage
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: walletIcon,
      username: newWalletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
    setWalletName(newWalletName);
    setNewWalletName("");
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Wallet name updated",
      description: "Your wallet name has been updated successfully",
    });
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Your profile image
        </h2>
        <div className="flex flex-row gap-4">
          <Image
            src={walletIcon}
            alt="Profile Image"
            width={120}
            height={120}
            className="rounded-full border-2 border-primary"
          />
          <div className="flex flex-col justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-fit">
                  <Camera className="w-4 h-4 mr-2" />
                  Change image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col gap-2">
                  <DialogTitle>Change profile image</DialogTitle>
                  <DialogDescription>
                    Upload a new profile image from your device.
                  </DialogDescription>
                  <div className="flex flex-col items-center justify-center">
                    {preview ? (
                      <Image
                        src={preview ? preview : "/default-profile.svg"}
                        alt="Uploaded Preview"
                        width={250}
                        height={250}
                      />
                    ) : (
                      <div className="w-[250px] h-[250px] bg-secondary"></div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <Button
                      onClick={handleImageSave}
                      className="w-fit self-end"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save image
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              onClick={resetDefaultImage}
              className="w-fit"
              variant="secondary"
            >
              <Rainbow className="w-4 h-4 mr-2" />
              Default image
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold tracking-tight">Your name</h2>
        <p className="text-2xl underline underline-offset-8">{walletName}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-fit">
              <Pencil className="w-4 h-4 mr-2" />
              Change name
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col gap-2">
              <DialogTitle>Change wallet name</DialogTitle>
              <DialogDescription>
                Choose any name for your wallet.
              </DialogDescription>
              <Input
                type="text"
                placeholder="Enter your new wallet name"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button onClick={saveName} className="w-fit self-end">
                  <Save className="w-4 h-4 mr-2" />
                  Save name
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
