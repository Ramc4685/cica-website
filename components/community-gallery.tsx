"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react"
import { communityPhotos, photoFocusStyle } from "@/lib/community-photos"
import styles from "./community-gallery.module.css"

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
    <ul className={styles.grid}>
      {communityPhotos.map((photo, index) => <li key={photo.id}>
        <figure className={styles.figure}>
          <button
            type="button"
            className={styles.trigger}
            aria-label={`Enlarge photo: ${photo.alt}`}
            aria-haspopup="dialog"
            onClick={event => { triggerRef.current = event.currentTarget; setActiveIndex(index) }}
          >
            <Image src={photo.gallerySrc} width={photo.galleryWidth} height={photo.galleryHeight} alt={photo.alt} loading="lazy"
              sizes="(max-width: 760px) 100vw, 50vw" className={`community-photo ${styles.thumb}`} style={photoFocusStyle(photo)} />
            <span className={styles.expand} aria-hidden="true"><Expand size={19} /></span>
          </button>
          <figcaption className={styles.caption}><span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{photo.caption}</span></figcaption>
        </figure>
      </li>)}
    </ul>
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="community-photo-title"
      aria-describedby="community-photo-caption"
      onClose={() => { setActiveIndex(null); triggerRef.current?.focus() }}
      onCancel={closeGallery}
      onKeyDown={event => {
        if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1) }
        if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1) }
      }}
    >
      <div className={styles.dialogHead}>
        <h2 id="community-photo-title" className={styles.dialogTitle}>CICA community moments</h2>
        <button type="button" onClick={closeGallery} aria-label="Close photo viewer" className={styles.round}><X size={22} /></button>
      </div>
      {activePhoto && <Image src={activePhoto.src} width={activePhoto.width} height={activePhoto.height} alt={activePhoto.alt} loading="eager" className={styles.full} />}
      <div className={styles.dialogFoot}>
        <div><p id="community-photo-caption" className="text-sm leading-relaxed">{activePhoto?.caption}</p><p className={styles.count} aria-live="polite">{activeIndex === null ? "" : `Photo ${activeIndex + 1} of ${communityPhotos.length}`}</p></div>
        <div className={styles.controls}>
          <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo" className={styles.round}><ArrowLeft size={20} /></button>
          <button type="button" onClick={() => movePhoto(1)} aria-label="Next photo" className={styles.round}><ArrowRight size={20} /></button>
        </div>
      </div>
    </dialog>
  </>
}
