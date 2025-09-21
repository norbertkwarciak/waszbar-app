import { renderBaseEmailLayout } from './base-email-layout';
import type { EmailData, EmailParams } from '../types';

interface AdminEmailParams extends EmailParams {
  adminEmails: { email: string; name: string }[];
}

export function createAdminNotificationEmail({
  fullName,
  email,
  phone,
  venueLocation,
  selectedPackage,
  selectedBar,
  selectedServices,
  notes,
  numberOfGuests,
  date,
  packagePrice,
  senderEmail,
  senderName,
  adminEmails,
}: AdminEmailParams): EmailData {
  const extraServicesHtml = selectedServices.length
    ? `<ul style="margin: 0; padding-left: 20px;">${selectedServices
        .map(
          (s) =>
            `<li style="margin-bottom: 6px;">${s.label} – <strong>${s.price.toLocaleString(
              'pl-PL',
            )} zł</strong></li>`,
        )
        .join('')}</ul>`
    : 'Brak';

  const bodyContent = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; table-layout: fixed;">
      <tbody>
        <tr>
          <td style="padding: 8px 0; width: 200px;"><strong>Imię i nazwisko:</strong></td>
          <td style="padding: 8px 0;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Email:</strong></td>
          <td style="padding: 8px 0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Telefon:</strong></td>
          <td style="padding: 8px 0;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Lokalizacja imprezy:</strong></td>
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
          <td style="padding: 8px 0;"><strong>Liczba gości:</strong></td>
          <td style="padding: 8px 0;">${numberOfGuests}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Data imprezy:</strong></td>
          <td style="padding: 8px 0;">${date}</td>
        </tr>
        <tr valign="top">
          <td style="padding: 8px 0;"><strong>Dodatkowe uwagi:</strong></td>
          <td style="padding: 8px 0;">${notes || 'Brak'}</td>
        </tr>
      </tbody>
    </table>
  `;

  return {
    to: adminEmails,
    sender: { email: senderEmail, name: senderName },
    subject: 'Nowe zapytanie o ofertę',
    htmlContent: renderBaseEmailLayout({
      title: 'Nowe zapytanie o ofertę',
      bodyContent,
    }),
  };
}
