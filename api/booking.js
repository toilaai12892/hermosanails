export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({
            error: "Discord webhook is not configured."
        });
    }

    const { service, price, staff, date, time } = req.body || {};

    if (!service || !price || !staff || !date || !time) {
        return res.status(400).json({
            error: "Missing booking information."
        });
    }

    const bookingDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(bookingDate.getTime())) {
        return res.status(400).json({
            error: "Invalid booking date."
        });
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(bookingDate);

    const discordPayload = {
        username: "Hermosa Booking",
        embeds: [
            {
                title: "✨ New Appointment Request",
                description: "A new appointment was submitted through the Hermosa Nails website.",
                color: 14134886,
                fields: [
                    {
                        name: "Service",
                        value: `${service} (${price})`,
                        inline: false
                    },
                    {
                        name: "Staff",
                        value: staff,
                        inline: true
                    },
                    {
                        name: "Date",
                        value: formattedDate,
                        inline: true
                    },
                    {
                        name: "Time",
                        value: time,
                        inline: true
                    }
                ],
                footer: {
                    text: "Hermosa Nails Online Booking"
                },
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const discordResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
            const details = await discordResponse.text();

            console.error("Discord webhook error:", {
                status: discordResponse.status,
                details
            });

            return res.status(502).json({
                error: "Discord notification failed."
            });
        }

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error("Booking API error:", error);

        return res.status(500).json({
            error: "Unable to submit booking."
        });
    }
}
