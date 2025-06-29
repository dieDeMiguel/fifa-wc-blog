import { basehub } from "basehub"
import { Intro } from "./components/intro"
import { HeroPost, PostMetaFragment } from "./components/hero-post"
import { MoreStories } from "./components/more-stories"
import { Metadata } from "next"

export const dynamic = "force-static"
export const revalidate = 30

export async function generateMetadata(): Promise<Metadata> {
  const data = await basehub().query({
    meta: {
      title: true,
      description: true,
      ogImage: {
        url: true,
      },
    },
  })

  const title = data.meta?.title || "Copa del Mundo 2026: Noticias e información para viajeros"
  const description = data.meta?.description || "Noticias e información actualizada para viajeros sobre la Copa del Mundo 2026"

  return {
    title,
    description,
    generator: "v0.dev",
    openGraph: {
      title,
      description,
      images: data.meta?.ogImage?.url
        ? [
            {
              url: data.meta.ogImage.url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.meta?.ogImage?.url ? [data.meta.ogImage.url] : [],
    },
  }
}

export default async function Page() {
  const data = await basehub().query({
    blog: {
      morePosts: true,
      posts: {
        __args: { orderBy: "date__DESC" },
        items: PostMetaFragment,
      },
    },
  })

  const heroPost = data?.blog?.posts?.items[0]
  const morePosts = data?.blog?.posts?.items?.slice(1)

  return (
    <main>
      <section className="container mx-auto px-5">
        <Intro />
        {heroPost && <HeroPost {...heroPost} />}
        {morePosts && morePosts.length > 0 && (
          <MoreStories morePosts={morePosts} title="Más Posts" />
        )}
      </section>
    </main>
  )
}
