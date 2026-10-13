import type { MarkId } from "@/components/icons/iconMap";

const url = (id: MarkId, px: number) => `${import.meta.env.BASE_URL}images/marks/${id}-${px}.png`;

/**
 * Decorative page illustration. Files exist at 88px and 144px, the 2x sources for the 44px
 * and 72px display sizes. Width and height are set so the slot is reserved before load.
 */
export function Mark({ id, size, className }: { id: MarkId; size: 44 | 72; className?: string }) {
  const hi = url(id, size * 2);
  return (
    <img
      src={hi}
      srcSet={`${hi} 2x`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={className}
    />
  );
}
