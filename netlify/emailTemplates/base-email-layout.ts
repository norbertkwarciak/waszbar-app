export function renderBaseEmailLayout({
  title,
  bodyContent,
  headerTextColor = '#c0392b',
}: {
  title: string;
  bodyContent: string;
  headerTextColor?: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f5f5f5; padding: 40px 0;">
      <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.1);">

        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1D1E24; height: 100px;">
          <tr>
            <td align="center" valign="middle">
              <img src="https://waszbar.pl/wp-content/uploads/2024/10/logo-waszbarblack.png" alt="WaszBar logo" style="max-height: 50px;" />
            </td>
          </tr>
        </table>

        <!-- Content -->
        <div style="padding: 30px;">
          <h2 style="margin-top: 0; color: ${headerTextColor};">${title}</h2>
          ${bodyContent}
        </div>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1D1E24; height: 100px;">
          <tr>
            <td align="center" valign="middle" style="color: #fff; font-size: 13px; padding: 0 20px;">
              Wiadomość wygenerowana automatycznie – Waszbar.pl
            </td>
          </tr>
        </table>

      </div>
    </div>
  `;
}
