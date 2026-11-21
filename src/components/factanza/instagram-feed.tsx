import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./shared";
import {
  instagramEmbedUrl,
  instagramPosts,
  instagramProfile,
  instagramProfileEmbedUrl,
  instagramProfileUrl,
} from "@/data/instagram";

/** Sezione "Da Instagram": profilo e post incorporati con l'embed ufficiale. */
export function InstagramFeed() {
  const posts = instagramPosts
    .map((permalink) => instagramEmbedUrl(permalink))
    .filter((url): url is string => url !== null);

  return (
    <section aria-labelledby="instagram-title">
      <div id="instagram-title">
        <SectionTitle first="Le notizie" second="DA INSTAGRAM" color="magenta" />
      </div>
      <p className="body-copy mb-5">
        Gli ultimi post di @{instagramProfile}, direttamente da Instagram.
      </p>
      <div className="instagram-feed">
        {posts.length > 0 ? (
          posts.map((url) => (
            <iframe
              key={url}
              className="instagram-embed instagram-post"
              src={url}
              title={`Post Instagram di @${instagramProfile}`}
              loading="lazy"
            />
          ))
        ) : (
          <iframe
            className="instagram-embed instagram-profile"
            src={instagramProfileEmbedUrl}
            title={`Ultimi post Instagram di @${instagramProfile}`}
            loading="lazy"
          />
        )}
      </div>
      <Button variant="facta" className="w-full mt-5" asChild>
        <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer">
          Apri @{instagramProfile} su Instagram <ArrowUpRight />
        </a>
      </Button>
      <p className="demo-label">
        Contenuti di @{instagramProfile} mostrati con l'incorporamento ufficiale di Instagram.
      </p>
    </section>
  );
}
