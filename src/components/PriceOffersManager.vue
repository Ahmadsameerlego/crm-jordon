<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        عروض الأسعار - {{ clientName }}
      </h3>
      <button @click="showAddModal = true" class="btn-primary">
        <i class="pi pi-plus mr-2"></i>
        إضافة عرض سعر جديد
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-4">
      <div class="text-center text-red-600 dark:text-red-400">
        <i class="pi pi-exclamation-triangle text-xl mb-2"></i>
        <p>{{ error }}</p>
        <button @click="fetchPriceOffers" class="btn-primary mt-2">إعادة المحاولة</button>
      </div>
    </div>

    <!-- Price Offers List -->
    <div v-else class="space-y-4">
      <div
        v-for="offer in priceOffers"
        :key="offer.id"
        class="card p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ offer.title }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ offer.description }}
            </p>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(offer.status)"
            >
              {{ getStatusText(offer.status) }}
            </span>
            <div class="flex items-center space-x-1 space-x-reverse">
              <button
                @click="editOffer(offer)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تعديل"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="deleteOffer(offer.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                title="حذف"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">المبلغ:</span>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ offer.amount }} {{ offer.currency }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">التاريخ:</span>
            <p class="text-gray-900 dark:text-white">{{ formatDate(offer.date) }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">آخر تحديث:</span>
            <p class="text-gray-900 dark:text-white">{{ formatDate(offer.updatedAt) }}</p>
          </div>
        </div>

        <!-- Files Section -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الملفات المرفقة:</h5>
          
          <!-- Admin File -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <i class="pi pi-file-pdf text-red-500 mr-2"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                ملف العرض الأصلي:
              </span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <span v-if="offer.adminFileName" class="text-sm text-gray-900 dark:text-white">
                {{ offer.adminFileName }}
              </span>
              <button
                v-if="offer.adminFile"
                @click="downloadFile(offer.adminFile, offer.adminFileName)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تحميل"
              >
                <i class="pi pi-download"></i>
              </button>
              <button
                v-if="offer.adminFile"
                @click="previewFile(offer.adminFile)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                title="عرض"
              >
                <i class="pi pi-eye"></i>
              </button>
            </div>
          </div>

          <!-- Employee File (Signed) -->
          <div v-if="offer.employeeFile || isEmployee" class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="pi pi-file-pdf text-green-500 mr-2"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                ملف العقد الممضي:
              </span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <span v-if="offer.employeeFileName" class="text-sm text-gray-900 dark:text-white">
                {{ offer.employeeFileName }}
              </span>
              <button
                v-if="offer.employeeFile"
                @click="downloadFile(offer.employeeFile, offer.employeeFileName)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تحميل"
              >
                <i class="pi pi-download"></i>
              </button>
              <button
                v-if="offer.employeeFile"
                @click="previewFile(offer.employeeFile)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                title="عرض"
              >
                <i class="pi pi-eye"></i>
              </button>
              <button
                v-if="isEmployee && !offer.employeeFile"
                @click="uploadSignedFile(offer)"
                class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                title="رفع ملف ممضي"
              >
                <i class="pi pi-upload"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="priceOffers.length === 0" class="text-center py-12">
        <i class="pi pi-file text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">لا توجد عروض أسعار</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-2xl">
        <h3 class="text-lg font-semibold mb-4">
          {{ showEditModal ? "تعديل عرض السعر" : "إضافة عرض سعر جديد" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العنوان *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="عنوان عرض السعر"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف *
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="وصف تفصيلي للخدمة"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المبلغ *
              </label>
              <input
                v-model.number="formData.amount"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                العملة *
              </label>
              <select
                v-model="formData.currency"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">اختر العملة</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
          </div>

          <div v-if="!showEditModal">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملف PDF (اختياري)
            </label>
            <input
              ref="adminFileInput"
              type="file"
              accept=".pdf"
              @change="handleAdminFileChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              يمكنك رفع ملف PDF يحتوي على تفاصيل العرض
            </p>
          </div>

          <div class="flex justify-end space-x-3 space-x-reverse">
            <button type="button" @click="closeModal" class="btn-secondary">إلغاء</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{ showEditModal ? "تحديث" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Upload Signed File Modal -->
    <div v-if="showUploadModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <h3 class="text-lg font-semibold mb-4">رفع ملف العقد الممضي</h3>

        <form @submit.prevent="handleUploadSignedFile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملف PDF الممضي *
            </label>
            <input
              ref="employeeFileInput"
              type="file"
              accept=".pdf"
              @change="handleEmployeeFileChange"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ارفع ملف PDF للعقد الممضي من العميل
            </p>
          </div>

          <div class="flex justify-end space-x-3 space-x-reverse">
            <button type="button" @click="showUploadModal = false" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
              رفع الملف
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- File Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay">
      <div class="modal-content p-4 max-w-4xl h-3/4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">معاينة الملف</h3>
          <button @click="showPreviewModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="h-full">
          <iframe
            v-if="previewUrl"
            :src="previewUrl"
            class="w-full h-full border-0"
            title="File Preview"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePriceOffersStore } from "@/stores/priceOffers";
import type {
  PriceOffer,
  CreatePriceOfferRequest,
  UpdatePriceOfferRequest,
} from "@/types/priceOffer";

const props = defineProps<{
  clientId: string;
  clientName: string;
  isEmployee?: boolean;
}>();

const priceOffersStore = usePriceOffersStore();

// Reactive data
const showAddModal = ref(false);
const showEditModal = ref(false);
const showUploadModal = ref(false);
const showPreviewModal = ref(false);
const isSubmitting = ref(false);
const editingOffer = ref<PriceOffer | null>(null);
const uploadingOffer = ref<PriceOffer | null>(null);
const previewUrl = ref("");

const formData = ref<CreatePriceOfferRequest>({
  clientId: props.clientId,
  title: "",
  description: "",
  amount: 0,
  currency: "SAR",
});

const adminFileInput = ref<HTMLInputElement>();
const employeeFileInput = ref<HTMLInputElement>();

// Computed
const isLoading = computed(() => priceOffersStore.isLoading);
const error = computed(() => priceOffersStore.error);
const priceOffers = computed(() => priceOffersStore.getPriceOffersByClient(props.clientId));

// Methods
const fetchPriceOffers = async () => {
  await priceOffersStore.fetchPriceOffers();
};

const getStatusClass = (status: string) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  return classes[status as keyof typeof classes] || classes.pending;
};

const getStatusText = (status: string) => {
  const texts = {
    pending: "في الانتظار",
    accepted: "مقبول",
    rejected: "مرفوض",
    expired: "منتهي الصلاحية",
  };
  return texts[status as keyof typeof texts] || status;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ar-EG");
};

const resetForm = () => {
  formData.value = {
    clientId: props.clientId,
    title: "",
    description: "",
    amount: 0,
    currency: "SAR",
  };
  editingOffer.value = null;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const editOffer = (offer: PriceOffer) => {
  editingOffer.value = offer;
  formData.value = {
    clientId: offer.clientId,
    title: offer.title,
    description: offer.description,
    amount: offer.amount,
    currency: offer.currency,
  };
  showEditModal.value = true;
};

const deleteOffer = async (id: string) => {
  if (confirm("هل أنت متأكد من حذف هذا العرض؟")) {
    try {
      await priceOffersStore.deletePriceOffer(id);
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  }
};

const handleAdminFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.adminFile = target.files[0];
  }
};

const handleEmployeeFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    // Store the file for upload
    (formData.value as any).employeeFile = target.files[0];
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (showEditModal.value && editingOffer.value) {
      await priceOffersStore.updatePriceOffer(
        editingOffer.value.id,
        formData.value as UpdatePriceOfferRequest
      );
    } else {
      await priceOffersStore.createPriceOffer(formData.value);
    }
    closeModal();
  } catch (err) {
    console.error("Error submitting offer:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const uploadSignedFile = (offer: PriceOffer) => {
  uploadingOffer.value = offer;
  showUploadModal.value = true;
};

const handleUploadSignedFile = async () => {
  if (!uploadingOffer.value) return;

  isSubmitting.value = true;
  try {
    const updateData: UpdatePriceOfferRequest = {
      employeeFile: (formData.value as any).employeeFile,
    };
    await priceOffersStore.updatePriceOffer(uploadingOffer.value.id, updateData);
    showUploadModal.value = false;
    uploadingOffer.value = null;
  } catch (err) {
    console.error("Error uploading signed file:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const downloadFile = (fileUrl: string, fileName?: string) => {
  // Create a temporary link to download the file
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName || "file.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const previewFile = (fileUrl: string) => {
  previewUrl.value = fileUrl;
  showPreviewModal.value = true;
};

// Lifecycle
onMounted(() => {
  fetchPriceOffers();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.dark .modal-content {
  background: #1f2937;
  color: white;
}
</style>
