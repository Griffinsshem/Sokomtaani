import LegalPage from "../../components/LegalPage";
import { CONTACT_EMAIL } from "../../lib/config";

export const metadata = {
  title: "Terms of Service",
  description: "The rules for buying and selling on SokoMtaani.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="19 November 2026">
      <p>
        By creating an account or using SokoMtaani you agree to these terms. If you don&apos;t agree, please don&apos;t
        use the service.
      </p>

      <h2>What SokoMtaani is</h2>
      <p>
        SokoMtaani is an online noticeboard that helps farmers and buyers find each other. We are not a party to any
        sale: prices, payment, quality, pickup and delivery are agreed directly between buyer and seller.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Give accurate details and keep your password secret.</li>
        <li>You are responsible for activity on your account. Tell us promptly if you think it was misused.</li>
      </ul>

      <h2>Listings</h2>
      <ul>
        <li>Only list genuine agricultural products you have the right to sell, at honest prices.</li>
        <li>Mark items as sold or delete them when they are no longer available.</li>
        <li>
          Don&apos;t post illegal, dangerous, misleading or offensive content, or images you don&apos;t have the right to
          use.
        </li>
      </ul>
      <p>We may remove listings or suspend accounts that break these rules.</p>

      <h2>Buying safely</h2>
      <ul>
        <li>Inspect goods before paying where possible, and meet in safe public places.</li>
        <li>Be cautious of requests to pay in advance to unknown sellers.</li>
      </ul>

      <h2>Liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;. To the extent the law allows, we are not liable for losses
        arising from transactions between users or from temporary unavailability of the service.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. We&apos;ll change the date above when we do.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
