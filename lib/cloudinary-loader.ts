interface LoaderProps {
  src: string
  width: number
  quality?: number
}

export default function cloudinaryLoader({ src, width, quality }: LoaderProps): string {
  // Only transform Cloudinary-hosted images
  if (!src.includes("res.cloudinary.com")) {
    return src
  }

  // Insert f_auto,q_auto,w_{width} transform into the Cloudinary URL
  // Cloudinary URL pattern: https://res.cloudinary.com/{cloud}/image/upload/{transforms}/{public_id}
  const q = quality ?? 80
  const transforms = `f_auto,q_auto:${q},w_${width},c_limit`

  // Insert after /upload/
  return src.replace("/upload/", `/upload/${transforms}/`)
}
