import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile'

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const responseHeaders = {
	'content-type': 'application/json'
}

export async function POST(request: Request) {
	const { token } = await request.json()

	const data = (await fetch(verifyEndpoint, {
		method: 'POST',
		body: `secret=${encodeURIComponent(process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!)}&response=${encodeURIComponent(token)}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	}).then(res => res.json())) as TurnstileServerValidationResponse

	if (!data.success) {
		return new Response(JSON.stringify(data), {
			status: 400,
			headers: responseHeaders
		})
	}

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: responseHeaders
	})
}