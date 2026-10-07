# Namecheap cPanel hosting

For automatic GitHub Actions deployments and the one-time SSH/secret setup, see
[CI and deployment setup](CI.md). Manual launch notes below are historical.

Build locally with `pnpm install --frozen-lockfile` and `pnpm build:namecheap`.
Copy `deploy/namecheap.htaccess` to `out/.htaccess`, then upload the **contents**
of `out/` into `/home/cicanrkn/public_html`. Do not upload source code,
`node_modules`, or `.next`. No Node.js application is needed for this export.
The normal `pnpm build` remains available for Vercel/server hosting.

Back up the current document root before deployment. Review any existing hidden
`.htaccess` before replacing it. Keep `cgi-bin`, certificate-validation files,
and unrelated hosting files. Enable trusted SSL before enabling HTTPS redirects.

The website is a static public site. The public admin routes now display an
unavailable notice; the exposed prototype login and non-persistent editing
controls have been removed. Real administration needs server-side authentication
and persistence before it can be enabled. The contact form does not send messages.
Content changes require rebuilding and uploading the export.

On October 7, 2026, the existing document root was backed up to
`/home/cicanrkn/cica-before-launch-20261007.zip`. The site package was uploaded
outside the public document root and extracted into `/home/cicanrkn/public_html`.
The GoDaddy apex A record was saved as `192.64.118.48` with a 600-second TTL.
Authoritative nameservers remain `ns11.domaincontrol.com` and
`ns12.domaincontrol.com`; existing email records were preserved. The existing MX
points to `mail.cicainfo.com`, which resolved to the old IP, `192.64.118.26`.
Preserve those mail records until the email setup is reviewed separately.

SSL installation through the Namecheap plugin is complete. Trusted TLS covers
`cicainfo.com` and `www.cicainfo.com`; the certificate expires April 23, 2027.
HTTP redirects to HTTPS with status 301. System DNS now resolves to
`192.64.118.48`; all 13 exported HTML files and 12 independent target launch
checks pass. Chrome confirmed the public www site renders CICA over HTTPS; the
apex Chrome check still shows a cached default page. No new hosting purchase was
made; this launch uses the existing Stellar annual subscription, which is not
permanently free.

After publication, test HTTPS, direct page loads and refreshes (for example
`/about/`, `/tournaments/`, and `/contact/`), navigation, images, mobile menus,
and the Google document/CricClubs embeds. External embed permissions depend on
those providers. Apache headers must be verified on the deployed hosting server.
