/**
 * SIGPASS
 * 
 */

/**
 * Adopted https://github.com/hazae41/webauthnstorage
 * by Hazae41
 */

/**
 * Use WebAuthn to store authentication-protected arbitrary bytes
 *
 * @param name user-friendly name for the data
 * @param data arbitrary data of 64 bytes or less
 * @returns handle to the data
 */
async function createOrThrow(name: string, data: Uint8Array) {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
        rp: {
          id: location.hostname,
          name: location.hostname,
        },
        user: {
          id: data,
          name: name,
          displayName: name,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -8 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          residentKey: "required",
          requireResidentKey: true,
        },
      },
    });
    return new Uint8Array((credential as any).rawId);
  } catch (error) {
    return null;
  }
}


/**
 * Use WebAuthn to retrieve authentication-protected arbitrary bytes
 *
 * @param id handle to the data
 * @returns data
 */
async function getOrThrow(id: Uint8Array) {
  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
        allowCredentials: [{ type: "public-key", id }],
      },
    });
    return new Uint8Array((credential as any).response.userHandle);
  } catch (error) {
    return null;
  }
}


/**
 * Check if WebAuthn is supported
 * 
 * @returns boolean
 */
function checkBrowserWebAuthnSupport(): boolean {

  if (!navigator.credentials) {
    return false;
  }

  return true;
}

export { createOrThrow, getOrThrow, checkBrowserWebAuthnSupport };

