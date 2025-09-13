import { Handler } from '@netlify/functions';
import SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const {
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
    } = data;

    const senderEmail = 'biuro@waszbar.pl';

    const userEmail = {
      to: [{ email, name: fullName }],
      sender: { email: senderEmail, name: 'Waszbar.pl' },
      subject: 'Dziękujemy za zapytanie o ofertę',
      htmlContent: `
        <h3>Dziękujemy za zapytanie o ofertę</h3>
        <p>Dzień dobry,</p>
        <p>Dziękujemy za zainteresowanie naszą ofertą. Otrzymaliśmy Państwa zapytanie i wkrótce się z Państwem skontaktujemy.</p>
      `,
    };

    const adminNotification = {
      to: [
        { email: 'norbert.kwarciak@gmail.com', name: 'Norbert' },
        { email: 'biuro@waszbar.pl', name: 'Biuro WaszBar' },
      ],
      sender: { email: senderEmail, name: 'WaszBar.pl' },
      subject: 'Nowe zapytanie o ofertę',
      htmlContent: `
        <h3>Nowe zapytanie o ofertę</h3>
        <p><strong>Imię i nazwisko:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Lokalizacja imprezy:</strong> ${venueLocation}</p>
        <p><strong>Wybrany pakiet:</strong> ${selectedPackage}</p>
        <p><strong>Wybrany bar:</strong> ${selectedBar}</p>
        <p><strong>Wybrane usługi dodatkowe:</strong> ${selectedServices.join(', ')}</p>
        <p><strong>Liczba gości:</strong> ${numberOfGuests}</p>
        <p><strong>Data imprezy:</strong> ${date}</p>
        <p><strong>Dodatkowe uwagi:</strong> ${notes}</p>
      `,
    };

    await apiInstance.sendTransacEmail(userEmail);
    await apiInstance.sendTransacEmail(adminNotification);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    console.error('Brevo email send failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email send failed' }),
    };
  }
};

export { handler };
