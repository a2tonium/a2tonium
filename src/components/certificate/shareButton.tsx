import { useState } from "react"
import { Link as LinkIcon, Check } from "lucide-react"
import { FaTelegramPlane, FaFacebookF, FaLinkedinIn } from "react-icons/fa"
import ShareButton from "@/components/ui/share-button"

export function ShareButtonCertificate() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500) // Reset icon after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareLinks = [
    {
      icon: FaTelegramPlane,
      onClick: () =>
        window.open(`https://t.me/share?url=${window.location.href}`),
      label: "Share on Telegram",
    },
    {
      icon: FaFacebookF,
      onClick: () => window.open("https://facebook.com/share"),
      label: "Share on Facebook",
    },
    {
      icon: FaLinkedinIn,
      onClick: () => window.open("https://linkedin.com/share"),
      label: "Share on LinkedIn",
    },
    {
      icon: copied ? Check : LinkIcon,
      onClick: handleCopy,
      label: "Copy link",
    },
  ]

  return (
    <div>
      <ShareButton links={shareLinks} className="text-lg font-medium">
        {copied ? <Check size={15} /> : <LinkIcon size={15} />}
        Share
      </ShareButton>
    </div>
  )
}
