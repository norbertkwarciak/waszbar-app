import { Handler } from '@netlify/functions';
import SibApiV3Sdk from '@sendinblue/client';
import { createAdminNotificationEmail } from '../emailTemplates/admin-notification';
import { createUserConfirmationEmail } from '../emailTemplates/user-confirmation';

const ADMIN_EMAIL = 'biuro@waszbar.pl';
const ADMIN_SENDER_NAME = 'Waszbar.pl';
const SECONDARY_ADMIN_EMAIL = 'norbert.kwarciak@gmail.com';

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

    const userEmail = createUserConfirmationEmail({
      ...data,
      senderEmail: ADMIN_EMAIL,
      senderName: ADMIN_SENDER_NAME,
    });

    const adminNotification = createAdminNotificationEmail({
      ...data,
      senderEmail: ADMIN_EMAIL,
      senderName: ADMIN_SENDER_NAME,
      adminEmails: [
        { email: ADMIN_EMAIL, name: 'Biuro WaszBar' },
        { email: SECONDARY_ADMIN_EMAIL, name: 'Norbert' },
      ],
    });

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
