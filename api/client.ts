// API 配置
const API_URL = import.meta.env.VITE_API_URL || "https://sendmail.ptsfdtz.top";

// 类型定义
export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}

export interface EmailResponse {
  ok?: boolean;
  id?: string;
  error?: string;
  [key: string]: any;
}

// ===================== 认证 API =====================
export const authAPI = {
  /**
   * 用户登录
   * @param password 用户输入的密码
   * @returns 认证响应
   */
  login: async (password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      return {
        success: false,
        error: "Authentication failed",
      };
    } catch (error) {
      console.error("Auth login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// ===================== 邮件 API =====================
export const emailAPI = {
  /**
   * 发送邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param html 邮件内容（HTML格式）
   * @param token 认证令牌
   * @returns 邮件发送响应
   */
  sendEmail: async (
    to: string,
    subject: string,
    html: string,
    token?: string
  ): Promise<EmailResponse> => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/send-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to,
          subject,
          html,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { ok: true, ...data };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: errorData.error || `HTTP ${response.status}`,
      };
    } catch (error) {
      console.error("Email send error:", error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// 导出 API URL，供需要的地方使用
export { API_URL };
