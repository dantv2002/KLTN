package com.hospitalx.emr.services;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

import org.mindrot.jbcrypt.BCrypt;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hospitalx.emr.common.AuthProvider;
import com.hospitalx.emr.common.AuthenticationFacade;
import com.hospitalx.emr.configs.AppConfig;
import com.hospitalx.emr.exception.CustomException;
import com.hospitalx.emr.models.dtos.AccountDto;
import com.hospitalx.emr.models.dtos.UpdatePasswordDto;
import com.hospitalx.emr.models.entitys.Account;
import com.hospitalx.emr.models.entitys.Verify;
import com.hospitalx.emr.repositories.AccountRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AccountService implements IDAO<AccountDto> {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private AppConfig appConfig;
    @Autowired
    private AuthenticationFacade authenticationFacade;

    private Account account = null;

    public void updatePassword(UpdatePasswordDto updatePasswordDto) {
        if (!updatePasswordDto.getNewPassword().equals(updatePasswordDto.getConfirmNewPassword())) {
            throw new CustomException("Mật khẩu và xác nhận lại mật khẩu không giống nhau",
                    HttpStatus.BAD_REQUEST.value());
        }
        String id = authenticationFacade.getAuthentication().getName();
        AccountDto account = this.get(id);
        log.info("Update password: " + account.getEmail());
        if (BCrypt.checkpw(updatePasswordDto.getOldPassword(), account.getPassword())) {
            account.setPassword(BCrypt.hashpw(updatePasswordDto.getNewPassword(), BCrypt.gensalt(10)));
            accountRepository.save(modelMapper.map(account, Account.class));
            log.info("Update password success: " + account.getEmail());
        } else {
            log.error("Update password failed: " + account.getEmail());
            throw new CustomException("Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST.value());
        }
    }

    public AccountDto resetPassword(AccountDto accountDto) {
        log.info("Reset password: " + accountDto.getEmail());
        if (!accountDto.getPassword().equals(accountDto.getConfirmPassword())) {
            throw new CustomException("Mật khẩu và xác nhận lại mật khẩu không giống nhau",
                    HttpStatus.BAD_REQUEST.value());
        }
        this.accountRepository.findByEmailAndAuthProvider(accountDto.getEmail(), AuthProvider.LOCAL)
                .ifPresentOrElse(acc -> {
                    String code = getVerifyCode();
                    acc.setVerify(
                            new Verify(BCrypt.hashpw(code, BCrypt.gensalt(10)),
                                    Instant.now().plusSeconds(5 * 60))); // 5 minutes
                    acc.setPasswordUpdate(BCrypt.hashpw(accountDto.getPassword(), BCrypt.gensalt(10)));
                    this.account = accountRepository.save(acc);
                    emailService.sendEmailVerify(acc.getEmail(), acc.getFullName(), code);
                    log.info("Send verification code success: " + acc.getEmail());
                }, () -> {
                    log.error("Reset password failed because email {} not exists", accountDto.getEmail());
                    throw new CustomException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND.value());
                });
        // hide information
        this.account.setImageUrl(null);
        this.account.setEmailVerified(null);
        this.account.setPassword(null);
        this.account.setPasswordUpdate(null);
        this.account.setRole(null);
        this.account.setActived(null);
        this.account.setAuthProvider(null);
        this.account.setDeleted(null);
        this.account.setVerify(null);
        return modelMapper.map(this.account, AccountDto.class);
    }

    public void verifyResetPassword(String id, String code) {
        log.info("Verify reset password: " + id + " - Code: " + code);
        this.accountRepository.findById(id)
                .ifPresentOrElse(acc -> {
                    if (BCrypt.checkpw(code, acc.getVerify().getCode())
                            && acc.getVerify().getExpireAt()
                                    .isAfter(Instant.now())) {
                        acc.setPassword(acc.getPasswordUpdate());
                        acc.setPasswordUpdate(null);
                        acc.setVerify(null);
                        accountRepository.save(acc);
                        log.info("Verify reset password success: " + acc.getEmail());
                    } else {
                        log.error("Verify reset password failed: " + acc.getEmail());
                        throw new CustomException("Mã xác minh không hợp lệ hoặc đã hết hạn",
                                HttpStatus.BAD_REQUEST.value());
                    }
                }, () -> {
                    log.error(("Account not exists: " + id));
                    throw new CustomException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND.value());
                });
    }

    public AccountDto loginAccount(String email, String password) {
        log.info("Login account: " + email + " - Auth provider: " + AuthProvider.LOCAL);
        return this.accountRepository.findByEmailAndAuthProvider(email, AuthProvider.LOCAL)
                .map(acc -> {
                    if (acc.getDeleted() | !acc.getEmailVerified() || !acc.getActived()) {
                        log.error("Login account failed: " + email);
                        if (acc.getDeleted() || !acc.getEmailVerified()) {
                            throw new CustomException("Tài khoản không tồn tại", HttpStatus.UNAUTHORIZED.value());
                        } else {
                            throw new CustomException("Tài khoản đã bị khóa", HttpStatus.UNAUTHORIZED.value());
                        }
                    }
                    if (BCrypt.checkpw(password, acc.getPassword())) {
                        log.info("Login account success: " + acc.getEmail());
                        return modelMapper.map(acc, AccountDto.class);
                    } else {
                        log.error("Login account failed: " + email);
                        throw new CustomException("Tài khoản hoặc mật khẩu không chính xác",
                                HttpStatus.BAD_REQUEST.value());
                    }
                }).orElseThrow(() -> {
                    log.error("Login account failed: " + email);
                    throw new CustomException("Tài khoản hoặc mật khẩu không chính xác",
                            HttpStatus.BAD_REQUEST.value());
                });
    }

    public AccountDto registerAccount(AccountDto accountDto) {
        log.info("Register account not verified: " + accountDto.getEmail() + " - Auth provider: " + AuthProvider.LOCAL);
        if (accountDto.getFullName() == null || accountDto.getFullName().isEmpty()) {
            log.error("Full name is empty");
            throw new CustomException("Vui lòng nhập họ và tên", HttpStatus.BAD_REQUEST.value());
        }
        this.accountRepository.findByEmailAndAuthProvider(accountDto.getEmail(), AuthProvider.LOCAL)
                .ifPresentOrElse(account -> {
                    if (account.getEmailVerified()) { // account already exists
                        log.error("Email already exists: " + account.getEmail());
                        throw new CustomException("Tài khoản đã tồn tại", HttpStatus.CONFLICT.value());
                    } else { // account exists but not verified
                        this.account = createAccountAndSendVerification(account.getId(), accountDto.getEmail(),
                                accountDto.getFullName(),
                                accountDto.getPassword(), accountDto.getConfirmPassword());
                    }
                }, () -> { // account not exists
                    this.account = createAccountAndSendVerification(null, accountDto.getEmail(),
                            accountDto.getFullName(),
                            accountDto.getPassword(), accountDto.getConfirmPassword());
                });
        return modelMapper.map(this.account, AccountDto.class);
    }

    public void verifyAccount(String id, String code) {
        log.info("Verify account: " + id + " - Code: " + code);
        this.accountRepository.findById(id)
                .ifPresentOrElse(acc -> {
                    if (BCrypt.checkpw(code, acc.getVerify().getCode())
                            && acc.getVerify().getExpireAt()
                                    .isAfter(Instant.now())) {
                        acc.setEmailVerified(true);
                        acc.setVerify(null);
                        accountRepository.save(acc);
                        log.info("Verify account success: " + acc.getEmail());
                    } else {
                        log.error("Verify account failed: " + acc.getEmail());
                        throw new CustomException("Mã xác minh không hợp lệ hoặc đã hết hạn",
                                HttpStatus.BAD_REQUEST.value());
                    }
                }, () -> {
                    log.error(("Account not exists: " + id));
                    throw new CustomException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND.value());
                });
    }

    public Optional<AccountDto> get(String email, AuthProvider authProvider) {
        log.info("Get account: " + email + " " + authProvider);
        Optional<Account> account = accountRepository.findByEmailAndAuthProvider(email, authProvider);
        if (account.isPresent()) {
            log.info("Get account success: " + email);
            return Optional.of(modelMapper.map(account.get(), AccountDto.class));
        } else {
            log.error("Get account failed: " + email);
            return Optional.empty();
        }
    }

    // Override methods
    @Override
    public AccountDto save(AccountDto t) {
        log.info("Save account: " + t.toString());
        Account account = modelMapper.map(t, Account.class);
        log.info("Save account success: " + account.getEmail());
        return modelMapper.map(accountRepository.save(account), AccountDto.class);
    }

    @Override
    public Page<AccountDto> getAll(String keyword, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAll'");
    }

    @Override
    public AccountDto get(String id) {
        log.info("Get account: " + id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND.value()));
        log.info("Get account success: " + id);
        return modelMapper.map(account, AccountDto.class);
    }

    @Override
    public void update(AccountDto t) {
        log.info("Update account: " + t.toString());
        accountRepository.findById(t.getId())
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND.value()));
        accountRepository.save(modelMapper.map(t, Account.class));
        log.info("Update account success: " + t.getEmail());
    }

    @Override
    public void delete(String id) {
        log.info("Delete account: " + id);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND.value()));
        accountRepository.delete(account);
        log.info("Delete account success: " + id);
    }

    //
    //
    private Account createAccountAndSendVerification(String id, String email, String fullName, String password,
            String confirmPassword) {

        if (!password.equals(confirmPassword)) {
            throw new CustomException("Mật khẩu và xác nhận lại mật khẩu không giống nhau",
                    HttpStatus.BAD_REQUEST.value());
        }
        String code = getVerifyCode();
        Account account = new Account();
        if (id != null && !id.isEmpty()) {
            account.setId(id);
        }
        account.setFullName(fullName);
        account.setImageUrl(appConfig.getImageDefault());
        account.setEmail(email);
        account.setPassword(BCrypt.hashpw(password, BCrypt.gensalt(10)));
        account.setVerify(
                new Verify(BCrypt.hashpw(code, BCrypt.gensalt(10)),
                        Instant.now().plusSeconds(5 * 60))); // 5 minutes
        account = accountRepository.save(account);
        emailService.sendEmailVerify(account.getEmail(), account.getFullName(), code);
        log.info("Complete create account and send verification: " + account.getEmail());
        // hide information
        account.setImageUrl(null);
        account.setEmailVerified(null);
        account.setPassword(null);
        account.setRole(null);
        account.setActived(null);
        account.setAuthProvider(null);
        account.setDeleted(null);
        account.setVerify(null);
        return account;
    }

    private String getVerifyCode() {
        String verifyCode = "";
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            verifyCode += random.nextInt(10);
        }
        return verifyCode;
    }

}
