export function renderBaseEmailLayout({
  title,
  bodyContent,
  headerTextColor = '#c0392b',
}: {
  title: string;
  bodyContent: string;
  headerTextColor?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="format-detection" content="telephone=no" />
    <title>${title}</title>
    <style type="text/css">
      /* Mobile only – stack the value under its label. */
      @media only screen and (max-width: 600px) {
        .wb-wrapper {
          padding: 0 !important;
        }
        .wb-card {
          border-radius: 0 !important;
        }
        .wb-content {
          padding: 20px !important;
        }
        .wb-table {
          table-layout: auto !important;
        }
        .wb-label,
        .wb-value {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .wb-label {
          padding: 12px 0 2px 0 !important;
        }
        .wb-value {
          padding: 0 0 4px 0 !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0;">
    <div class="wb-wrapper" style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f5f5f5; padding: 40px 0;">
      <div class="wb-card" style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.1);">

        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1D1E24; height: 100px;">
          <tr>
            <td align="center" valign="middle">
              <img src="https://waszbar.pl/wp-content/uploads/2024/10/logo-waszbarblack.png" alt="Waszbar logo" style="max-height: 50px;" />
            </td>
          </tr>
        </table>

        <!-- Content -->
        <div class="wb-content" style="padding: 30px;">
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
  </body>
</html>`;
}
