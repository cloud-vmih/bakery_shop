"use strict";
// utils/emailTemplates.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    baseTemplate: (content, headerText) => `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyBakery</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        
        .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .logo span {
            color: #fbbf24;
        }
        
        .header-text {
            font-size: 18px;
            font-weight: 500;
            opacity: 0.9;
        }
        
        .email-content {
            padding: 40px 30px;
        }
        
        .content-title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
        }
        
        .content-body {
            font-size: 16px;
            color: #4b5563;
            line-height: 1.7;
        }
        
        .otp-code {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            font-size: 32px;
            font-weight: 700;
            padding: 20px 40px;
            border-radius: 12px;
            letter-spacing: 8px;
            margin: 25px 50px 0px 0px;
            text-align: center;
        }
        
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        
        .info-box {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #10b981;
        }
        
        .warning-box {
            background: #fef3c7;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #f59e0b;
        }
        
        .refund-form-link {
            background: #f0f9ff;
            border: 2px dashed #0ea5e9;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 25px 0;
        }
        
        .form-code {
            font-size: 20px;
            font-weight: 700;
            color: #0ea5e9;
            background: white;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 10px 0;
        }
        
        .email-footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #10b981;
            text-decoration: none;
            font-weight: 500;
        }
        
        .unsubscribe {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 20px;
        }
        
        @media (max-width: 600px) {
            .email-content {
                padding: 30px 20px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .content-title {
                font-size: 20px;
            }
            
            .otp-code {
                font-size: 24px;
                padding: 15px 30px;
                letter-spacing: 6px;
            }
            
            .button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">My<span>Bakery</span></div>
            <div class="header-text">${headerText || 'Fresh & Delicious Everyday'}</div>
        </div>
        
        <div class="email-content">
            ${content}
        </div>
        
        <div class="email-footer">
            <div class="social-links">
                <a href="#" class="social-link">Facebook</a> • 
                <a href="#" class="social-link">Instagram</a> • 
                <a href="#" class="social-link">Website</a>
            </div>
            <p>MyBakery - 123 Bakery Street, Ho Chi Minh City</p>
            <p>Email: support@mybakery.com • Phone: 028 1234 5678</p>
            <p class="unsubscribe">
                <a href="#" style="color: #9ca3af;">Unsubscribe</a> | 
                <a href="#" style="color: #9ca3af;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
`,
    // 1. Template gửi OTP
    sendOTP: (userName, otpCode, purpose = 'đổi mật khẩu') => exports.emailTemplates.baseTemplate(`
    <h1 class="content-title">Mã OTP của bạn</h1>
    
    <p class="content-body">Xin chào ${userName},</p>
    <p class="content-body">Chúng tôi nhận được yêu cầu ${purpose} của bạn.</p>
    <p class="content-body">Vui lòng sử dụng mã OTP sau để hoàn tất quá trình:</p>
    
    <div class="otp-code">
        ${otpCode}
    </div>
    
    <div class="warning-box">
        <p><strong>Lưu ý quan trọng:</strong></p>
        <p>• Mã OTP có hiệu lực trong <strong>5 phút</strong></p>
        <p>• Không chia sẻ mã này với bất kỳ ai</p>
        <p>• Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</p>
    </div>
    
    <p class="content-body">
        Trân trọng,<br>
        <strong>Đội ngũ MyBakery</strong>
    </p>
`, 'Mã xác thực OTP'),
    // 2. Template verify email
    verifyEmail: (userName, verifyLink) => exports.emailTemplates.baseTemplate(`
    <h1 class="content-title">Xác minh địa chỉ email</h1>
    
    <p class="content-body">Xin chào ${userName},</p>
    <p class="content-body">Cảm ơn bạn đã đăng ký tài khoản tại MyBakery!</p>
    <p class="content-body">Để hoàn tất đăng ký và bảo vệ tài khoản của bạn, vui lòng xác minh địa chỉ email bằng cách nhấn vào nút bên dưới:</p>
    
    <div style="text-align: center;">
        <a href="${verifyLink}" class="button">
            Xác minh email ngay
        </a>
    </div>
    
    <p class="content-body">Hoặc sao chép và dán liên kết sau vào trình duyệt:</p>
    
    <div class="info-box">
        <code style="word-break: break-all; color: #111827;">${verifyLink}</code>
    </div>
    
    <div class="warning-box">
        <p><strong>Lưu ý:</strong></p>
        <p>• Liên kết xác minh sẽ hết hạn sau <strong>30 phút</strong></p>
        <p>• Xác minh email giúp bạn nhận thông báo quan trọng và khôi phục tài khoản khi cần</p>
    </div>
    
    <p class="content-body">
        Trân trọng,<br>
        <strong>Đội ngũ MyBakery</strong>
    </p>
`, 'Xác minh địa chỉ email'),
    // 3. Template form hoàn tiền
    refundFormEmail: (userName, orderId, refundFormLink) => exports.emailTemplates.baseTemplate(`
    <h1 class="content-title">Yêu cầu hoàn tiền đơn hàng</h1>
    
    <p class="content-body">Xin chào ${userName},</p>
    <p class="content-body">Chúng tôi nhận được yêu cầu hoàn tiền cho đơn hàng <strong>#${orderId}</strong> của bạn.</p>
    <p class="content-body">Để xử lý yêu cầu hoàn tiền, vui lòng điền thông tin vào form bên dưới:</p>
    
    <div class="refund-form-link">
        <p style="font-size: 18px; font-weight: 600; color: #0ea5e9; margin-bottom: 15px;">
            FORM HOÀN TIỀN
        </p>
        
        <a href="${refundFormLink}" class="button" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);">
            Mở form hoàn tiền
        </a>

    </div>
    
    <div class="info-box">
        <p><strong>Thông tin cần chuẩn bị:</strong></p>
        <p>1. Lý do hoàn tiền</p>
        <p>2. Tài khoản ngân hàng nhận tiền</p>
        <p>3. Hóa đơn/chứng từ (nếu có)</p>
    </div>
    
    <div class="warning-box">
        <p><strong>⏰ Thời gian xử lý:</strong></p>
        <p>• Xác nhận yêu cầu: 1-2 ngày làm việc</p>
        <p>• Hoàn tiền vào tài khoản: 1-2 ngày làm việc sau khi duyệt</p>
    </div>
    
    <p class="content-body">Nếu bạn cần hỗ trợ, vui lòng liên hệ:</p>
    <p class="content-body">
        📧 Email: refund@mybakery.com<br>
        📞 Hotline: 028 1234 5678 (Nhánh 2)
    </p>
    
    <p class="content-body">
        Trân trọng,<br>
        <strong>Đội ngũ hỗ trợ khách hàng MyBakery</strong>
    </p>
`, 'Yêu cầu hoàn tiền'),
};
