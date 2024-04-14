package com.hospitalx.emr.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendEmail(String ToEmail, String UserName, String VerifyCode) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                messageHelper.setTo(ToEmail);
                messageHelper.setSubject("EMR - Verification Code");
                //
                Context context = new Context();
                context.setVariable("UserName", UserName);
                context.setVariable("ToEmail", ToEmail);
                context.setVariable("VerifyCode", VerifyCode);

                String content = templateEngine.process("EmailTemplate", context);
                //
                messageHelper.setText(content, true);
            }
        };
        javaMailSender.send(preparator);
    }
}
