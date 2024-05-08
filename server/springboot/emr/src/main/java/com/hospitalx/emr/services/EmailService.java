package com.hospitalx.emr.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.hospitalx.emr.models.dtos.TicketDto;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendEmailVerify(String ToEmail, String UserName, String VerifyCode) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                messageHelper.setTo(ToEmail);
                messageHelper.setSubject("EMR - Mã xác minh");
                //
                Context context = new Context();
                context.setVariable("UserName", UserName);
                context.setVariable("ToEmail", ToEmail);
                context.setVariable("VerifyCode", VerifyCode);

                String content = templateEngine.process("VerifyTemplate", context);
                //
                messageHelper.setText(content, true);
            }
        };
        javaMailSender.send(preparator);
    }

    public void sendEmailTicket(String ToEmail, TicketDto ticket) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                messageHelper.setTo(ToEmail);
                messageHelper.setSubject("EMR - Phiếu Khám Bệnh");
                //
                Context context = new Context();
                context.setVariable("ticket", ticket);

                String content = templateEngine.process("VerifyTemplate", context);
                System.out.println(content);
                //
                messageHelper.setText(content, true);
            }
        };
        // javaMailSender.send(preparator);
    }
}
