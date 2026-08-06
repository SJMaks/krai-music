import { getMediaUrl } from "../lib/media";

export function Media({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={getMediaUrl(src)} alt={alt} className={className} loading="lazy" />
}
