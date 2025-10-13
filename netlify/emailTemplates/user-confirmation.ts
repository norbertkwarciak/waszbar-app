import { renderBaseEmailLayout } from './base-email-layout';
import type { EmailData, EmailParams } from '../types';

export function createUserConfirmationEmail({
  date,
  email,
  fullName,
  notes,
  numberOfGuests,
  packagePrice,
  selectedBar,
  selectedPackage,
  selectedServices,
  senderEmail,
  senderName,
  totalCost,
  travelCost,
  venueLocation,
}: EmailParams): EmailData {
  const extraServicesHtml = selectedServices.length
    ? `<ul style="margin: 0; padding-left: 0px;">${selectedServices
        .map(
          (s) =>
            `<li style="margin-bottom: 6px;">${s.label} – <strong>${s.price.toLocaleString('pl-PL')} zł</strong></li>`,
        )
        .join('')}</ul>`
    : 'Brak';

  const bodyContent = `
    <p style="margin-bottom: 24px;">
      Dzień dobry,<br/><br/>
      Dziękujemy za zainteresowanie naszą ofertą! Otrzymaliśmy Państwa zapytanie i wkrótce się z Państwem skontaktujemy.
      Poniżej przesyłamy podsumowanie Państwa wiadomości:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; table-layout: fixed;">
      <tbody>
        <tr>
          <td style="padding: 8px 0; width: 200px;"><strong>Lokalizacja imprezy:</strong></td>
          <td style="padding: 8px 0;">${venueLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Wybrany pakiet:</strong></td>
          <td style="padding: 8px 0;">${selectedPackage.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Cena pakietu:</strong></td>
          <td style="padding: 8px 0;">${packagePrice.toLocaleString('pl-PL')} zł</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Wybrany bar:</strong></td>
          <td style="padding: 8px 0;">${selectedBar}</td>
        </tr>
        <tr valign="top">
          <td style="padding: 8px 0;"><strong>Usługi dodatkowe:</strong></td>
          <td style="padding: 8px 0;">${extraServicesHtml}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Koszt dojazdu:</strong></td>
          <td style="padding: 8px 0;">${travelCost ? `${travelCost.toLocaleString('pl-PL')} zł` : '0 zł (w cenie)'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Łączny koszt:</strong></td>
          <td style="padding: 8px 0;"><strong>${totalCost.toLocaleString('pl-PL')} zł</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Liczba gości:</strong></td>
          <td style="padding: 8px 0;">${numberOfGuests}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Data imprezy:</strong></td>
          <td style="padding: 8px 0;">${date}</td>
        </tr>
        <tr valign="top">
          <td style="padding: 8px 0;"><strong>Uwagi:</strong></td>
          <td style="padding: 8px 0;">${notes || 'Brak'}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 30px;">Pozdrawiamy serdecznie,<br/><strong>${senderName}</strong></p>
  `;

  return {
    to: [{ email, name: fullName }],
    sender: { email: senderEmail, name: senderName },
    subject: 'Dziękujemy za zapytanie o ofertę',
    htmlContent: renderBaseEmailLayout({
      title: 'Dziękujemy za zapytanie',
      bodyContent,
      headerTextColor: '#27ae60',
    }),
  };
}
