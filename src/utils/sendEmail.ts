import SparkPost from 'sparkpost'

const client = new SparkPost(process.env.SPARKPOST_API_KEY)

const sendConfirmationEmail = async (recipient: string, url: string) => {
  client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'confirm',
      html: `<html>
					<body>
						<p>Testing SparkPost - the world's most awesomest email service!</p>
						<a href="${url}">click this link to confirm email</a>
					</body>
				</html>`,
    },
    recipients: [{ address: recipient }],
  })
}

const sendForgotPasswordEmail = async (recipient: string, forgotPasswordLink: string) => {
  client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'forgot password',
      html: `<html>
					<body>
						<p>Testing SparkPost - the world's most awesomest email service!</p>
						<a href="${forgotPasswordLink}">This is the forgot password link</a>
					</body>
				</html>`,
    },
    recipients: [{ address: recipient }],
  })
}
export { sendConfirmationEmail, sendForgotPasswordEmail }

