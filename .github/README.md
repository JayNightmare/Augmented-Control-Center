# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the AR Glasses Control Center project.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:** Push to `main`/`develop` branches, Pull Requests to `main`

**Jobs:**
- **Lint and Test:** Code quality checks and unit tests
- **Build:** Cross-platform Electron build verification
- **Security Audit:** Dependency vulnerability scanning
- **Code Quality:** Project structure and configuration validation
- **Performance:** Bundle size and performance checks

### 2. Release (`release.yml`)

**Triggers:** Version tags (e.g., `v1.0.0`, `v2.1.3`)

**Jobs:**
- **Validate:** Pre-release validation and version checking
- **Build Windows:** Windows executable with code signing
- **Build macOS Intel:** Intel Mac builds with notarization
- **Build macOS Apple Silicon:** M1/M2 Mac builds with notarization
- **Build Linux:** Linux packages (AppImage, DEB, RPM)
- **Create Release:** GitHub release with all artifacts
- **Cleanup:** Post-release cleanup and notifications

## Required Secrets

To enable code signing and notarization, you need to set up the following secrets in your GitHub repository:

### For Windows Code Signing:
- `WIN_CERT`: Base64-encoded P12 certificate file
- `WIN_CERT_PASS`: Password for the P12 certificate

### For macOS Code Signing and Notarization:
- `APPLE_CERT`: Base64-encoded P12 certificate file
- `P12_PASS`: Password for the P12 certificate
- `APPLE_ID`: Your Apple ID email address
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password for your Apple ID

## Setting Up Secrets

### 1. Windows Code Signing

1. Obtain a code signing certificate from a trusted CA (e.g., DigiCert, Sectigo)
2. Export the certificate as a P12 file
3. Convert to base64:
   ```bash
   base64 -i your-certificate.p12 | tr -d '\n'
   ```
4. Add to GitHub secrets as `WIN_CERT`
5. Add the certificate password as `WIN_CERT_PASS`

### 2. macOS Code Signing and Notarization

1. Join the Apple Developer Program ($99/year)
2. Create a Developer ID Application certificate
3. Export as P12 file with a password
4. Convert to base64:
   ```bash
   base64 -i your-certificate.p12 | tr -d '\n'
   ```
5. Add to GitHub secrets as `APPLE_CERT`
6. Add the certificate password as `P12_PASS`
7. Add your Apple ID as `APPLE_ID`
8. Generate an app-specific password at https://appleid.apple.com and add as `APPLE_APP_SPECIFIC_PASSWORD`

## Usage

### Creating a Release

1. Update version in `package.json`
2. Commit and push changes
3. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The release workflow will automatically:
   - Build for all platforms
   - Sign and notarize macOS builds
   - Sign Windows builds
   - Create a GitHub release with all artifacts

### Manual Workflow Triggers

You can also manually trigger workflows:

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select the workflow you want to run
4. Click "Run workflow"
5. Choose the branch and click "Run workflow"

## Troubleshooting

### Common Issues

1. **Code Signing Fails:**
   - Verify certificate is valid and not expired
   - Check certificate password is correct
   - Ensure certificate has the right permissions

2. **Notarization Fails:**
   - Verify Apple ID and app-specific password
   - Check that the app is properly signed
   - Ensure bundle ID matches your certificate

3. **Build Fails:**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Check for syntax errors in code

### Debugging

- Check the Actions tab for detailed logs
- Look for specific error messages in failed steps
- Verify all required secrets are set correctly

## Security Notes

- Never commit certificates or passwords to the repository
- Use app-specific passwords for Apple ID
- Regularly rotate certificates and passwords
- Monitor for security vulnerabilities in dependencies

## Support

For issues with the workflows:
1. Check the GitHub Actions documentation
2. Review the workflow logs for specific errors
3. Verify all secrets are properly configured
4. Test locally before pushing to GitHub 