import fs from "node:fs"
import path from "node:path"
import nodemailer from "nodemailer";
import _ from "lodash";
import dirname from "../../dirname.mjs";

const emailTemplates = {
    monitor_prices: fs.readFileSync(
        path.resolve(dirname, "src/emails/monitor-prices.html")
    ).toString(),

    welcomeEmail: fs.readFileSync(
        path.resolve(dirname, "src/emails/sign-up.html")
    ).toString()
}

const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})
export async function sendEmail(to, subject, template, data = {}) {

    try {
        console.log(`email sending to ${to}: ${template}`)

        data.baseApiUrl = process.env.API_URL
        data.baseAdminUrl = process.env.ADMIN_URL

        const replyTo = data.replyTo || process.env.EMAIL_BASE_REPLY_TO
        const from = `${data.from || process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`

        let html = _.template(emailTemplates[template])(data)

        console.log(html)
        await transporter.sendMail({
            from,
            to,
            replyTo,
            subject,
            html
        })
        console.log(`email sended to ${to}: ${template} `)
    } catch (e) {
        console.log("error to sending email", e)
    }


}