const nodemailer = require("nodemailer");
const { saveResult } = require("../services/share"); // 경로를 실제 파일 경로로 변경

jest.mock("nodemailer");

describe("services/share.js tests", () => {
  it("Should call sendEmail with the correct parameters", async () => {
    const sendMailMock = jest.fn().mockResolvedValue(true);

    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const data = { customId: "123", email: "test@example.com" };

    await saveResult(data);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.NODEMAILER_EMAIL,
        to: data.email,
        subject: expect.any(String),
        text: expect.stringContaining(data.customId),
      }),
    );
  });

  it("Should handle errors if sending an email fails", async () => {
    const sendMailMock = jest
      .fn()
      .mockRejectedValue(new Error("Failed to send email"));

    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const data = { customId: "123", email: "test@example.com" };

    await saveResult(data);

    expect(sendMailMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error sending email: ",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
