<template>
  <div class="forget-password-container">
    <div class="card password-reset-card">
      <!-- Header -->
      <div class="card-header">
        <h1 class="card-title">
          <i class="fas fa-key" aria-hidden="true"></i>
          Password Reset
        </h1>
        <p class="card-subtitle">Forgot your password? No worries!</p>
      </div>

      <!-- Form Body -->
      <div class="card-body">
        <p class="instruction-text">
          Enter your email address and we'll send you a secure link to reset your password.
        </p>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">
              Email Address
              <span class="required" aria-label="required">*</span>
            </label>
            
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-envelope" aria-hidden="true"></i>
              </span>
              <input
                id="email"
                type="email"
                class="form-control"
                :class="{
                  'is-valid': isEmailValid && email.trim(),
                  'is-invalid': hasEmailError || (email.trim() && !isEmailValid)
                }"
                v-model.trim="email"
                :disabled="isLoading"
                placeholder="Enter your email address"
                autocomplete="email"
                required
                aria-describedby="email-help email-error"
                @blur="validateEmail"
                @input="clearMessages"
              />
            </div>
            
            <!-- Email Help Text -->
            <div id="email-help" class="form-text">
              We'll send reset instructions to this email address.
            </div>
            
            <!-- Email Error Message -->
            <div 
              v-if="emailError" 
              id="email-error" 
              class="invalid-feedback"
              role="alert"
            >
              {{ emailError }}
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-submit"
            :disabled="!canSubmit"
            :aria-busy="isLoading"
          >
            <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
            <i v-else class="fas fa-paper-plane" aria-hidden="true"></i>
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <!-- Success Message -->
        <div 
          v-if="successMessage" 
          class="alert alert-success"
          role="alert"
          aria-live="polite"
        >
          <i class="fas fa-check-circle" aria-hidden="true"></i>
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div 
          v-if="errorMessage" 
          class="alert alert-danger"
          role="alert"
          aria-live="assertive"
        >
          <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
          {{ errorMessage }}
        </div>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <router-link to="/" class="btn btn-link btn-back">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
          Back to Login
        </router-link>
        
        <div class="help-text">
          Remember your password? 
          <router-link to="/" class="link-primary">Sign in instead</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgetPassword',
  data() {
    return {
      email: '',
      isLoading: false,
      successMessage: '',
      errorMessage: '',
      emailError: '',
      hasSubmitted: false,
      
      // Configuration
      apiConfig: {
        baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000',
        timeout: 10000 // 10 seconds
      }
    }
  },

  computed: {
    // Validate email format
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.email);
    },

    // Check if email has validation errors
    hasEmailError() {
      return !!this.emailError;
    },

    // Determine if form can be submitted
    canSubmit() {
      return this.isEmailValid && 
             this.email.trim() && 
             !this.isLoading && 
             !this.hasEmailError;
    }
  },

  methods: {
    // Validate email on blur
    validateEmail() {
      this.emailError = '';
      
      if (!this.email.trim()) {
        this.emailError = 'Email address is required';
        return false;
      }

      if (!this.isEmailValid) {
        this.emailError = 'Please enter a valid email address';
        return false;
      }

      if (this.email.length > 254) {
        this.emailError = 'Email address is too long';
        return false;
      }

      return true;
    },

    // Clear all messages when user starts typing
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
      if (this.hasSubmitted) {
        this.emailError = '';
      }
    },

    // Handle form submission
    async handleSubmit() {
      this.hasSubmitted = true;
      this.clearMessages();

      // Validate email before submission
      if (!this.validateEmail()) {
        return;
      }

      await this.sendResetRequest();
    },

    // Send password reset request
    async sendResetRequest() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await this.makeApiRequest();
        this.handleSuccess(response);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    // Make API request with proper error handling
    async makeApiRequest() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);

      try {
        const response = await fetch(`${this.apiConfig.baseUrl}/api/users/forgetPassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: this.email }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },

    // Handle successful response
    handleSuccess(response) {
      this.successMessage = response.user?.message || 'Reset link sent successfully! Please check your email.';
      this.email = ''; // Clear form on success
      
      // Auto-redirect after success (optional)
      setTimeout(() => {
        if (this.successMessage) {
          this.$router.push('/');
        }
      }, 5000);
    },

    // Handle error response
    handleError(error) {
      console.error('Password reset error:', error);

      if (error.name === 'AbortError') {
        this.errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('fetch')) {
        this.errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('404')) {
        this.errorMessage = 'Email address not found. Please check and try again.';
      } else if (error.message.includes('429')) {
        this.errorMessage = 'Too many requests. Please wait before trying again.';
      } else {
        this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
    },

    // Handle back navigation
    goBack() {
      this.$router.go(-1);
    }
  },

  // Cleanup on component destroy
  beforeUnmount() {
    // Clear any pending timeouts
    this.isLoading = false;
  },

  // Set focus on email input when component mounts
  mounted() {
    this.$nextTick(() => {
      const emailInput = this.$el.querySelector('#email');
      if (emailInput) {
        emailInput.focus();
      }
    });
  }
}
</script>

<style scoped>
/* Container and Layout */
.forget-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.password-reset-card {
  width: 100%;
  max-width: 450px;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: white;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Styles */
.card-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  border-bottom: none;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.card-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
  font-weight: 400;
}

/* Body Styles */
.card-body {
  padding: 2rem 1.5rem;
}

.instruction-text {
  color: #6c757d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-align: center;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.input-group {
  position: relative;
  display: flex;
  margin-bottom: 0.5rem;
}

.input-group-text {
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
  padding: 0.75rem;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.form-control {
  border: 1px solid #ced4da;
  border-left: none;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.7;
  cursor: not-allowed;
}

.form-control.is-valid {
  border-color: #28a745;
}

.form-control.is-valid:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}

/* Button Styles */
.btn-submit {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

/* Loading Spinner */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Alert Styles */
.alert {
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

/* Footer Styles */
.card-footer {
  background-color: #f8f9fa;
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #dee2e6;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.btn-back:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.help-text {
  font-size: 0.9rem;
  color: #6c757d;
}

.link-primary {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.link-primary:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 576px) {
  .forget-password-container {
    padding: 0.5rem;
  }
  
  .password-reset-card {
    margin: 0;
    border-radius: 0.5rem;
  }
  
  .card-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .card-body {
    padding: 1.5rem 1rem;
  }
  
  .card-footer {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .password-reset-card {
    border: 2px solid #000;
  }
  
  .form-control {
    border: 2px solid #000;
  }
  
  .btn-submit {
    border: 2px solid #000;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .btn-submit:not(:disabled):hover {
    transform: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .forget-password-container {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
  
  .password-reset-card {
    background: #343a40;
    color: #f8f9fa;
  }
  
  .card-footer {
    background-color: #495057;
    border-top-color: #6c757d;
  }
  
  .form-control {
    background-color: #495057;
    border-color: #6c757d;
    color: #f8f9fa;
  }
  
  .form-control:focus {
    background-color: #495057;
    border-color: #007bff;
  }
  
  .input-group-text {
    background-color: #495057;
    border-color: #6c757d;
    color: #adb5bd;
  }
}

/* Focus Management */
.form-control:focus,
.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .forget-password-container {
    background: white;
  }
  
  .password-reset-card {
    box-shadow: none;
    border: 1px solid #000;
  }
}
</style>