import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { devices, getDevice } from "@/lib/devices";

export const dynamicParams = false;

export function generateStaticParams() {
  return devices.map((d) => ({ device: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ device: string }>;
}): Promise<Metadata> {
  const { device: slug } = await params;
  const device = getDevice(slug);
  if (!device) return {};

  return {
    title: device.metaTitle,
    description: device.metaDescription,
    alternates: { canonical: `/${device.slug}` },
    openGraph: {
      type: "website",
      url: `https://sdbg.speran.dev/${device.slug}`,
      title: device.metaTitle,
      description: device.metaDescription,
      siteName: "Stream Deck GIF Background Slicer",
    },
    twitter: {
      card: "summary_large_image",
      title: device.metaTitle,
      description: device.metaDescription,
    },
  };
}

export default async function DevicePage({
  params,
}: {
  params: Promise<{ device: string }>;
}) {
  const { device: slug } = await params;
  const device = getDevice(slug);
  if (!device) notFound();

  const otherDevices = devices.filter((d) => d.slug !== device.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: device.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <article className="device-page">
        <div className="device-page-inner">
          <nav className="device-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">← Back to the slicer</Link>
          </nav>

          <h1 className="device-h1">
            {device.name} GIF Background <span className="device-h1-sub">— animated tile generator</span>
          </h1>

          <p className="device-intro">{device.intro}</p>

          <div className="device-spec-card">
            <div className="device-spec-row">
              <span className="device-spec-label">Required GIF size</span>
              <span className="device-spec-value">
                {device.gifWidth}&times;{device.gifHeight} px
              </span>
            </div>
            <div className="device-spec-row">
              <span className="device-spec-label">Buttons</span>
              <span className="device-spec-value">
                {device.buttons} ({device.rows}&times;{device.cols} grid)
              </span>
            </div>
            <div className="device-spec-row">
              <span className="device-spec-label">Tile size</span>
              <span className="device-spec-value">96&times;96 px</span>
            </div>
            <div className="device-spec-row">
              <span className="device-spec-label">Manufacturer</span>
              <span className="device-spec-value">{device.manufacturer}</span>
            </div>
            <div className="device-spec-row">
              <span className="device-spec-label">.streamDeckProfile export</span>
              <span className="device-spec-value">
                {device.exportsProfile ? "Yes" : "No (uses iCUE)"}
              </span>
            </div>
          </div>

          <Link href="/" className="device-cta">
            Open the slicer &rarr;
          </Link>

          <h2>Why use the {device.name} for an animated GIF background?</h2>
          <p>{device.uniqueAngle}</p>

          <h2>How to make a {device.name} animated GIF background</h2>
          <ol>
            <li>
              <strong>Prepare your GIF</strong> at exactly {device.gifWidth}&times;{device.gifHeight}{" "}
              pixels. Most online GIF tools (ezgif.com, kapwing, etc.) can resize for free.
            </li>
            <li>
              <strong>Open the slicer</strong> and pick the <em>{device.shortName}</em> card.
            </li>
            <li>
              <strong>Drag your GIF</strong> into the drop zone. The slicer validates dimensions
              and warns you if anything is off.
            </li>
            <li>
              <strong>Download the result.</strong>{" "}
              {device.exportsProfile
                ? "Get the .streamDeckProfile file and import it via the Stream Deck app → Profiles → Import. All tiles assign automatically."
                : "Get a ZIP with one screen.gif (for the top display) and the individual tile GIFs (for the buttons). Drop them into iCUE on the matching surfaces."}
            </li>
          </ol>

          <h2>Frequently asked questions about {device.name} GIF backgrounds</h2>
          {device.faq.map((item) => (
            <div key={item.q} className="device-faq-item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}

          <h2>Other supported devices</h2>
          <ul className="device-cross-links">
            {otherDevices.map((d) => (
              <li key={d.slug}>
                <Link href={`/${d.slug}`}>
                  <strong>{d.name}</strong>
                  <span>
                    {d.buttons} buttons · GIF {d.gifWidth}&times;{d.gifHeight} px
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/" className="device-cta">
            Open the slicer &rarr;
          </Link>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
