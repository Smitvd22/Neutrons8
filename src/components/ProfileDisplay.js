"use client"

import Image from "next/image"

export default function ProfileDisplay() {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">John Doe</span>
      <Image src="/placeholder.svg" alt="Profile Picture" width={32} height={32} className="rounded-full" />
    </div>
  )
}

