/**
 * Shared CICA field surface: a 52px white field on a cream card with a 1px border at 4:1
 * (--cica-line). Every focused field, valid or not, gets the same 2px solid green ring offset
 * by 2px of cream, so focus is a clear change of at least 3:1. Red marks only the invalid border.
 */
export const fieldSurface = [
  "w-full rounded-2xl border border-[color:var(--cica-line)] bg-paper px-4 text-base text-ink",
  "placeholder:text-[color:var(--cica-green-soft)] transition-[border-color,box-shadow] duration-150",
  "focus-visible:border-green focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
  "aria-[invalid=true]:border-destructive",
  "disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none",
].join(" ")
