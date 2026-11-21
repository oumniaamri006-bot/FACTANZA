import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";
import { Logo } from "./shared";

const defaultUrl = "https://factanza.vercel.app";

/**
 * Factanza è solo per smartphone: su computer (schermo largo con mouse) l'app è nascosta via CSS
 * e al suo posto c'è questa schermata con il QR code per aprirla dal telefono.
 */
export function DesktopGate() {
  const [url, setUrl] = useState(defaultUrl);
  useEffect(() => setUrl(window.location.origin), []);
  return (
    <div className="desktop-gate" role="region" aria-label="Apri Factanza dal telefono">
      <div className="desktop-gate-card">
        <Logo />
        <span className="sticker yellow">SOLO DA TELEFONO.</span>
        <h1>
          Factanza si usa
          <br />
          dallo smartphone.
        </h1>
        <p>
          <Smartphone /> Inquadra il codice con la fotocamera del telefono per aprire l’app.
        </p>
        <div className="desktop-gate-qr">
          <QRCodeSVG value={url} size={200} marginSize={2} />
        </div>
        <strong className="desktop-gate-url">{url.replace(/^https?:\/\//, "")}</strong>
        <span className="hand">(poi aggiungila alla schermata Home) ↗</span>
      </div>
    </div>
  );
}
