export const emailVerificationMailGenContent = (fullname: string, verificationUrl: string) => ({
  body: {
    name: fullname,
    intro: "Welcome to AlgoCraft — your gateway to mastering algorithms and coding challenges!",
    action: {
      instructions:
        "To get started, please verify your email address by clicking the button below:",
      button: {
        color: "#15181cff",
        text: "Verify Email",
        link: verificationUrl,
      },
    },
    outro: "If you didn't create an account on AlgoCraft, you can safely ignore this email.",
  },
});

export const forgotPasswordMailGenContent = (fullname: string, forgotPasswordUrl: string) => ({
  body: {
    name: fullname,
    intro: "You requested a password reset for your AlgoCraft account.",
    action: {
      instructions:
        "Click the button below to set a new password and regain access to your account:",
      button: {
        color: "#15181cff",
        text: "Reset Password",
        link: forgotPasswordUrl,
      },
    },
    outro:
      "If you didn't request this reset, just ignore this message — no changes have been made. For your safety, the reset link will expire soon.",
  },
});
