import SparkPost from 'sparkpost'

const client = new SparkPost(process.env.SPARKPOST_API_KEY)

export const sendEmail = async (recipient: string, url: string) => {
  const response = client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'confirm',
      html:
				`<html>
					<body>
						<p>Testing SparkPost - the world's most awesomest email service!</p>
						<a href="${url}">click this link to confirm email</a>
					</body>
				</html>`,
    },
    recipients: [{ address: recipient }],
  })

  console.log(response)
}
