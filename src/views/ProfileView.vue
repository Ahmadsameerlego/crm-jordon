<template>
  <AdminLayout>
    <template #title>{{ $t("profile.title") }}</template>

    <div class="space-y-8">
      <!-- Profile Header -->
      <div class="card p-8">
        <div class="flex items-center space-x-6 space-x-reverse">
          <div class="flex-shrink-0">
            <div
              class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
            >
              <img
                v-if="profileData.profilePicture"
                :src="profileData.profilePicture"
                :alt="profileData.name"
                class="w-24 h-24 rounded-full object-cover"
              />
              <i v-else class="pi pi-user text-4xl text-primary-600 dark:text-primary-400"></i>
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ profileData.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">{{ profileData.email }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">{{ profileData.role }}</p>
          </div>
          <div>
            <button @click="toggleEditMode" class="btn-primary">
              <i class="pi pi-pencil mr-2"></i>
              {{ isEditMode ? $t("common.cancel") : $t("profile.editProfile") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="card p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t("profile.personalInformation") }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.name") }}
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.name }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.email") }}
              </label>
              <input
                v-model="formData.email"
                type="email"
                class="input-field"
                :class="{ 'border-red-500': errors.email }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.phone") }}
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                class="input-field"
                :class="{ 'border-red-500': errors.phone }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.phone }}
              </p>
            </div>

            <!-- Position -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.position") }}
              </label>
              <input
                v-model="formData.position"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.position }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.position" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.position }}
              </p>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.department") }}
              </label>
              <input
                v-model="formData.department"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.department }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.department" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.department }}
              </p>
            </div>

            <!-- City -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t("profile.city") }}
              </label>
              <input
                v-model="formData.city"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.city }"
                :disabled="!isEditMode"
                required
              />
              <p v-if="errors.city" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.city }}
              </p>
            </div>
          </div>

          <!-- Profile Picture URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t("profile.profilePicture") }}
            </label>
            <input
              v-model="formData.profilePicture"
              type="url"
              class="input-field"
              :placeholder="$t('profile.profilePicturePlaceholder')"
              :disabled="!isEditMode"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t("profile.bio") }}
            </label>
            <textarea
              v-model="formData.bio"
              rows="4"
              class="input-field resize-none"
              :placeholder="$t('profile.bioPlaceholder')"
              :disabled="!isEditMode"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div v-if="isEditMode" class="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" @click="toggleEditMode" class="btn-secondary">
              {{ $t("common.cancel") }}
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <i class="pi pi-spin pi-spinner mr-2"></i>
                {{ $t("common.loading") }}
              </span>
              <span v-else>
                {{ $t("common.save") }}
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Security Section -->
      <div class="card p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t("profile.security") }}
        </h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ $t("profile.changePassword") }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("profile.changePasswordDescription") }}
              </p>
            </div>
            <button @click="showChangePasswordModal = true" class="btn-secondary">
              {{ $t("profile.changePassword") }}
            </button>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ $t("profile.twoFactorAuth") }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("profile.twoFactorAuthDescription") }}
              </p>
            </div>
            <button class="btn-secondary">
              {{ $t("profile.enable") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showChangePasswordModal"
      class="modal-overlay"
      @click="showChangePasswordModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("profile.changePassword") }}
          </h3>

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("profile.currentPassword") }}
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="input-field"
                :class="{ 'border-red-500': passwordErrors.currentPassword }"
                required
              />
              <p
                v-if="passwordErrors.currentPassword"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {{ passwordErrors.currentPassword }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("profile.newPassword") }}
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="input-field"
                :class="{ 'border-red-500': passwordErrors.newPassword }"
                required
              />
              <p
                v-if="passwordErrors.newPassword"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {{ passwordErrors.newPassword }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("profile.confirmPassword") }}
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="input-field"
                :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                required
              />
              <p
                v-if="passwordErrors.confirmPassword"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {{ passwordErrors.confirmPassword }}
              </p>
            </div>

            <div class="flex justify-end space-x-3 space-x-reverse pt-4">
              <button type="button" @click="showChangePasswordModal = false" class="btn-secondary">
                {{ $t("common.cancel") }}
              </button>
              <button type="submit" class="btn-primary" :disabled="isChangingPassword">
                <span v-if="isChangingPassword" class="flex items-center justify-center">
                  <i class="pi pi-spin pi-spinner mr-2"></i>
                  {{ $t("common.loading") }}
                </span>
                <span v-else>
                  {{ $t("profile.changePassword") }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useForm } from "@/composables/useForm";
import AdminLayout from "@/components/AdminLayout.vue";

// State
const isEditMode = ref(false);
const showChangePasswordModal = ref(false);
const isChangingPassword = ref(false);

// Profile data
const profileData = reactive({
  name: "أحمد محمد",
  email: "admin@example.com",
  role: "مدير النظام",
  phone: "+966 50 123 4567",
  position: "مدير عام",
  department: "الإدارة العامة",
  city: "الرياض",
  profilePicture: "",
  bio: "مدير نظام إدارة العملاء مع خبرة أكثر من 10 سنوات في مجال إدارة المشاريع والأنظمة.",
});

// Form data
const { formData, errors, isSubmitting, validateForm, resetForm } = useForm(
  {
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    city: "",
    profilePicture: "",
    bio: "",
  },
  {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, minLength: 10 },
    position: { required: true },
    department: { required: true },
    city: { required: true },
  }
);

// Password form
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Methods
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Cancel edit mode
    resetForm();
    isEditMode.value = false;
  } else {
    // Enter edit mode
    formData.name = profileData.name;
    formData.email = profileData.email;
    formData.phone = profileData.phone;
    formData.position = profileData.position;
    formData.department = profileData.department;
    formData.city = profileData.city;
    formData.profilePicture = profileData.profilePicture;
    formData.bio = profileData.bio;
    isEditMode.value = true;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // Update profile data
    Object.assign(profileData, formData);

    // Here you would typically make an API call to update the profile
    // await authStore.updateProfile(formData);

    isEditMode.value = false;
    resetForm();
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleChangePassword = async () => {
  // Reset errors
  Object.keys(passwordErrors).forEach((key) => {
    passwordErrors[key as keyof typeof passwordErrors] = "";
  });

  // Validate
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = "Current password is required";
    return;
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = "New password is required";
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = "Password must be at least 6 characters";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = "Passwords do not match";
    return;
  }

  isChangingPassword.value = true;

  try {
    // Here you would typically make an API call to change the password
    // await authStore.changePassword(passwordForm);

    showChangePasswordModal.value = false;

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error) {
    console.error("Error changing password:", error);
  } finally {
    isChangingPassword.value = false;
  }
};

onMounted(() => {
  // Initialize form data with current profile data
  formData.name = profileData.name;
  formData.email = profileData.email;
  formData.phone = profileData.phone;
  formData.position = profileData.position;
  formData.department = profileData.department;
  formData.city = profileData.city;
  formData.profilePicture = profileData.profilePicture;
  formData.bio = profileData.bio;
});
</script>
