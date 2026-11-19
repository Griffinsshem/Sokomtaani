import LegalPage from "../../components/LegalPage";
import { CONTACT_EMAIL } from "../../lib/config";

export const metadata = {
  title: "Privacy Policy",
  description: "How SokoMtaani collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="19 November 2026">
      <p>
        This policy explains what personal data SokoMtaani (&ldquo;we&rdquo;) collects when you use this
        marketplace, why, and the choices you have. We process personal data in line with Kenya&apos;s Data
        Protection Act, 2019.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Account details you give us: name, email address, phone number and location.</li>
        <li>Your password, stored only as a secure one-way hash (we can&apos;t see it).</li>
        <li>Listings you post (title, description, price, category, image link) and products you save.</li>
        <li>Basic technical logs (such as IP address and request times) used to keep the service secure.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To run your account and show your listings to buyers.</li>
        <li>To let buyers contact you: your phone number, email and location are shown on your listings.</li>
        <li>To send service emails such as password-reset links.</li>
        <li>To prevent abuse (for example, rate-limiting login attempts).</li>
      </ul>
      <p>We do not sell your personal data or use it for advertising.</p>

      <h2>Cookies</h2>
      <p>
        We use only essential cookies that keep you logged in securely. We don&apos;t use advertising or
        tracking cookies.
      </p>

      <h2>Where your data is stored</h2>
      <p>
        Our service providers host the website (Vercel) and the database and API (Render), which may store data
        outside Kenya. They process it only to provide the service to us.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account and listings until you delete them or ask us to delete your account. Security
        logs are kept for a limited period.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete your personal data, or object to how we use it. Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You may also complain to the Office of the Data
        Protection Commissioner (ODPC).
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
