export default async function handler(req, res) {
  console.log("Received request:", req.method, req.body);

  if (req.method === "POST") {
    const { name, phone, email, duration, details } = req.body;
    const message = `
      상담 신청이 접수되었습니다:
      이름: ${name}
      연락처: ${phone}
      이메일: ${email}
      작업 기간: ${duration}
      작업 내용: ${details}
    `;

    try {
      const response = await fetch(
        "https://us-central1-vison-makers.cloudfunctions.net/sendMessageToSlack",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message }),
        }
      );

      console.log(response);
      if (response.ok) {
        console.log("Message sent to Slack");
        res.status(200).json({ message: "Message sent to Slack" });
      } else {
        const errorText = await response.text();
        console.error("Failed to send message to Slack:", errorText);
        res.status(500).json({ error: "Failed to send message to Slack" });
      }
    } catch (error) {
      console.error("Error in handler:", error);
      res.status(500).json({ error: "Error in handler" });
    }
  } else {
    console.log("Method not allowed");
    res.status(405).json({ error: "Method not allowed" });
  }
}
