import { ref, reactive } from "vue";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export function useForm<T extends Record<string, any>>(initialData: T, rules?: ValidationRules) {
  const formData = reactive<T>({ ...initialData });
  const errors = reactive<Record<string, string>>({});
  const isSubmitting = ref(false);

  const validateField = (field: string, value: any): string => {
    if (!rules || !rules[field]) return "";

    const rule = rules[field];

    if (rule.required && (!value || value.toString().trim() === "")) {
      return "هذا الحقل مطلوب";
    }

    if (value && rule.minLength && value.toString().length < rule.minLength) {
      return `يجب أن يكون الطول على الأقل ${rule.minLength} أحرف`;
    }

    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      return `يجب أن يكون الطول على الأكثر ${rule.maxLength} أحرف`;
    }

    if (value && rule.pattern && !rule.pattern.test(value.toString())) {
      return "القيمة غير صحيحة";
    }

    if (value && rule.custom) {
      const result = rule.custom(value);
      if (typeof result === "string") {
        return result;
      }
      if (!result) {
        return "القيمة غير صحيحة";
      }
    }

    return "";
  };

  const validateForm = (): boolean => {
    let isValid = true;
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });

    if (rules) {
      Object.keys(rules).forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      });
    }

    return isValid;
  };

  const setFieldError = (field: string, error: string) => {
    errors[field] = error;
  };

  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });
  };

  const resetForm = () => {
    Object.keys(initialData).forEach((key) => {
      formData[key] = initialData[key];
    });
    clearErrors();
  };

  const setFormData = (data: Partial<T>) => {
    Object.keys(data).forEach((key) => {
      if (key in formData) {
        formData[key] = data[key]!;
      }
    });
  };

  return {
    formData,
    errors,
    isSubmitting,
    validateField,
    validateForm,
    setFieldError,
    clearErrors,
    resetForm,
    setFormData,
  };
}
