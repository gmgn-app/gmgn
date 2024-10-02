"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ScanEye, ImageUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


export default function ProfileForm() {

  const [walletName, setWalletName] = useState("");
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
    // Save the image to localStorage
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: preview,
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
  }


  return (
    <div className="flex flex-col gap-12">
    <Image
      src={preview || walletIcon}
      alt="Profile Image"
      width={100}
      height={100}
      className="rounded-full border-2 border-primary"
    />
    <Input type="file" accept="image/*" onChange={handleImageUpload} />
    {preview && (
      <div>
        <h3>Preview:</h3>
        <img src={preview} alt="Uploaded Preview" style={{ maxWidth: "300px" }} />
        <br />
      </div>
    )}
  </div>
  );
}