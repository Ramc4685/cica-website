/**
 * Shared CICA field surface: a 52px white field on a cream card, a 1px border at 4:1
 * (--cica-line), and on focus a 1.5px green edge with a mint halo. The extra 0.5px of
 * green is drawn as a box-shadow so focusing never shifts the layout.
 */
export const fieldSurface = [
  "w-full rounded-2xl border border-[color:var(--cica-line)] bg-paper px-4 text-base text-ink",
  "placeholder:text-[color:var(--cica-green-soft)] transition-[border-color,box-shadow] duration-150",
  "focus-visible:border-green focus-visible:outline-none",
  "focus-visible:shadow-[0_0_0_0.5px_hsl(var(--cica-green-hsl)),0_0_0_4.5px_hsl(var(--cica-mint-hsl)/0.6)]",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:shadow-[0_0_0_0.5px_hsl(var(--destructive)),0_0_0_4.5px_hsl(var(--destructive)/0.2)]",
  "disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none",
].join(" ")
