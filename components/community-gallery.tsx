"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react"
import { communityPhotos } from "@/lib/community-photos"

export function CommunityGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const activePhoto = activeIndex === null ? null : communityPhotos[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeIndex !== null && !dialog.open) dialog.showModal()
    if (activeIndex === null && dialog.open) dialog.close()
  }, [activeIndex])

  function movePhoto(direction: number) {
    setActiveIndex(current => current === null ? null : (current + direction + communityPhotos.length) % communityPhotos.length)
  }

  function closeGallery() {
    setActiveIndex(null)
  }

  return <>
    <div className="grid items-start gap-x-7 gap-y-10 md:grid-cols-2">
      {communityPhotos.map((photo, index) => <figure key={photo.id}>
        <button
          type="button"
          className="group relative block w-full overflow-hidden rounded-2xl bg-[#eeeeda] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075e3a]"
          aria-label={`Enlarge photo: ${photo.alt}`}
          aria-haspopup="dialog"
          onClick={event => { triggerRef.current = event.currentTarget; setActiveIndex(index) }}
        >
          <Image src={photo.gallerySrc} width={photo.galleryWidth} height={photo.galleryHeight} alt={photo.alt} loading="lazy" sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full" />
          <span className="absolute bottom-4 right-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#fafadd] text-[#075e3a] shadow-sm" aria-hidden="true"><Expand size={19} /></span>
        </button>
        <figcaption className="mt-4 flex items-start gap-4 text-sm leading-relaxed"><span className="shrink-0 text-[#586347]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{photo.caption}</span></figcaption>
      </figure>)}
    </div>
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[94dvh] w-[calc(100%_-_24px)] max-w-6xl overflow-auto rounded-2xl border-0 bg-[#fafadd] p-4 text-[#102b20] shadow-2xl backdrop:bg-black/80 sm:p-6"
      aria-labelledby="community-photo-title"
      aria-describedby="community-photo-caption"
      onClose={() => { setActiveIndex(null); triggerRef.current?.focus() }}
      onCancel={closeGallery}
      onKeyDown={event => {
        if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1) }
        if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1) }
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="community-photo-title" className="text-lg font-semibold">CICA community moments</h2>
        <button type="button" onClick={closeGallery} aria-label="Close photo viewer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9ea88a]"><X size={22} /></button>
      </div>
      {activePhoto && <Image src={activePhoto.src} width={activePhoto.width} height={activePhoto.height} alt={activePhoto.alt} loading="eager" className="mx-auto max-h-[65dvh] h-auto w-auto max-w-full object-contain" />}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div><p id="community-photo-caption" className="text-sm leading-relaxed">{activePhoto?.caption}</p><p className="mt-1 text-xs" aria-live="polite">{activeIndex === null ? "" : `Photo ${activeIndex + 1} of ${communityPhotos.length}`}</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9ea88a]"><ArrowLeft size={20} /></button>
          <button type="button" onClick={() => movePhoto(1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9ea88a]"><ArrowRight size={20} /></button>
        </div>
      </div>
    </dialog>
  </>
}
