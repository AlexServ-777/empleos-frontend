"use client"
import Head from "next/head";

export default function SEO({ title, description, keywords, url, noIndex = false }) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
        </Head>
    )
}