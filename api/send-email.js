export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Health Check Object
    const health = {
        serviceIdSet: !!process.env.EMAILJS_SERVICE_ID,
        templateIdSet: !!process.env.EMAILJS_TEMPLATE_ID,
        publicKeySet: !!process.env.EMAILJS_PUBLIC_KEY
    };

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields', health });
    }

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                template_params: {
                    name,
                    email,
                    message,
                    title: "Portfolio Contact"
                }
            }),
        });

        const responseData = await response.text();

        if (response.ok) {
            return res.status(200).json({ success: true, health });
        } else {
            console.error('EmailJS Error:', responseData);
            return res.status(500).json({ 
                error: 'EmailJS Failure', 
                details: responseData,
                health
            });
        }
    } catch (error) {
        console.error('Request Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message, health });
    }
}
